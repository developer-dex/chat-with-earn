import getEnvVar, { formatTimeAgo } from "../../helpers/util";
import User from "../../models/User";
import ChatMessage from "../../models/ChatMessage"; // Import ChatMessage model
import moment from "moment";
import _ from "lodash";

export class FriendService {
    friendList = async (userId: string) => {
        console.log(userId);    
        const messages = await ChatMessage.find({
            $or: [
                { senderId: userId },
                { receiverId: userId }
            ]
        }); // Fetch chat messages where userId is either sender or receiver

        // Fetch users based on senderId and receiverId
        const userIds = [...new Set(messages.flatMap(message => [message.senderId, message.receiverId]))]; // Get unique userIds
        const users = await User.find({ _id: { $in: userIds } }); // Fetch users from User schema

        // Create a map for quick user lookup
        const userMap = users.reduce((acc, user) => {
            acc[user._id.toString()] = user; // Map userId to user object
            return acc;
        }, {});

        // Create a map to hold the latest message details for each friend
        const friendMessages = {};

        messages.forEach((message) => {
            const friendId = message?.senderId?.toString() === userId ? message?.receiverId : message?.senderId; // Determine the friendId
            if (friendId) { // Check if friendId is defined
                if (!friendMessages[friendId.toString()]) {
                    friendMessages[friendId.toString()] = {
                        last_message: message.message,
                        last_message_at: message.timestamp,
                        unread_count: (message.receiverId.toString() === userId && message.receiverUnreadCount > 0) ? message.receiverUnreadCount : 0, // Increment unread count if the user is the receiver
                    };
                } else {
                    // Update last message and timestamp
                    friendMessages[friendId.toString()].last_message = message.message;
                    friendMessages[friendId.toString()].last_message_at = message.timestamp;
                    if (message.receiverId.toString() === userId) {
                        friendMessages[friendId.toString()].unread_count = message.receiverUnreadCount > 0 ? friendMessages[friendId.toString()].unread_count + 1 : 0; // Increment unread count
                    }
                }
            }
        });

        // Prepare the final friends list
        const friends = Object.keys(friendMessages).map(friendId => {
            const user = userMap[friendId]; // Get user details from the map
            return {
                first_name: user ? user.first_name : 'Unknown', // Fallback if user not found
                last_name: user ? user.last_name : 'User', // Fallback if user not found
                profile_picture: (user.profile_image && user.profile_image.length > 0) ? getEnvVar('IMAGE_FRONT_URL') + user.profile_image : null, // Fallback if user not found
                _id: friendId, // Use friendId as _id
                unread_count: friendMessages[friendId].unread_count,
                last_message: friendMessages[friendId].last_message,
                last_message_at: formatTimeAgo(friendMessages[friendId].last_message_at), // Format timestamp
                last_seen: user && user.last_seen ? formatTimeAgo(user.last_seen)  : null,
                last_message_at_timestamp: friendMessages[friendId].last_message_at,
            };
        });

        // Remove the user with the matching _id
        const filteredFriends = friends.filter(friend => friend._id.toString() !== userId);

        // sort the friends by last_message_at_timestamp in descending order
        const sortedFriends = filteredFriends.sort((a, b) => b.last_message_at_timestamp - a.last_message_at_timestamp);

        return sortedFriends; // Return the filtered list
    };

    // New method to get messages between senderId and receiverId
    getMessagesBetween = async (senderId: string, receiverId: string) => {
        console.log(`Fetching messages between ${senderId} and ${receiverId}`); // Debugging log

        const messages = await ChatMessage.find({
            $or: [
                { senderId, receiverId },
                { senderId: receiverId, receiverId: senderId }
            ]
        }).sort({ timestamp: 1 }); // Sort messages in ascending order by timestamp

        console.log(`Messages found: ${JSON.stringify(messages)}`); // Debugging log

        return messages; // Return the list of messages
    };

    messageCountRead = async (receiverId: string, userId: string) => {
       
        // await ChatMessage.updateMany({ receiverId: receiverId, senderId: userId }, { $set: { receiverUnreadCount: 0 } });

        await ChatMessage.updateMany({ senderId: receiverId, receiverId: userId }, { $set: { receiverUnreadCount: 0 } });

        // delete all the messge
        // await ChatMessage.deleteMany({createdAt: {$lt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7)}});
        return true;
    }
}