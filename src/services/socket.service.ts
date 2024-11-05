import { Server } from "socket.io";
import ChatMessage from "../models/ChatMessage";
import jwt from "jsonwebtoken";
import getEnvVar from "../helpers/util";
import User from "../models/User";

class SocketService {
    private io: Server;
    private userSocketMap: Map<string, string>;

    constructor(server: any) {
        this.io = new Server(server, {
            cors: {
                origin: "*",
                methods: ["GET", "POST"],
            },
        });
        this.userSocketMap = new Map();
        this.initializeSocketEvents();
        console.log("Socket server initialized");
    }

    private initializeSocketEvents() {
        this.io.on("connection", async (socket) => {
            console.log("socket.id", socket.id)
            const authToken = socket?.handshake?.query?.auth_token as string;
            if(!authToken) return;
            const decoded: any = jwt.verify(
                authToken,
                getEnvVar("JWT_SECRETKEY")
            );

            console.log("decoded___", decoded)

            await this.addSocketIdToUser(decoded.data._id, socket.id);
            this.userSocketMap.set(decoded.data._id, socket.id);

            socket.on("sendMessage", async (data) => {
                const { senderId, receiverId, message } = data;
                console.log("sendMessage", data);

                // Save message to the database
                const chatMessage = new ChatMessage({
                    senderId,
                    receiverId,
                    message,
                });
                await chatMessage.save();

                const receiverSocketId = this.userSocketMap.get(receiverId);
                // Emit the message to the receiver
                this.io
                    .to(receiverSocketId)
                    .emit("receiveMessage", chatMessage);
            });

            socket.on("disconnect", () => {
                console.log("Client disconnected:", socket.id);
                this.userSocketMap.delete(decoded.data._id);
            });
        });
    }

    private addSocketIdToUser = async (userId: string, socketId: string) => {
        await User.findByIdAndUpdate(userId, { $set: { socket_id: socketId } });
    };
}

export default SocketService;
