import { Router } from 'express';
import authMiddleware from '../middleware/auth.js';
import { errorHandler } from '../error-handler.js';
import userController from '../controllers/userController.js';
import adminMiddleware from '../middleware/admin.js';

const usersRoutes: Router = Router();

usersRoutes.post(
    '/address',
    authMiddleware,
    errorHandler(userController.addAddress)
);
usersRoutes.delete(
    '/address/:id',
    authMiddleware,
    errorHandler(userController.deleteAddress)
);
usersRoutes.get(
    '/address',
    authMiddleware,
    errorHandler(userController.listAddress)
);
usersRoutes.get(
    '/:id',
    authMiddleware,
    adminMiddleware,

    errorHandler(userController.getUserById)
);
usersRoutes.put(
    '/:id/role',
    authMiddleware,
    adminMiddleware,
    errorHandler(userController.changeUserRole)
);
usersRoutes.get(
    '/',
    authMiddleware,
    adminMiddleware,
    errorHandler(userController.listUsers)
);

export default usersRoutes;
