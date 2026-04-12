import type { Response } from 'express';

export class BaseController {
    protected respondSuccess(
        res: Response,
        data: any = null,
        message: string = 'Success',
        status: number = 200,
        meta: any = null
    ): void {
        res.status(status).json({
            success: true,
            message,
            data,
            ...(meta && { meta }),
        });
    }

    protected respondError(
        res: Response,
        message: string = 'Error',
        status: number = 400,
        errors: any = null
    ): void {
        res.status(status).json({
            success: false,
            message,
            errors,
        });
    }
}
