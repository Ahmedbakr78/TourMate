import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
import { IReview } from "../../common/index.js";
import { PaginateModel } from "mongoose";

const reviewSchema = new mongoose.Schema<IReview>(
    {
        tripId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Trip",
            required: true
        },

        touristId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        driverId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Driver"
        },

        guideId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Guide"
        },

        placeId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Place"
        },

        rating: {
            type: Number,
            required: true,
            min: 1,
            max: 5
        },

        comment: {
            type: String,
            default: "",
            trim: true
        },
        
    },
    {
        timestamps: true
    }
);

reviewSchema.plugin(mongoosePaginate);

export const reviewModel = mongoose.model<IReview, PaginateModel<IReview>>("Review", reviewSchema);