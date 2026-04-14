import type { AuthenticatedRequest } from '../types/authenticated-request.js';
import { AddressSchema } from '../schema/users.js';
import { prismaClient } from '../index.js';
import { NotFoundException } from '../exceptions/not-found.js';
import { ErrorCode } from '../exceptions/root.js';
import { BaseController, type Response } from './base.controller.js';
import { getPagination, buildPaginationMeta } from '../utils/pagination.js';
import { UnauthorizedException } from '../exceptions/unauthorized.js';
import { BadRequestException } from '../exceptions/bad-request.js';
import { Role } from '../generated/prisma/index.js';

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

    listUsers = async (req: AuthenticatedRequest, res: Response) => {
        const pagination = getPagination(req.query);
        const [count, users] = await Promise.all([
            prismaClient.user.count(),
            prismaClient.user.findMany(pagination),
        ]);

        this.respondSuccess(
            res,
            users,
            'Users retrieved successfully',
            200,
            buildPaginationMeta(count, pagination)
        );
    };

    changeUserRole = async (req: AuthenticatedRequest, res: Response) => {
        if (req.user.role !== Role.ADMIN) {
            throw new UnauthorizedException(
                'Only admins can change user roles',
                ErrorCode.UNAUTHORIZED
            );
        }

        const { role } = req.body;

        if (!Object.values(Role).includes(role)) {
            throw new BadRequestException(
                `Invalid role. Allowed values: ${Object.values(Role).join(', ')}`,
                ErrorCode.INVALID_ROLE
            );
        }

        const updated = await prismaClient.user.update({
            where: { id: Number(req.params.id) },
            data: { role },
        });

        this.respondSuccess(res, updated, 'User role updated successfully');
    };

    getUserById = async (req: AuthenticatedRequest, res: Response) => {
        const user = await prismaClient.user.findUnique({
            where: { id: Number(req.params.id) },
            include: { addresses: true },
        });

        if (!user) {
            throw new NotFoundException(
                'User not found',
                ErrorCode.USER_NOT_FOUND
            );
        }

        this.respondSuccess(res, user, 'User retrieved successfully');
    };
}

export default new UserController();
