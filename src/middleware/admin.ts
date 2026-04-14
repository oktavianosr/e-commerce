import type { Request, Response, NextFunction } from 'express';
import { ErrorCode } from '../exceptions/root.js';
import { UnauthorizedException } from '../exceptions/unauthorized.js';

const adminMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;

    if (!user) {
        next(new UnauthorizedException('Unauthorized', ErrorCode.UNAUTHORIZED));
        return;
    }

    if (user.role == 'ADMIN') {
        next();
    } else {
        next(new UnauthorizedException('Unauthorized', ErrorCode.UNAUTHORIZED));
    }
};

export default adminMiddleware;
