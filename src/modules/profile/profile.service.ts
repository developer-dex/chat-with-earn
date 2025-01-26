import getEnvVar from "../../helpers/util";
import User from "../../models/User";
import fs from "fs";

export class ProfileService {
    constructor() {}

    profileInfo = async (userId: string) => {
        // In future subscription data will come in the picture
        const profileData = await User.findOne({ _id: userId });
        return { profileData };
    };

    updateProfile = async (userId: string, profileImage: any) => {
        const profile = await User.findOne({ _id: userId });
        if (profileImage) {
            fs.unlinkSync(profile.profile_image);
            profile.profile_image = profileImage.path;
        }
        await profile.save();
        const baseUrl = getEnvVar('IMAGE_FRONT_URL');
        const profileImageUrl = baseUrl + profile.profile_image;
        return { profileImageUrl };
    }
}