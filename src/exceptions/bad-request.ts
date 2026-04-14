import { HttpException, ErrorCode } from './root.js';

export class BadRequestException extends HttpException {
    constructor(message: string, errorCode: ErrorCode, errors?: unknown) {
        super(message, errorCode, 400, errors);
    }
}
