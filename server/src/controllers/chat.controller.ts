import type { Request, Response } from "express";
import { ChatService } from "../services/chat.service.ts";

export class ChatController {
    static async getChats(req: Request, res: Response) {
        try {
            const userId = req.user?._id;
            if (!userId) {
                return res.status(400).json({
                    message: "User is not Logged in",
                    success: false
                })
            }

            const chats = await (ChatService.findChatByUserId(userId))

            const formattedChat = chats.map(chat => {
                const otherParticipant = chat.participants.find(p => p._id.toString() !== userId.toString())
                const formattingChat = ChatService.formattedChat(chat, otherParticipant)
                return formattingChat;
            })

            res.json({
                success: true,
                formattedChat
            })
        } catch (error) {
            return res.status(500).json({
                message: "Server error",
                success: false
            });
        }
    }
    static async openChat(req: Request, res: Response) {
        try {
            const userId = req.user?._id;
            const participantId = req.params.participantId;

            if (!userId || !participantId) {
                return res.status(400).json({
                    message: "User and participant Id must be required"
                })
            }
            if (userId.toString() == participantId.toString()) {
                return res.status(400).json({
                    message: "Chat Cannot be created with yourself"
                })
            }

            let chat = await (ChatService.findAllChatOfUserParticipant(userId, participantId))

            if (!chat) {
                const newChat = ChatService.createNewChat(userId, participantId)
                await newChat.save()
                chat = await newChat.populate("participants", "username email avatar")
            }
            const otherParticipant = chat.participants.find(p => p._id.toString() !== userId.toString())

            const formattedChat = ChatService.formattedChat(chat, otherParticipant)
            return res.status(200).json({
                formattedChat
            })
        } catch (error) {
            return res.status(500).json({
                message: "Server error",
                success: false
            });
        }
    }
}