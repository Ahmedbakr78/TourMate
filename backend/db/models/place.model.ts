import mongoose, { PaginateModel } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
import { IPlace } from "../../common/index.js";

const placeSchema = new mongoose.Schema<IPlace>(
    {
        osmId: {
            type: Number,
            required: true,
            unique: true
        },

        name: {
            type: String,
            required: true,
            trim: true
        },

        city: {
            type: String,
            required: true,
            trim: true
        },

        category: {
            type: String,
            required: true,
            trim: true
        },

        description: {
            type: String,
            default: ""
        },

        coordinates: {
            type: {
                type: String,
                enum: ["Point"],
                default: "Point"
            },
            coordinates: {
                type: [Number],
                required: true
            }
        },
        price: {
            type: Number,
            default: 0,
        },
        averageRating: {
            type: Number,
            default: 0,
            min: 0,
            max: 5
        },
        reviewsCount: {
            type: Number,
            default: 0
        }
    },
    {
        timestamps: true
    }
);

placeSchema.index({ coordinates: "2dsphere" });

placeSchema.plugin(mongoosePaginate);

export const placeModel = mongoose.model<IPlace, PaginateModel<IPlace>>("Place", placeSchema);
