import mongoose from "mongoose";
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
        }
    },
    {
        timestamps: true
    }
);

placeSchema.index({ coordinates: "2dsphere" });

export const placeModel = mongoose.model<IPlace>("Place", placeSchema);