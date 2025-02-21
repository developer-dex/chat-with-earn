import { NextFunction, Request, Response } from "express";
import { ResponseService } from "../../helpers/response.service";
import { StatusCodes } from "../../common/responseStatusEnum";
import { AdminService } from "./admin.service";

export class AdminController {
    private adminService: AdminService;
    private responseService: ResponseService;

    constructor() {
        this.adminService = new AdminService();
        this.responseService = new ResponseService();
    }

    adminLogin = async (req: Request & { token_payload?: any }, res: Response, next: NextFunction) => {
        const { email, password } = req.body;
        try {
            const user = await this.adminService.adminLogin(email, password);
        if (!user) {
            return res.status(200).send(this.responseService.responseWithoutData(false, StatusCodes.NOT_FOUND, "email/password are not match. Please try with correct one"));
            }
            return res.status(200).send(this.responseService.responseWithData(false, StatusCodes.OK, "Login successfully", user));
        } catch (error) {
            return res.status(200).send(this.responseService.responseWithoutData(false, StatusCodes.INTERNAL_SERVER_ERROR, "Internal server error"));
        }
        
    }

    allUsersInformation = async (
        req: Request & { token_payload?: any },
        res: Response,
        next: NextFunction
    ) => {
        const token_payload = req.token_payload;
        try {
            const { page, limit } = req.query;
            const users = await this.adminService.users(Number(page), Number(limit));
            return res
                .status(200)
                .send(
                    this.responseService.responseWithData(
                        false,
                        StatusCodes.OK,
                        "Profile data get successfully.",
                        users
                    )
                );
        } catch (error) {
            return res
                .status(200)
                .send(
                    this.responseService.responseWithoutData(
                        false,
                        StatusCodes.INTERNAL_SERVER_ERROR,
                        "Internal server error"
                    )
                );
        }
    };

    chnageTheStatus = async (req: Request & { token_payload?: any }, res: Response, next: NextFunction) => {
        const token_payload = req.token_payload;
        const { userId } = req.body;
        try {
            /// check the user is exist or not
            const isUserExist = await this.adminService.isExist(userId);
            if (!isUserExist) {
                return res.status(200).send(this.responseService.responseWithoutData(false, StatusCodes.NOT_FOUND, "User not found"));
            }
            const user = await this.adminService.changeTheStatus(userId, isUserExist.approved_by_admin);
            return res.status(200).send(this.responseService.responseWithData(false, StatusCodes.OK, "Status changed successfully", user));
        } catch (error) {
            return res.status(200).send(this.responseService.responseWithoutData(false, StatusCodes.INTERNAL_SERVER_ERROR, "Internal server error"));
        }
    }

    editUserProfile = async (req: Request & { token_payload?: any }, res: Response, next: NextFunction) => {
        const token_payload = req.token_payload;
        const { total_earnings, people_count, username, password, userId } = req.body;
        try {
            /// check the user is exist or not
            const isUserExist = await this.adminService.isExist(userId);
            if (!isUserExist) {
                return res.status(200).send(this.responseService.responseWithoutData(false, StatusCodes.NOT_FOUND, "User not found"));
            }
            const user = await this.adminService.editProfileAndPeopleAmount(userId, total_earnings, people_count, username, password);
            return res.status(200).send(this.responseService.responseWithData(false, StatusCodes.OK, "Profile and people amount updated successfully", user));
        } catch (error) {
            return res.status(200).send(this.responseService.responseWithoutData(false, StatusCodes.INTERNAL_SERVER_ERROR, "Internal server error"));
        }
    }

    changeThePaymentQrCode = async (req: Request & { token_payload?: any }, res: Response, next: NextFunction) => {
        const token_payload = req.token_payload;
        const file = req.file;
        try {
            const user = await this.adminService.updateThePaymentQrCode(file);
            return res.status(200).send(this.responseService.responseWithData(false, StatusCodes.OK, "Payment QR code changed successfully", user));
        } catch (error) {
            console.log("error", error);

            return res.status(200).send(this.responseService.responseWithoutData(false, StatusCodes.INTERNAL_SERVER_ERROR, "Internal server error"));
        }
    }

    getPaymentPhoto = async (req: Request & { token_payload?: any }, res: Response, next: NextFunction) => {
        const token_payload = req.token_payload;
        try {
            const user = await this.adminService.getPaymentPhoto();
            return res.status(200).send(this.responseService.responseWithData(false, StatusCodes.OK, "Payment photo get successfully", user));
        } catch (error) {
            return res.status(200).send(this.responseService.responseWithoutData(false, StatusCodes.INTERNAL_SERVER_ERROR, "Internal server error"));
        }
    }

    deleteUser = async (req: Request & { token_payload?: any }, res: Response, next: NextFunction) => {
        const token_payload = req.token_payload;
        const { userId } = req.body;
        try {
            const user = await this.adminService.deleteUser(userId);
            return res.status(200).send(this.responseService.responseWithData(false, StatusCodes.OK, "User deleted successfully", user));
        } catch (error) {
            return res.status(200).send(this.responseService.responseWithoutData(false, StatusCodes.INTERNAL_SERVER_ERROR, "Internal server error"));
        }
    }
}
export const adminController = new AdminController();
