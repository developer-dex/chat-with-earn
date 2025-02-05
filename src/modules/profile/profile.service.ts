import getEnvVar from "../../helpers/util";
import User from "../../models/User";
import fs from "fs";

export class ProfileService {
    constructor() {}

    profileInfo = async (userId: string) => {
        // In future subscription data will come in the picture
        const profileData = await User.findOne({ _id: userId });
        // chage the profile image url
        const baseUrl = getEnvVar('IMAGE_FRONT_URL');
        const profileImageUrl = ( profileData.profile_image && profileData.profile_image.length > 0 ) ? baseUrl + profileData.profile_image : null;
        profileData.profile_image = profileImageUrl;
        return { profileData };
    };

    updateProfile = async (userId: string, profileImage: any) => {
        try {
            const profile = await User.findOne({ _id: userId });
            if (!profile) {
                throw new Error('Profile not found');
            }

            if (profileImage) {
                // Check if profile.profile_image exists and is a valid path before attempting to unlink
                if (profile.profile_image && fs.existsSync(profile.profile_image)) {
                    try {
                        fs.unlinkSync(profile.profile_image);
                    } catch (error) {
                        console.error('Error deleting file:', error);
                        // Handle the error as needed (e.g., log it, notify the user, etc.)
                    }
                }
                profile.profile_image = profileImage.path;
            }

            await profile.save();
            const baseUrl = getEnvVar('IMAGE_FRONT_URL');
            const profileImageUrl = baseUrl + profile.profile_image;
            return { profileImageUrl };
        } catch (error) {
            console.error('Error updating profile:', error);
            // Return a meaningful error response
            throw new Error('Failed to update profile');
        }
    }
}