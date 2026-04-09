import { HttpException, ErrorCode } from "./root.js";

export class NotFoundException extends HttpException {
  constructor(message: string, errorCode: ErrorCode, errors?: any) {
    super(message, errorCode, 404, errors);
  }
}
