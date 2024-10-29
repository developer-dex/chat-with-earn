import User from "../../models/User";

export class ProfileService {
    constructor() {}

    profileInfo = async (userId: string) => {
        // In future subscription data will come in the picture
        const profileData = await User.findOne({ _id: userId });
        return { profileData };
    };
}
