import { Router } from "express";
import { signup, login } from "../controllers/authController.js";
import { errorHandler } from "../error-handler.js";

const authRoutes: Router = Router();

authRoutes.post("/signup", errorHandler(signup));
authRoutes.post("/login", errorHandler(login));

export default authRoutes;
