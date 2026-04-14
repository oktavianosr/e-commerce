import { HttpException, ErrorCode } from './root.js';

export class NotFoundException extends HttpException {
    constructor(message: string, errorCode: ErrorCode, errors?: unknown) {
        super(message, errorCode, 404, errors);
    }
}
