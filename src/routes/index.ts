import { Router } from 'express';
import authRoutes from './auth.js';
import productsRoutes from './products.js';
import usersRoutes from './users.js';
import cartRoutes from './cart.js';
import ordersRoutes from './orders.js';

const rootRouter: Router = Router();

rootRouter.use('/auth', authRoutes);
rootRouter.use('/products', productsRoutes);
rootRouter.use('/users', usersRoutes);
rootRouter.use('/cart', cartRoutes);
rootRouter.use('/orders', ordersRoutes);

export default rootRouter;
