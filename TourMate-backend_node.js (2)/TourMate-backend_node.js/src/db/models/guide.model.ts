import mongoose, { PaginateModel } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

import { IGuide, verificationStatusEnum } from "../../common/index.js";

const guideSchema = new mongoose.Schema<IGuide>(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        languages: {
            type: [String],
            required: true
        },
        experience: {
            type: Number,
            default: 0
        },
        certificate: {
            secure_url: String,
            public_id: String,
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

guideSchema.plugin(mongoosePaginate);
export const guideModel = mongoose.model<IGuide, PaginateModel<IGuide>>("Guide", guideSchema);;

