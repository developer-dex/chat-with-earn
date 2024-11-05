import { NextFunction, Request, Response } from "express";
import { ResponseService } from "../../helpers/response.service";
import { StatusCodes } from "../../common/responseStatusEnum";
import { PeopleService } from "./people.service";

export class PeopleController {
    private peopleService: PeopleService;
    private responseService: ResponseService;

    constructor() {
        this.responseService = new ResponseService();
        this.peopleService = new PeopleService();
    }
    people = async(req: Request & { token_payload?: any }, res: Response, next: NextFunction) => {
        try {
            const token_payload = req.token_payload;
            const { page, limit } = req.query;
            const people = await this.peopleService.peopleList(token_payload.data._id, page as string, limit as string);
            return res
                .status(200)
                .send(
                    this.responseService.responseWithData(
                        false,
                        StatusCodes.OK,
                        "People list fetched successfully.",
                        people
                    )
                );
        } catch (error) {
            console.log("error", error)
            return res.status(500).send(this.responseService.responseWithoutData(true, StatusCodes.INTERNAL_SERVER_ERROR, "Internal server error."));
        }
    }
}

export const peopleController = new PeopleController();
