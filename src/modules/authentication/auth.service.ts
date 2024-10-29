import mongoose from "mongoose";
import getEnvVar, {
    calculateAge,
    generateRandomString,
    parseTimeInterval,
} from "../../helpers/util";
import User from "../../models/User";
import bcryptjs from "bcryptjs";
import {
    IForgetPasswordRequest,
    ILoginRequest,
    ILoginResponse,
    IResetPasswordRequest,
    ISignupRequest,
} from "./auth.interface";
import { RESET_PASSWORD_FRONT_URL } from "../../helpers/constants";
import ResetPassword from "../../models/ResetPassword";
import { mailConfig } from "../../config/mail";
import { JwtService } from "../../helpers/jwt.service";
export class AuthService {
    private jwtService: JwtService;
    constructor() {
        this.jwtService = new JwtService();
    }

    login = async (userId: string): Promise<ILoginResponse> => {
        return this.generateLogInSignUpResponse(userId);
    };
    public async signUp(signUpReqPayload: ISignupRequest) {
        // TODO: implement full signup feature;
        const currentAge = calculateAge(signUpReqPayload.dob);
        await User.create({
            ...signUpReqPayload,
            age: currentAge,
        });
    }

    forgetPassword = async (
        forgetPasswordReqPayload: IForgetPasswordRequest,
        userId: mongoose.Types.ObjectId
    ) => {
        await this.deleteResetPasswordRecord(forgetPasswordReqPayload.email);

        const forgotPasswordToken = generateRandomString(
            mailConfig.passwordResetTokenLength
        );

        const forgotPasswordURl = `${RESET_PASSWORD_FRONT_URL}/${forgotPasswordToken}`;

        await ResetPassword.create({
            userId,
            email: forgetPasswordReqPayload.email,
            token: forgotPasswordToken,
            expired_at: new Date(
                Date.now() +
                    parseTimeInterval(mailConfig.passwordResetTokenExpire).ms
            ),
        });

        const emailData = {
            email: forgetPasswordReqPayload.email,
            subject: "Reset Password",
            text: `Please click the link below to reset your password. <a href=${forgotPasswordURl}>${forgotPasswordURl}</a>`,
        };

        return forgotPasswordURl;

        // TODO: send email
        // this.sendEmail(emailData);
    };

    resetPassword = async (
        resetPasswordReqPayload: IResetPasswordRequest,
        email: string
    ) => {
        await User.updateOne(
            { email },
            {
                password: bcryptjs.hashSync(
                    resetPasswordReqPayload.new_password
                ),
            }
        );
        await this.deleteResetPasswordRecord(email);
    };

    isUserExist = async (email: string) => {
        const user = await User.findOne({ email });
        return user;
    };

    private deleteResetPasswordRecord = async (email: string) => {
        return await ResetPassword.deleteOne({ email });
    };

    isValidResetPasswordRequest = async (token: string) => {
        return await ResetPassword.findOne({ token });
    };

    passwordMatch = async (password: string, hashedPassword: string) => {
        return bcryptjs.compareSync(password, hashedPassword);
    };

    private generateLogInSignUpResponse = (userId: string) => {
        let jwtTokenPayload: Record<string, any> = {
            _id: userId,
        };
        return {
            authorization_token: this.jwtService.generateToken(jwtTokenPayload),
            user_id: userId,
            redirect_url: getEnvVar("DASHBOARD_URL"),
        };
    };
}
