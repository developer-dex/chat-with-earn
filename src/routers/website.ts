import { Router } from "express";
import { createValidator } from "express-joi-validation";
import { contactUsController } from "../modules/contactUs/contactUs.controller";
import {
    forgetPasswordRequestSchema,
    loginRequestSchema,
    resetPasswordRequestSchema,
    signupRequestSchema,
} from "../modules/authentication/auth.validation";
import { contactUsRequest } from "../modules/contactUs/contactUs.validation";
import { authController } from "../modules/authentication/auth.controller";
import { AuthMiddleware } from "../middlewares/auth.middleware";
import { profileController } from "../modules/profile/profile.controller";
import { friendController } from "../modules/friends/friend.controller";
import { peopleController } from "../modules/people/people.controller";
import { FileUploadMiddleware } from "../middlewares/fileupload.middleware";

const validator = createValidator({ passError: true });

const authMiddleware = new AuthMiddleware();

const fileUploadMiddleware = new FileUploadMiddleware();

const WebsiteApi: Router = Router();

// Authentication
WebsiteApi.post(
    "/login",
    validator.body(loginRequestSchema),
    authController.login
);

WebsiteApi.post(
    "/signup",
    validator.body(signupRequestSchema),
    authController.signup
);

WebsiteApi.post(
    "/forgot-password",
    validator.body(forgetPasswordRequestSchema),
    authController.forgetPassword
);

WebsiteApi.post(
    "/reset-password",
    validator.body(resetPasswordRequestSchema),
    authController.resetPassword
);

// Contact us
WebsiteApi.post(
    "/contact-us",
    validator.body(contactUsRequest),
    contactUsController.contactUsRequest
);

WebsiteApi.get(
    "/profile-info",
    authMiddleware.verifyjwtToken,
    profileController.profileInfo
);

WebsiteApi.get("/friends", authMiddleware.verifyjwtToken, friendController.friends);
WebsiteApi.get("/messages", authMiddleware.verifyjwtToken, friendController.getMessagesBetween);

WebsiteApi.get("/people", authMiddleware.verifyjwtToken, peopleController.people);

WebsiteApi.get("/career-people-list", peopleController.careerPeopleList);

WebsiteApi.patch("/update-profile", authMiddleware.verifyjwtToken, fileUploadMiddleware.uploadUserProfile, profileController.updateProfile);

// message count read

WebsiteApi.patch("/message-read", authMiddleware.verifyjwtToken, friendController.messageCountRead);

export default WebsiteApi;

