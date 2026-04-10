import type { Request, Response, NextFunction } from 'express';
import { prismaClient } from '../index.js';
import { hashSync, compareSync } from 'bcrypt';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../secrets.js';
import { BadRequestException } from '../exceptions/bad-request.js';
import { ErrorCode } from '../exceptions/root.js';
import { UnprocessableEntity } from '../exceptions/validation.js';
import { SignUpSchema } from '../schema/users.js';
import { NotFoundException } from '../exceptions/not-found.js';

export const signup = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    SignUpSchema.parse(req.body);
    const { email, password, name } = req.body;

    let user = await prismaClient.user.findFirst({
        where: { email },
    });

    if (user) {
        throw new BadRequestException(
            'User already exists',
            ErrorCode.USER_ALREADY_EXISTS
        );
    }
    user = await prismaClient.user.create({
        data: { name, email, password: hashSync(password, 10) },
    });

    res.status(201).json(user);
};

export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    let user = await prismaClient.user.findFirst({
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
    console.log(jwt);
    const token = jwt.sign(
        {
            userId: user.id,
        },
        JWT_SECRET
    );

    res.json({ user, token });
};

// me => return the logged user

export const me = async (req: Request, res: Response) => {
    res.json(req.user);
};
