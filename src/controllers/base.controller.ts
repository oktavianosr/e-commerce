import type { Response } from 'express';

export type { Response };

export class BaseController {
    protected respondSuccess<TData, TMeta = null>(
        res: Response,
        data: TData,
        message: string = 'Success',
        status: number = 200,
        meta?: TMeta
    ): void {
        res.status(status).json({
            success: true,
            message,
            data,
            ...(meta && { meta }),
        });
    }

    protected respondError<TErrors>(
        res: Response,
        message: string = 'Error',
        status: number = 400,
        errors?: TErrors
    ): void {
        res.status(status).json({
            success: false,
            message,
            errors,
        });
    }
}
