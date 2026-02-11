import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.ts";
import { MessageController } from "../controllers/message.controller.ts";

const messageRouter = Router()

messageRouter.get("/chat/:chatId", authMiddleware, MessageController.getMessage)

export default messageRouter;