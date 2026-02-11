import { Server } from "socket.io";
import { Server as HttpServer } from 'node:http'
import { type IUser } from "../models/user.model.ts";
import { AuthService } from "../services/auth.service.ts";
import { ChatService } from "../services/chat.service.ts";
import { MessageService } from "../services/message.service.ts";

declare module "socket.io" {
    interface Socket {
        user?: IUser;
    }
}

export const onlineUsers: Map<string, string> = new Map()

export const initSocket = (server: HttpServer) => {
    const io = new Server(server, {
        cors: {
            origin: true,
            credentials: true
        },
    });

    io.use(async (socket, next) => {
        try {
            const token = socket.handshake.auth.token;
            if (!token) {
                return next(new Error("Authentication Error"))
            }

            const decoded = AuthService.decodeToken(token)

            const user = await (AuthService.userFindById(decoded.id))
            if (!user) {
                return next(new Error("Authentication Error"));
            }

            socket.user = user;
            next();
        } catch (error: any) {
            next(new Error(error));
        }
    })

    io.on('connection', (socket) => {
        if (!socket.user) {
            throw new Error("Something went wrong")
        }
        const userId = socket?.user?._id || undefined;

        if (userId) {
            throw new Error("User Id not found")
        }
        socket.emit("online-users", { userIds: Array.from(onlineUsers.keys()) });

        onlineUsers.set(userId, socket.id)

        socket.broadcast.emit("user-online", { userId })

        socket.join(`user:${userId}`)

        socket.on("join-chat", (chatId: string) => {
            socket.join(`chat:${chatId}`)
        })

        socket.on("leave-chat", (chatId: string) => {
            socket.leave(`chat:${chatId}`)
        })

        socket.on("send-message", async (data: { chatId: string, text: string }) => {
            try {
                const { chatId, text } = data;
                const chat = await (ChatService.findUserParticipant(chatId, userId))

                if (!chat) {
                    socket.emit("socket-error", { message: "Chat not Found" })
                    return;
                }

                const message = await (MessageService.createMessage(chatId, userId, text))

                chat.lastMessage = message._id;
                chat.lastMessageAt = new Date()
                await chat.save()

                await message.populate("sender", "name email avatar")

                io.to(`chat:${chatId}`).emit("new-message", message)
                for (const participantId of chat.participants) {
                    io.to(`user:${participantId}`).emit("new-message", message)
                }
            } catch (error) {
                socket.emit("socket-error", { message: "Failed to send message" })
                return;
            }
        })

        // todo: last feature
        socket.on("typing", async (data: any) => { })

        socket.on('disconnect', () => {
            onlineUsers.delete(userId)
            socket.broadcast.emit("user-offline", { userId })
        });
    });

    return io;
};