import { NextFunction, Request, Response } from "express";
import { ResponseService } from "../../helpers/response.service";
import { StatusCodes } from "../../common/responseStatusEnum";
import { FriendService } from "./friend.service";

export class FriendController {
    private friendService: FriendService;
    private responseService: ResponseService;

    constructor() {
        this.responseService = new ResponseService();
        this.friendService = new FriendService();
    }
    friends = async(req: Request & { token_payload?: any }, res: Response, next: NextFunction) => {
        try {
            const token_payload = req.token_payload;
            const friends = await this.friendService.friendList(token_payload.data._id);
            return res
                .status(200)
                .send(
                    this.responseService.responseWithData(
                        false,
                        StatusCodes.OK,
                        "Friends list fetched successfully.",
                        friends
                    )
                );
        } catch (error) {
            console.log()
            return next(error);
        }
    }
}

export const friendController = new FriendController();
