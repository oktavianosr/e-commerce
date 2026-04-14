import { Router } from 'express';
import authMiddleware from '../middleware/auth.js';
import { errorHandler } from '../error-handler.js';
import orderController from '../controllers/orderController.js';

const orderRoutes: Router = Router();

orderRoutes.post(
    '/',
    authMiddleware,
    errorHandler(orderController.createOrder)
);
orderRoutes.get('/', authMiddleware, errorHandler(orderController.listOrders));
orderRoutes.put(
    '/:id/cancel',
    authMiddleware,
    errorHandler(orderController.cancelOrder)
);
orderRoutes.get(
    '/:id',
    authMiddleware,
    errorHandler(orderController.getOrderById)
);

export default orderRoutes;
