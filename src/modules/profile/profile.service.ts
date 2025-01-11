import User from "../../models/User";

export class ProfileService {
    constructor() {}

    profileInfo = async (userId: string) => {
        // In future subscription data will come in the picture
        const profileData = await User.findOne({ _id: userId });
        return { profileData };
    };

    updateProfile = async (userId: string, profileData: any, profileImage: any) => {
        const profile = await User.findOne({ _id: userId });
        if (profileImage) {
            profile.profile_image = profileImage.filename;
        }
        await profile.save();
        return { profile };
    }
}