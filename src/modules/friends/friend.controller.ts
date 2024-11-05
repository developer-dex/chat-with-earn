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
            console.log("error", error)
            return res.status(500).send(this.responseService.responseWithoutData(true, StatusCodes.INTERNAL_SERVER_ERROR, "Internal server error."));
        }
    }

    getMessagesBetween = async (req: Request & { token_payload?: any }, res: Response, next: NextFunction) => {
        try {
            const token_payload = req.token_payload;
            const messages = await this.friendService.getMessagesBetween(token_payload.data._id, req.query.friendId as string);
            return res
                .status(200)
                .send(
                    this.responseService.responseWithData(false, StatusCodes.OK, "Messages fetched successfully.", messages)
                );
        } catch (error) {
           return res.status(500).send(this.responseService.responseWithoutData(true, StatusCodes.INTERNAL_SERVER_ERROR, "Internal server error."));
        }
    }
}

export const friendController = new FriendController();
