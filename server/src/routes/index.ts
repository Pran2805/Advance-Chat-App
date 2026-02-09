import { Router } from "express";
import authRouter from "./auth.route.ts";
import chatRouter from "./chat.route.ts";
import messageRouter from "./message.route.ts";
import userRouter from "./user.route.ts";
import { createMemoryLimiter, rateLimit } from "../middlewares/rateLimiter.ts";

const router = Router()

export const apiLimiter = createMemoryLimiter({
  points: 10,
  duration: 1,
});

router.use(rateLimit(apiLimiter))
router.use("/health", (req, res) =>{
  res.send("Health checked")
})

router.use("/auth", authRouter)
router.use("/chats", chatRouter)
router.use("/messages", messageRouter)
router.use("/users", userRouter)

export default router;