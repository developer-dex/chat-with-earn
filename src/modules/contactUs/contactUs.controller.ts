import { NextFunction, Request, Response } from "express";
import { IContactUsRequest } from "./contactUs.interface";
import { ContactUsService } from "./contactUs.service";
import { ResponseService } from "../../helpers/response.service";
import { StatusCodes } from "../../common/responseStatusEnum";

export class ContactUsController {

    private contactUsService: ContactUsService;
    private responseService: ResponseService;

    constructor() {
        this.contactUsService = new ContactUsService();
        this.responseService = new ResponseService();
    }
    contactUsRequest = async(req: Request, res: Response, next: NextFunction) => {
        const requestData: IContactUsRequest = req.body;
        try {
            await this.contactUsService.contactUsRequest(requestData);
            return res
                .status(200)
                .send(
                    this.responseService.responseWithoutData(
                        false,
                        StatusCodes.OK,
                        "Request for contact us created successfully. Admin will contact you in a while."
                    )
                );
        } catch (error) {
            console.log()
            return next(error);
        }
    }
}

export const contactUsController = new ContactUsController();
