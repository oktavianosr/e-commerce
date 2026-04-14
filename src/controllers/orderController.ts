import { NotFoundException } from '../exceptions/not-found.js';
import { prismaClient } from '../index.js';
import type { AuthenticatedRequest } from '../types/authenticated-request.js';
import { BaseController, type Response } from './base.controller.js';
import { ErrorCode } from '../exceptions/root.js';

class OrderController extends BaseController {
    createOrder = async (req: AuthenticatedRequest, res: Response) => {
        // list all the cart items and proceed if cart is not empty
        const cartItems = await prismaClient.cartItem.findMany({
            where: { userId: req.user.id },
            include: { product: true },
        });

        if (cartItems.length === 0) {
            return this.respondError(res, 'Cart is empty', 400);
        }

        // create a transaction
        const order = await prismaClient.$transaction(async (tx) => {
            // calculate the total amount
            const totalAmount = cartItems.reduce((prev, current) => {
                return prev + current.quantity * Number(current.product.price);
            }, 0);

            // fetch address of user
            const address = await tx.address.findFirst({
                where: { id: Number(req.user.defaultShippingAddress) },
            });

            if (!address) {
                throw new NotFoundException(
                    'Address not found',
                    ErrorCode.ADDRESS_NOT_FOUND
                );
            }

            // create order and order products
            const order = await tx.order.create({
                data: {
                    userId: req.user.id,
                    netAmount: totalAmount,
                    address: address.formattedAddress,
                    products: {
                        create: cartItems.map((item) => ({
                            productId: item.product.id,
                            quantity: item.quantity,
                        })),
                    },
                },
            });

            // create event
            await tx.orderEvent.create({
                data: { orderId: order.id },
            });

            // clear cart
            await tx.cartItem.deleteMany({
                where: { userId: req.user.id },
            });

            return order;
        });

        this.respondSuccess(res, order, 'Order created successfully', 201);
    };

    listOrders = async (req: AuthenticatedRequest, res: Response) => {
        const orders = await prismaClient.order.findMany({
            where: {
                userId: req.user.id,
            },
        });
        this.respondSuccess(res, orders, 'Orders retrieved successfully');
    };

    cancelOrder = async (req: AuthenticatedRequest, res: Response) => {
        try {
            const order = await prismaClient.order.update({
                where: { id: Number(req.params.id) },
                data: { status: 'CANCELLED' },
            });
            await prismaClient.orderEvent.create({
                data: {
                    orderId: order.id,
                    status: 'CANCELLED',
                },
            });
            this.respondSuccess(res, order, 'Order cancelled successfully');
        } catch (err) {
            if (err instanceof NotFoundException) {
                this.respondError(res, err.message, 404);
            } else {
                this.respondError(res, 'Unknown error', 404);
            }
        }
    };

    getOrderById = async (req: AuthenticatedRequest, res: Response) => {
        try {
            const order = await prismaClient.order.findUnique({
                where: { id: Number(req.params.id) },
                include: {
                    products: true,
                    events: true,
                },
            });
            if (!order) {
                throw new NotFoundException(
                    'Order not found',
                    ErrorCode.ORDER_NOT_FOUND
                );
            }
            this.respondSuccess(res, order, 'Order retrieved successfully');
        } catch (err) {
            if (err instanceof NotFoundException) {
                this.respondError(res, err.message, 404);
            } else {
                this.respondError(res, 'Unknown error', 404);
            }
        }
    };
}

export default new OrderController();
