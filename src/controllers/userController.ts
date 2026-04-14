import type { AuthenticatedRequest } from '../types/authenticated-request.js';
import { AddressSchema } from '../schema/users.js';
import { prismaClient } from '../index.js';
import { NotFoundException } from '../exceptions/not-found.js';
import { ErrorCode } from '../exceptions/root.js';
import { BaseController, type Response } from './base.controller.js';

class UserController extends BaseController {
    addAddress = async (req: AuthenticatedRequest, res: Response) => {
        AddressSchema.parse(req.body);

        const address = await prismaClient.address.create({
            data: {
                ...req.body,
                userId: req.user.id,
            },
        });

        const user = await prismaClient.user.findUnique({
            where: { id: req.user.id },
            select: { defaultShippingAddress: true },
        });

        if (!user?.defaultShippingAddress) {
            await prismaClient.user.update({
                where: { id: req.user.id },
                data: { defaultShippingAddress: address.id },
            });
        }

        this.respondSuccess(res, address, 'Address added successfully', 201);
    };

    deleteAddress = async (req: AuthenticatedRequest, res: Response) => {
        try {
            await prismaClient.address.delete({
                where: { id: Number(req.params.id) },
            });

            this.respondSuccess(res, null, 'Address deleted successfully');
        } catch (err) {
            throw new NotFoundException(
                'Address not found',
                ErrorCode.ADDRESS_NOT_FOUND
            );
        }
    };

    listAddress = async (req: AuthenticatedRequest, res: Response) => {
        const addresses = await prismaClient.address.findMany({
            where: { userId: req.user.id },
        });

        this.respondSuccess(res, addresses, 'Addresses retrieved successfully');
    };
}

export default new UserController();
