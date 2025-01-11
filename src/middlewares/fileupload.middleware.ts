import { USER_PROFILE_PATH } from "../helpers/constants";
import { createMulterMiddleware } from "../helpers/util";
import { Request, Response, NextFunction } from "express";

export class FileUploadMiddleware {

    uploadUserProfile = (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        console.log("uploadAdminProfile");
        const multerMiddleware = createMulterMiddleware(USER_PROFILE_PATH);
        multerMiddleware.single("image")(req, res, (err) => {
            if (err) {
                return res
                    .status(400)
                    .json({ message: "File upload failed", error: err });
            }
            next();
        });
    }
    
}