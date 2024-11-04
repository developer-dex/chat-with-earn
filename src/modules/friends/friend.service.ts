import { formatTimeAgo, randomNumberFrom1To10, randomText } from "../../helpers/util";
import User from "../../models/User";


export class FriendService {
    friendList = async (userId: string) => {
        console.log(userId);    
        const data = await User.find({})
        // append the unread_count, last_message, last_message_at
        let count = 1;
        const friends = data.map((friend) => {
            return {
                first_name: friend.first_name,
                last_name: friend.last_name,
                profile_picture: friend.profile_picture,
                _id: friend._id,
                unread_count: randomNumberFrom1To10(),
                last_message: randomText(),
                last_message_at: formatTimeAgo(new Date()),
            };
        });

        // Remove the user with the matching _id
        const filteredFriends = friends.filter(friend => friend._id.toString() !== userId);

        return filteredFriends; // Return the filtered list
    };
}