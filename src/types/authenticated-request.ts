import type { Request } from 'express';
import type { User } from '../generated/prisma/index.js';

export interface AuthenticatedRequest extends Request {
    user: User;
}
