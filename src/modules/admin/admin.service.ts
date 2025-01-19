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
        const skip = (page - 1) * limit;
        const users = await User.find({}).skip(skip).limit(limit);
        // return the total count of the users
        const totalCount = await User.countDocuments({});
        return { users, total_count: totalCount };
    }

    changeTheStatus = async (userId: string, isApprovedByAdmin: boolean) => {
        console.log(isApprovedByAdmin);
        const user = await User.findByIdAndUpdate(userId, { approved_by_admin: !isApprovedByAdmin });
        return user;
    }

    editProfileAndPeopleAmount = async (userId: string, profiteAmout: number | null, peopleCount: number | null, username: string, password: string) => {
        return await User.findByIdAndUpdate(userId, { total_earnings: profiteAmout, people_count: peopleCount, username: username, password: password });
    }

    updateThePaymentQrCode = async (file: Express.Multer.File) => {
        console.log("file", file);

        // remove the old qr code image
        const qrCode = await QrCode.findOne({});
        if (qrCode) {
            console.log("qrCode", qrCode);
            await FileSystem.unlink(qrCode.qr_code_image);
        }

        // delete all the from teh database
        await QrCode.deleteMany({});

        // create new qr code image
        const newQrCode = new QrCode({
            qr_code_image: file.path
        });
        await newQrCode.save();
        return newQrCode;
    }

    getPaymentPhoto = async () => {
        const qrCode = await QrCode.findOne({});
        // add base url to the qr code image
        const baseUrl = process.env.LOCAL_URL;
        qrCode.qr_code_image = `${baseUrl}/${qrCode?.qr_code_image}`;
        return qrCode;
    }

    isExist = async (userId: string) => {
        const isUserExist = await User.findById(userId);
        return isUserExist;
    }
}