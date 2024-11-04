import { Server } from "socket.io";
import ChatMessage from "../models/ChatMessage";

class SocketService {
    private io: Server;

    constructor(server: any) {
        this.io = new Server(server, {
            cors: {
                origin: "*",
                methods: ["GET", "POST"],
            },
        });

        this.initializeSocketEvents()
        console.log("Socket server initialized");   
    }

    private initializeSocketEvents() {
        this.io.on("connection", (socket) => {
            console.log("New client connected:", socket.id);

            socket.on("sendMessage", async (data) => {
                const { senderId, receiverId, message } = data;
                console.log("sendMessage", data);

                // Save message to the database
                const chatMessage = new ChatMessage({ senderId, receiverId, message });
                await chatMessage.save();

                // Emit the message to the receiver
                this.io.to(socket.id).emit("receiveMessage", chatMessage);
            });

            socket.on("disconnect", () => {
                console.log("Client disconnected:", socket.id);
            });
        });
    }
}

export default SocketService; 