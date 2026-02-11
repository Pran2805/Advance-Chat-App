import type { Request, Response } from "express";
import { User } from "../models/user.model.ts";
import { Chat } from "../models/chat.model.ts";
import { Message } from "../models/message.model.ts";

export class MessageController {
    static async getMessage(req: Request, res: Response) {
        try {
            const { chatId } = req.params;
            const userId = req?.user?._id;

            const chat = await Chat.findOne({
                _id: chatId,
                participants: userId
            })

            if (!chat) {
                return res.status(404).json({
                    message: "Chat Not Found"
                })
            }

            const messages = await Message.find({ chat: chatId })
                .populate("sender", "username email avatar")
                .sort({ createdAt: 1 })

            res.json({
                success: true,
                messages
            })
        } catch (error) {
            return res.status(500).json({
                message: "Server error",
                success: false
            });
        }
    }
}