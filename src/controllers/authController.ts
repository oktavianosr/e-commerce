import type { Request, Response, NextFunction } from 'express';
import { prismaClient } from '../index.js';
import { hashSync, compareSync } from 'bcrypt';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../secrets.js';
import { BadRequestException } from '../exceptions/bad-request.js';
import { ErrorCode } from '../exceptions/root.js';
import { SignUpSchema } from '../schema/users.js';
import { NotFoundException } from '../exceptions/not-found.js';
import { BaseController } from './base.controller.js';

class AuthController extends BaseController {
    signup = async (req: Request, res: Response, next: NextFunction) => {
        SignUpSchema.parse(req.body);
        const { email, password, name } = req.body;

        const existing = await prismaClient.user.findFirst({
            where: { email },
        });

        if (existing) {
            throw new BadRequestException(
                'User already exists',
                ErrorCode.USER_ALREADY_EXISTS
            );
        }

        const user = await prismaClient.user.create({
            data: { name, email, password: hashSync(password, 10) },
        });

        this.respondSuccess(res, user, 'User created successfully', 201);
    };

    login = async (req: Request, res: Response) => {
        const { email, password } = req.body;

        const user = await prismaClient.user.findFirst({
            where: { email },
        });

        if (!user) {
            throw new NotFoundException('User not found', ErrorCode.USER_NOT_FOUND);
        }

        if (!compareSync(password, user.password)) {
            throw new BadRequestException(
                'Invalid credentials',
                ErrorCode.INCORRECT_CREDENTIALS
            );
        }

        const token = jwt.sign({ userId: user.id }, JWT_SECRET);

        this.respondSuccess(res, { user, token }, 'Login successful');
    };

    me = async (req: Request, res: Response) => {
        this.respondSuccess(res, req.user);
    };
}

export default new AuthController();
