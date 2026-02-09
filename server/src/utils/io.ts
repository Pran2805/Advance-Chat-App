import { Server } from "socket.io";


export const initSocket = (server: any) => {
    const io = new Server(server, {
        cors: {
            origin: '*',
        },
    });

    io.on('connection', (socket) => {
        console.log('user connected:', socket.id);
    
        socket.on('disconnect', () => {
            console.log('user disconnected:', socket.id);
        });
    });

    return io;
};