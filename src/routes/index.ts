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

/**
 * 1. User Management
 *    a. List users
 *    b. Get User By Id
 *    c. Change User Role
 * 2. Order Management
 *    a. List All Orders (Filter on Status)
 *    b. Change Order Status
 * 3. products
 *    a. Serach API for Products ( For Both Users and Admins) -> Full Text Search
 */
