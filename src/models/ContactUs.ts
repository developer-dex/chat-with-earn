import mongoose from "mongoose";

const ContactSchema = new mongoose.Schema({
    first_name: {
        type: String,
        required: true,
    },
    last_name:{
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
    },
    message: {
        type: String,
        required: true,
    },
});

const ContactUs = mongoose.model("ContactUs", ContactSchema);

export default ContactUs;
