import { HttpException } from './root.js';

export class UnauthorizedException extends HttpException {
    constructor(message: string, errorCode: number, errors?: unknown) {
        super(message, errorCode, 401, errors);
    }
}
