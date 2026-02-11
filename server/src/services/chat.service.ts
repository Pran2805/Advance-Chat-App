import { Chat } from "../models/chat.model.ts";

export class ChatService {
    static async findChatByUserId(userId: any) {
        const chats = await Chat.find({
            participants: userId
        }).populate("participants", "username email avatar")
            .populate("lastMessage")
            .sort({ lastMessageAt: -1 })

        return chats;
    }

    static async findAllChatOfUserParticipant(userId: any, participantId: any) {
        let chat = await Chat.findOne({
            participants: {
                $all: [userId, participantId]
            }
        })
            .populate("participants", "username email avatar")
            .populate("lastMessage")

        return chat;
    }

    static formattedChat(chat: any, otherParticipant: any) {
        return {
            _id: chat._id,
            participant: otherParticipant ?? null,
            lastMessage: chat.lastMessage,
            lastMessageAt: chat.lastMessageAt,
            createdAt: chat.createdAt
        }
    }

    static createNewChat(userId: any, participantId: any) {
        const newChat = new Chat({
            participants: [userId, participantId]
        })
        return newChat;
    }

    static async findUserParticipant(chatId: any, userId: any) {
        const chat = await Chat.findOne({
            _id: chatId,
            participants: userId
        })
        return chat;
    }
}