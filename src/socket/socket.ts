import { Server as HttpServer } from "http";
import { Server, Socket } from "socket.io";
import { verifyToken } from "../utils/index.js";

let io: Server | null = null;

export const connectedUsers = new Map<string, string[]>();

const socketAuthentication = (
    socket: Socket,
    next: (err?: Error) => void
) => {

    const token = socket.handshake.auth.token;
    if (!token) return next(new Error("Unauthorized"));

    const decodedData = verifyToken(
        token as string,
        process.env.JWT_ACCESS_SECRET as string
    );

    socket.data.userId = decodedData._id;

    const userSockets = connectedUsers.get(decodedData._id);

    if (!userSockets) {

        connectedUsers.set(decodedData._id, [socket.id]);

    } else {
        userSockets.push(socket.id);
    }

    next();
}

const socketDisconnect = (socket: Socket) => {

    socket.on("disconnect", () => {

        const userId = socket.data.userId;

        const userSockets = connectedUsers.get(userId);

        if (!userSockets) return;

        const updatedSockets = userSockets.filter(
            id => id !== socket.id
        );

        if (!updatedSockets.length)

            connectedUsers.delete(userId);

        else

            connectedUsers.set(userId, updatedSockets);

    });

};

export const initSocket = (server: HttpServer) => {

    io = new Server(server, {
        cors: { origin: "*" }
    });

    io.use(socketAuthentication);

    io.on("connection", (socket) => {

        socketDisconnect(socket);
    });

};

export const getIO = () => {

    if (!io) throw new Error("Socket is not initialized");
    return io;

};