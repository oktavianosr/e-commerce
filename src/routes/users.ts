import { Router } from 'express';
import authMiddleware from '../middleware/auth.js';
import { errorHandler } from '../error-handler.js';
import userController from '../controllers/userController.js';

const usersRoutes: Router = Router();

usersRoutes.post('/address', authMiddleware, errorHandler(userController.addAddress));
usersRoutes.delete('/address/:id', authMiddleware, errorHandler(userController.deleteAddress));
usersRoutes.get('/address', authMiddleware, errorHandler(userController.listAddress));

export default usersRoutes;
