import Admin from "../../models/Admin";
import QrCode from "../../models/QrCode";
import User from "../../models/User";
import { promises as FileSystem } from "fs";

export class AdminService {
    constructor() {
    }

    adminLogin = async (email: string, password: string) => {
        const admin = await Admin.findOne({ email, password });
        return admin;
    }

    users = async (page: number, limit: number) => {
        const users = await User.find({});
        return users;
    }

    changeTheStatus = async (userId: string, status: string) => {
        /// check the user is exist or not
        const isUserExist = await this.isExist(userId);
        if (!isUserExist) {
            throw new Error("User not found");
        }
        const user = await User.findByIdAndUpdate(userId, { approved_by_admin: !isUserExist.approved_by_admin });
        return user;
    }

    editProfileAndPeopleAmount = async (userId: string, profiteAmout: number | null, peopleCount: number | null) => {
        
        if (profiteAmout) {
            const user = await User.findByIdAndUpdate(userId, { total_earnings: profiteAmout });
            return user;
        }
        if (peopleCount) {
            const user = await User.findByIdAndUpdate(userId, { people_count: peopleCount });
            return user;
        }
        return null;
    }

    updateThePaymentQrCode = async (qrId: string, file: Express.Multer.File) => {

        // remove the old qr code image
        const qrCode = await QrCode.findById(qrId);
        if (qrCode) {
            await FileSystem.unlink(qrCode.qr_code_image);
        }
        return await QrCode.findByIdAndUpdate(qrId, { qr_code_image: file.path });
    }

    isExist = async (userId: string) => {
        const isUserExist = await User.findById(userId);
        return isUserExist;
    }
}