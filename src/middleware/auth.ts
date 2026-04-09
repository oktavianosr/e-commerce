import type { RequestHandler } from "express";
import { UnauthorizedException } from "../exceptions/unauthorized.js";
import { ErrorCode } from "../exceptions/root.js";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../secrets.js";
import { prismaClient } from "../index.js";

const authMiddleware: RequestHandler = async (req, res, next) => {
  // 1. extract the token from header
  const token = req.headers.authorization;

  // 2. if token is not present, throw an error of unauthorized
  if (!token) {
    return next(
      new UnauthorizedException("Unauthorized", ErrorCode.UNAUTHORIZED),
    );
  }
  try {
    // 3. if token is present, verify it and  extract the payload
    const payload = jwt.verify(token, JWT_SECRET) as any;
    // 4. to get the user from the payload
    const user = await prismaClient.user.findFirst({
      where: { id: payload.userId },
    });
    if (!user) {
      return next(
        new UnauthorizedException("Unauthorized", ErrorCode.UNAUTHORIZED),
      );
    }
    // 5. attach the user to the current request object
    req.user = user;
    next();
  } catch (err) {
    next(new UnauthorizedException("Unauthorized", ErrorCode.UNAUTHORIZED));
  }
};

export default authMiddleware;
