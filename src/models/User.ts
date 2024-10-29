// var mongoose = require('mongoose');
import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
    {
        first_name: {
            type: String,
            require: false,
            default: "",
        },
        last_name: {
            type: String,
            require: false,
            default: "",
        },
        email: {
            type: String,
            require: false,
            default: "",
        },
        mobile_number: {
            type: String,
            require: false,
            default: "",
        },
        dob: {
            type: Date,
            required: false,
            default: null,
        },
        age: {
            type: Number,
            required: false,
            default: null,
        },
        profile_picture: {
            type: String,
            require: false,
            default: "",
        },
        password: {
            type: String,
            required: false,
            default: "Test@123",
        },
        collage_name: {
            type: String,
            required: false,
            default: null,
        },
        area: {
            type: String,
            required: false,
            default: null,
        },
        block_by_admin: {
            type: Boolean,
            default: false,
            require: false,
        },
        block_at: {
            type: Date,
            require: null,
            default: null,
        },
        is_active: {
            type: Boolean,
            required: false,
            default: false,
        },
        take_subscription: {
            type: Boolean,
            default: false,
        },
        deletedAt: {
            type: Date,
            default: null,
        }
    },
    {
        timestamps: true,
    }
);

const User = mongoose.model("User", UserSchema);
export default User;
