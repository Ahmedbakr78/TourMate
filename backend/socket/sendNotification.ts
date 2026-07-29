import { connectedUsers, getIO } from "./socket.js";

export const sendNotification = (
    receiverId: string,
    notification: any
) => {

    const sockets = connectedUsers.get(receiverId);
    if (!sockets) return;

    const io = getIO();

    sockets.forEach(socketId => {

        io.to(socketId).emit(
            "new-notification",
            notification
        );
    });
};