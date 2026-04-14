import type { Request, Response, NextFunction } from 'express';
import { ErrorCode, HttpException } from './exceptions/root.js';
import { InternalException } from './exceptions/internal-exceptions.js';
import { ZodError } from 'zod';
import { BadRequestException } from './exceptions/bad-request.js';

export const errorHandler = (method: Function) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            await method(req, res, next);
        } catch (err: unknown) {
            let exception: HttpException;
            if (err instanceof HttpException) {
                exception = err;
            } else {
                if (err instanceof ZodError) {
                    exception = new BadRequestException(
                        'Unproccessable Entity',
                        ErrorCode.UNPROCESSABLE_ENTITY,
                        err
                    );
                } else {
                    exception = new InternalException(
                        'Something went wrong',
                        err,
                        ErrorCode.INTERNAL_EXCEPTION
                    );
                }
            }
            next(exception);
        }
    };
};
