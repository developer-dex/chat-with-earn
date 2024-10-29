import Joi from "joi";

export const loginRequestSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
});

export const signupRequestSchema = Joi.object({
    first_name: Joi.string().required(),
    last_name: Joi.string().required(),
    phone: Joi.string().required(),
    email: Joi.string().email().required(),
    gender: Joi.string().valid('male', 'female', 'other').required(),
    dob: Joi.date().iso().required(),
    collage: Joi.string().required(),
    area: Joi.string().required(),
});

export const forgetPasswordRequestSchema = Joi.object({
    email: Joi.string().email().required(),
});


export const resetPasswordRequestSchema = Joi.object({
    new_password: Joi.string().min(8).required(),
    confirm_password: Joi.string().min(8).required(),
    reset_password_token: Joi.string().required(),
}).with('new_password', 'confirm_password').custom((value, helpers) => {
    if (value.new_password === value.confirm_password) {
        return value;
    }
    return helpers.error('any.invalid', { message: 'New Passwords and Confirm Password do not match' });
});
