import { Router } from "express";
import { AuthController } from "../controllers/auth.controller.ts";
import { authMiddleware } from "../middlewares/auth.middleware.ts";

const authRouter = Router()

authRouter.post("/register", AuthController.register)
authRouter.post("/login", AuthController.login)
authRouter.post("/logout", authMiddleware, AuthController.logout)



export default authRouter