import mongoose, { Schema } from "mongoose";

const ChatMessageSchema = new mongoose.Schema({
    senderId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    receiverId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    seen_at: {
        type: Date,
        default: null,
    },
    senderUnreadCount: {
        type: Number,
        default: 0,
    },
    receiverUnreadCount: {
        type: Number,
        default: 0,
    },
    timestamp: {
        type: Date,
        default: Date.now,
    },
});

const ChatMessage = mongoose.model("ChatMessage", ChatMessageSchema);

export default ChatMessage; 