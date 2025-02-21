// var mongoose = require('mongoose');
import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            require: false,
            default: "",
        },
        first_name: {
            type: String,
            require: false,
            default: "",
        },
        total_earnings: {
            type: Number,
            require: false,
            default: 0,
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
        gender: {
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
        approved_by_admin: {
            type: Boolean,
            default: false,
            require: false,
        },
        is_active: {
            type: Boolean,
            required: false,
            default: false,
        },
        socket_id: {
            type: String,
            required: false,
            default: null,
        },
        take_subscription: {
            type: Boolean,
            default: false,
        },
        deletedAt: {
            type: Date,
            default: null,
        },
        last_seen: {
            type: Date,
            default: null,
        },
        people_count: {
            type: Number,
            default: 0,
        },
        profile_image: {
            type: String,
            default: "",
        },
        referral_by: {
            type: String,
            required: false,
            default: null,
        },
        payment_qr_code: {
            type: String,
            required: false,
            default: null,
        },
        referral_code: {
            type: String,
            required: false,
            // default randome string which is unique for every user and it must be 7 character long
            default: () => {
                return Math.random().toString(36).substring(2, 9);
            }
        }
    },
    {
        timestamps: true,
    }
);

const User = mongoose.model("User", UserSchema);
export default User;
