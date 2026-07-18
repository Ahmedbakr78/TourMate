import mongoose, { PaginateModel } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
import { genderEnum, IUser, otpTypesEnum, roleEnum, statusUserEnum } from "../../common/index.js";

const userSchema = new mongoose.Schema<IUser>(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },

        password: {
            type: String,
            required: true,
            select: false
        },

        phone: {
            type: String,
            required: true,
            unique: true
        },

        profileImage: {
            secure_url: { type: String },
            public_id: { type: String }
        },
        gender: {
            type: String,
            required: true,
            enum: genderEnum
        },

        role: {
            type: String,
            enum: roleEnum,
            default: roleEnum.TOURIST
        },
        status: {
            type: String,
            enum: statusUserEnum,
            default: statusUserEnum.ACTIVE
        },
        otps: [{
            value: { type: String, required: true },
            expiredAt: { type: Date, default: () => Date.now() + 600000 },
            otpType: { type: String, enum: otpTypesEnum, required: true },
        }],
        isVerified: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true
    }
);
userSchema.plugin(mongoosePaginate);

export const userModel = mongoose.model<IUser, PaginateModel<IUser>>("User", userSchema);

