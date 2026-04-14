import { Router } from 'express';
import { errorHandler } from '../error-handler.js';
import productController from '../controllers/productController.js';
import authMiddleware from '../middleware/auth.js';
import adminMiddleware from '../middleware/admin.js';

const productsRoutes: Router = Router();

productsRoutes.post('/', authMiddleware, adminMiddleware, errorHandler(productController.createProduct));
productsRoutes.get('/', authMiddleware, adminMiddleware, errorHandler(productController.listProducts));
productsRoutes.put('/:id', authMiddleware, adminMiddleware, errorHandler(productController.updateProduct));
productsRoutes.delete('/:id', authMiddleware, adminMiddleware, errorHandler(productController.deleteProduct));
productsRoutes.get('/:id', authMiddleware, adminMiddleware, errorHandler(productController.getProductById));

export default productsRoutes;
