import type { Request, Response } from 'express';
import { prismaClient } from '../index.js';
import { NotFoundException } from '../exceptions/not-found.js';
import { ErrorCode } from '../exceptions/root.js';
import { BaseController } from './base.controller.js';
import type { AuthenticatedRequest } from '../types/authenticated-request.js';
import { getPagination, buildPaginationMeta } from '../utils/pagination.js';

class ProductController extends BaseController {
    createProduct = async (req: AuthenticatedRequest, res: Response) => {
        const product = await prismaClient.product.create({
            data: {
                ...req.body,
                tags: req.body.tags.join(','),
            },
        });

        this.respondSuccess(res, product, 'Product created successfully', 201);
    };

    updateProduct = async (req: AuthenticatedRequest, res: Response) => {
        try {
            const body = req.body;
            if (body.tags) {
                body.tags = body.tags.join(',');
            }

            const product = await prismaClient.product.update({
                where: { id: Number(req.params.id) },
                data: body,
            });

            this.respondSuccess(res, product, 'Product updated successfully');
        } catch (err) {
            throw new NotFoundException(
                'Product not found.',
                ErrorCode.PRODUCT_NOT_FOUND
            );
        }
    };

    deleteProduct = async (req: AuthenticatedRequest, res: Response) => {
        // Assignment
    };

    listProducts = async (req: Request, res: Response) => {
        const pagination = getPagination(req.query, 10);
        const [count, products] = await Promise.all([
            prismaClient.product.count(),
            prismaClient.product.findMany(pagination),
        ]);

        this.respondSuccess(
            res,
            products,
            'Products retrieved successfully',
            200,
            buildPaginationMeta(count, pagination)
        );
    };

    getProductById = async (req: AuthenticatedRequest, res: Response) => {
        try {
            const product = await prismaClient.product.findFirstOrThrow({
                where: { id: Number(req.params.id) },
            });

            this.respondSuccess(res, product, 'Product retrieved successfully');
        } catch (err) {
            throw new NotFoundException(
                'Product not found.',
                ErrorCode.PRODUCT_NOT_FOUND
            );
        }
    };
}

export default new ProductController();
