import { Router } from "express";
import { errorHandler } from "../error-handler.js";
import { createProduct } from "../controllers/productController.js";
import authMiddleware from "../middleware/auth.js";
import adminMiddleware from "../middleware/admin.js";

const productsRoutes: Router = Router();

productsRoutes.post(
  "/",
  authMiddleware,
  adminMiddleware,
  errorHandler(createProduct),
);

export default productsRoutes;
