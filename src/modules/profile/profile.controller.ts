import { NextFunction, Request, Response } from "express";
import { ResponseService } from "../../helpers/response.service";
import { StatusCodes } from "../../common/responseStatusEnum";
import { ProfileService } from "./profile.service";

export class ProfileController {
    private profileService: ProfileService;
    private responseService: ResponseService;

    constructor() {
        this.profileService = new ProfileService();
        this.responseService = new ResponseService();
    }

    profileInfo = async (
        req: Request & { token_payload?: any },
        res: Response,
        next: NextFunction
    ) => {
        const token_payload = req.token_payload;
        try {
            const profileData = await this.profileService.profileInfo(
                token_payload.data._id
            );
            return res
                .status(200)
                .send(
                    this.responseService.responseWithData(
                        false,
                        StatusCodes.OK,
                        "Profile data get successfully.",
                        profileData
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

    updateProfile = async (req: Request & { token_payload?: any }, res: Response, next: NextFunction) => {
        const token_payload = req.token_payload;
        const profileImage = req.file;
        try {
            const profile = await this.profileService.updateProfile(token_payload.data._id, profileImage);
            return res.status(200).send(this.responseService.responseWithData(false, StatusCodes.OK, "Profile updated successfully", profile));
        } catch (error) {
            return res.status(200).send(this.responseService.responseWithoutData(false, StatusCodes.INTERNAL_SERVER_ERROR, "Internal server error"));
        }
    }
}

export const profileController = new ProfileController();
