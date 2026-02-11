import { Router } from "express";
import { UserController } from "../controllers/user.controller.ts";
import { authMiddleware } from "../middlewares/auth.middleware.ts";

const userRouter = Router()

userRouter.get("/", authMiddleware, UserController.getUsers)
export default userRouter;