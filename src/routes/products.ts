import { Router } from 'express';
import { errorHandler } from '../error-handler.js';
import {
    createProduct,
    deleteProduct,
    getProductById,
    listProducts,
    updateProduct,
} from '../controllers/productController.js';
import authMiddleware from '../middleware/auth.js';
import adminMiddleware from '../middleware/admin.js';

//
const productsRoutes: Router = Router();
productsRoutes.post(
    '/',
    authMiddleware,
    adminMiddleware,
    errorHandler(createProduct)
);

productsRoutes.get(
    '/',
    authMiddleware,
    adminMiddleware,
    errorHandler(listProducts)
);

productsRoutes.put(
    '/:id',
    authMiddleware,
    adminMiddleware,
    errorHandler(updateProduct)
);

productsRoutes.delete(
    '/:id',
    authMiddleware,
    adminMiddleware,
    errorHandler(deleteProduct)
);

productsRoutes.get(
    '/:id',
    authMiddleware,
    adminMiddleware,
    errorHandler(getProductById)
);

export default productsRoutes;
