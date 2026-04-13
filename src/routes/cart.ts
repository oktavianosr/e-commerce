import { Router } from 'express';
import authMiddleware from '../middleware/auth.js';
import { errorHandler } from '../error-handler.js';
import cartController from '../controllers/cartController.js';

const cartRoutes: Router = Router();

cartRoutes.post(
    '/',
    authMiddleware,
    errorHandler(cartController.addItemToCart)
);
cartRoutes.get('/', authMiddleware, errorHandler(cartController.getCart));
cartRoutes.delete(
    '/:id',
    authMiddleware,
    errorHandler(cartController.deleteItemFromCart)
);
cartRoutes.put(
    '/:id',
    authMiddleware,
    errorHandler(cartController.changeQuantity)
);

export default cartRoutes;
