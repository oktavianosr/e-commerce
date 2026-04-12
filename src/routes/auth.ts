import { Router } from 'express';
import authController from '../controllers/authController.js';
import { errorHandler } from '../error-handler.js';
import authMiddleware from '../middleware/auth.js';

const authRoutes: Router = Router();

authRoutes.post('/signup', errorHandler(authController.signup));
authRoutes.post('/login', errorHandler(authController.login));
authRoutes.get('/me', authMiddleware, errorHandler(authController.me));

export default authRoutes;
