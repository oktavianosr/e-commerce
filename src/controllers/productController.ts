import { type RequestHandler } from 'express';
import { prismaClient } from '../index.js';
import { NotFoundException } from '../exceptions/not-found.js';
import { ErrorCode } from '../exceptions/root.js';

export const createProduct: RequestHandler = async (req, res) => {
    // ["key",""]

    // Create a validator to for this request
    const product = await prismaClient.product.create({
        data: {
            ...req.body,
            tags: req.body.tags.join(','),
        },
    });
    res.json(product);
};

export const updateProduct: RequestHandler = async (req, res) => {
    try {
        const product = req.body;
        if (product.tags) {
            product.tags = product.tags.join(',');
        }
        const updateProduct = await prismaClient.product.update({
            where: { id: Number(req.params.id) },
            data: product,
        });
        res.json(updateProduct);
    } catch (err) {
        throw new NotFoundException(
            'Product not found.',
            ErrorCode.PRODUCT_NOT_FOUND
        );
    }
};

export const deleteProduct: RequestHandler = async (req, res) => {
    // Assignment
};

export const listProducts: RequestHandler = async (req, res) => {
    // {
    //   count: 100,
    //     data: []
    // }

    const count = await prismaClient.product.count();
    const products = await prismaClient.product.findMany({
        skip: +req.query.skip || 0,
        take: 5,
    });
    res.json({ count, products });
};

export const getProductById: RequestHandler = async (req, res) => {
    try {
        const product = await prismaClient.product.findFirstOrThrow({
            where: { id: Number(req.params.id) },
        });
        res.json(product);
    } catch (err) {
        throw new NotFoundException(
            'Product not found.',
            ErrorCode.PRODUCT_NOT_FOUND
        );
    }
};
