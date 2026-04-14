import { NotFoundException } from '../exceptions/not-found.js';
import { ErrorCode } from '../exceptions/root.js';
import type { Product } from '../generated/prisma/index.js';
import { prismaClient } from '../index.js';
import { ChangeQuantitySchema, CreateCartSchema } from '../schema/cart.js';
import { BaseController, type Response } from './base.controller.js';
import type { AuthenticatedRequest } from '../types/authenticated-request.js';

class CartController extends BaseController {
    addItemToCart = async (req: AuthenticatedRequest, res: Response) => {
        // check for the existence of the same product in user's cart and alter the quantity as required
        const validatedData = CreateCartSchema.parse(req.body);
        let product: Product;
        try {
            product = await prismaClient.product.findFirstOrThrow({
                where: { id: validatedData.productId },
            });
        } catch (error) {
            throw new NotFoundException(
                'Product not found',
                ErrorCode.PRODUCT_NOT_FOUND
            );
        }
        const cart = await prismaClient.cartItem.create({
            data: {
                userId: req.user.id,
                productId: validatedData.productId,
                quantity: validatedData.quantity,
            },
        });
        this.respondSuccess(res, cart, 'Item added to cart successfully', 201);
    };

    deleteItemFromCart = async (req: AuthenticatedRequest, res: Response) => {
        // check if user is deleting its own cart Item
        if (req.user.id !== Number(req.params.id)) {
            this.respondError(
                res,
                'You are not authorized to delete this item',
                403
            );
            return;
        }
        await prismaClient.cartItem.delete({
            where: {
                id: Number(req.params.id),
            },
        });
        this.respondSuccess(
            res,
            null,
            'Item deleted from cart successfully',
            200
        );
    };

    changeQuantity = async (req: AuthenticatedRequest, res: Response) => {
        const validatedData = ChangeQuantitySchema.parse(req.body);

        const updatedCart = await prismaClient.cartItem.update({
            where: {
                id: Number(req.params.id),
            },
            data: {
                quantity: validatedData.quantity,
            },
        });
        this.respondSuccess(
            res,
            updatedCart,
            'Quantity changed successfully',
            200
        );
    };

    getCart = async (req: AuthenticatedRequest, res: Response) => {
        const cart = await prismaClient.cartItem.findMany({
            where: {
                userId: req.user.id,
            },
            include: {
                product: true,
            },
        });
        this.respondSuccess(res, cart, 'Cart retrieved successfully', 200);
    };
}

export default new CartController();
