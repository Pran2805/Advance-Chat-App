import { Message } from "../models/message.model.ts";

export class MessageService {
    static async findMessage(chatId: any) {
        const messages = await Message.find({ chat: chatId })
            .populate("sender", "username email avatar")
            .sort({ createdAt: 1 })

        return messages;
    }

    static async createMessage(chatId: any, userId: any, text: string) {
        const message = await Message.create({
            chat: chatId,
            sender: userId,
            text
        })

        return message;
    }
}