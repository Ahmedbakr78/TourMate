import mongoose, { PaginateModel } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
import { IDriver, verificationStatusEnum } from "../../common/index.js";

const driverSchema = new mongoose.Schema<IDriver>(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        licenseNumber: {
            type: String,
            required: true,
            unique: true
        },

        rating: {
            type: Number,
            default: 0,
            min: 0,
            max: 5
        },

        availability: {
            type: Boolean,
            default: true
        },

        currentLocation: {
            type: {
                type: String,
                enum: ["Point"],
                default: "Point"
            },

            coordinates: {
                type: [Number],
                default: [0, 0]
            }
        },
        verificationStatus: {
            type: String,
            enum: verificationStatusEnum,
            default: verificationStatusEnum.PENDING
        }
    },
    {
        timestamps: true
    }
);

driverSchema.index({ currentLocation: "2dsphere" });

driverSchema.plugin(mongoosePaginate);

export const driverModel = mongoose.model<IDriver, PaginateModel<IDriver>>("Driver", driverSchema);

