import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.ts";
import { ChatController } from "../controllers/chat.controller.ts";

const chatRouter = Router()

chatRouter.use(authMiddleware)

chatRouter.get("/", ChatController.getChats)
chatRouter.post("/open/:participantId", ChatController.openChat)

export default chatRouter;