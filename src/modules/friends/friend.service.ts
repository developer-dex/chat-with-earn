// import { formatTimeAgo, getRandomDate, randomNumberFrom1To10, randomText } from "../../helpers/util";
// import User from "../../models/User";


// export class FriendService {
//     friendList = async (userId: string) => {
//         console.log(userId);    
//         const data = await User.find({})
//         // append the unread_count, last_message, last_message_at
//         let count = 1;
//         const friends = data.map((friend) => {
//             return {
//                 first_name: friend.first_name,
//                 last_name: friend.last_name,
//                 profile_picture: friend.profile_picture,
//                 _id: friend._id,
//                 unread_count: randomNumberFrom1To10(),
//                 last_message: randomText(),
//                 last_message_at: formatTimeAgo(getRandomDate()),
//             };
//         });

//         // Remove the user with the matching _id
//         const filteredFriends = friends.filter(friend => friend._id.toString() !== userId);

//         return filteredFriends; // Return the filtered list
//     };
// }

// src/modules/friends/friend.service.ts
import { formatTimeAgo } from "../../helpers/util";
import User from "../../models/User";
import ChatMessage from "../../models/ChatMessage"; // Import ChatMessage model

export class FriendService {
    friendList = async (userId: string) => {
        console.log(userId);    
        const messages = await ChatMessage.find({}); // Fetch all chat messages

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
                        unread_count: message.receiverId.toString() === userId ? 1 : 0, // Increment unread count if the user is the receiver
                    };
                } else {
                    // Update last message and timestamp
                    friendMessages[friendId.toString()].last_message = message.message;
                    friendMessages[friendId.toString()].last_message_at = message.timestamp;
                    if (message.receiverId.toString() === userId) {
                        friendMessages[friendId.toString()].unread_count += 1; // Increment unread count
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
                profile_picture: user ? user.profile_picture : '', // Fallback if user not found
                _id: friendId, // Use friendId as _id
                unread_count: friendMessages[friendId].unread_count,
                last_message: friendMessages[friendId].last_message,
                last_message_at: formatTimeAgo(friendMessages[friendId].last_message_at), // Format timestamp
            };
        });

        // Remove the user with the matching _id
        const filteredFriends = friends.filter(friend => friend._id.toString() !== userId);

        return filteredFriends; // Return the filtered list
    };
}