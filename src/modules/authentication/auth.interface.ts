export interface ILoginRequest {
    email: string;
    password: string;
}

export interface ISignupRequest {
    email: string;
    first_name: string;
    last_name: string;
    gender: string;
    dob: Date;
    collage_name: string;
    area: string;
    phone: string;
}


export interface ILoginResponse {
    authorization_token: string;
    user_id: string;
    redirect_url: string;
}

export interface IForgetPasswordRequest {
    email: string;
}

export interface IResetPasswordRequest {
    reset_password_token: string
    new_password: string;
    confirm_password: string;
}
