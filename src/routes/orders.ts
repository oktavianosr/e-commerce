import { Router } from 'express';
import authMiddleware from '../middleware/auth.js';
import { errorHandler } from '../error-handler.js';
import orderController from '../controllers/orderController.js';
import adminMiddleware from '../middleware/admin.js';

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
    '/index',
    authMiddleware,
    adminMiddleware,
    errorHandler(orderController.listAllOrders)
);
orderRoutes.get(
    '/user/:id',
    authMiddleware,
    adminMiddleware,
    errorHandler(orderController.listUserOrders)
);
orderRoutes.put(
    '/:id/status',
    authMiddleware,
    adminMiddleware,
    errorHandler(orderController.changeStatus)
);
orderRoutes.get(
    '/:id',
    authMiddleware,
    adminMiddleware,
    errorHandler(orderController.getOrderById)
);

export default orderRoutes;
