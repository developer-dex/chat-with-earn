import Joi from "joi";

export const contactUsRequest = Joi.object({
    first_name: Joi.string().required(),
    last_name: Joi.string().required(),
    phone: Joi.string().trim().required(),
    email: Joi.string().email().trim().lowercase().required(),
    message: Joi.string().required(),
});
