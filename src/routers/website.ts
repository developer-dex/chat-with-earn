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

const validator = createValidator({ passError: true });

const authMiddleware = new AuthMiddleware();

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

export default WebsiteApi;
