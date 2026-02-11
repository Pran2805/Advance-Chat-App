import type { Request, Response } from "express";
import { Chat } from "../models/chat.model.ts";

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

            const chats = await Chat.find({
                participants: userId
            }).populate("participants", "username email avatar")
                .populate("lastMessage")
                .sort({ lastMessageAt: -1 })


            const formattedChat = chats.map(chat => {
                const otherParticipant = chat.participants.find(p => p._id.toString() !== userId.toString())
                return {
                    _id: chat._id,
                    participant: otherParticipant,
                    lastMessage: chat.lastMessage,
                    lastMessageAt: chat.lastMessageAt,
                    createdAt: chat.createdAt
                }
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

            let chat = await Chat.findOne({
                participants: {
                    $all: [userId, participantId]
                }
            })
                .populate("participants", "username email avatar")
                .populate("lastMessage")

            if (!chat) {
                const newChat = new Chat({
                    participants: [userId, participantId]
                })
                await newChat.save()
                chat = await newChat.populate("participants", "username email avatar")
            }
            const otherParticipant = chat.participants.find(p => p._id.toString() !== userId.toString())

            return res.status(200).json({
                _id: chat._id,
                participant: otherParticipant ?? null,
                lastMessage: chat.lastMessage,
                lastMessageAt: chat.lastMessageAt,
                createdAt: chat.createdAt
            })
        } catch (error) {
            return res.status(500).json({
                message: "Server error",
                success: false
            });
        }
    }
}