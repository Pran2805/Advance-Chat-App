import type { Request, Response } from "express";
import { ChatService } from "../services/chat.service.ts";
import { MessageService } from "../services/message.service.ts";

export class MessageController {
    static async getMessage(req: Request, res: Response) {
        try {
            const { chatId } = req.params;
            const userId = req?.user?._id;

            const chat = await (ChatService.findUserParticipant(chatId, userId))

            if (!chat) {
                return res.status(404).json({
                    message: "Chat Not Found"
                })
            }

            const messages = await (MessageService.findMessage(chatId))

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