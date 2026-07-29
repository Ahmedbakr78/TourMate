import mongoose from "mongoose";
import { ILostItem, lostItemStatusEnum } from "../../common/index.js";

const lostItemSchema = new mongoose.Schema<ILostItem>(
    {
        tripId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Trip",
            required: true
        },

        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        title: {
            type: String,
            required: true,
            trim: true
        },

        description: {
            type: String,
            required: true,
            trim: true
        },

        image: {
            secure_url: {
                type: String
            },
            public_id: {
                type: String
            }
        },

        status: {
            type: String,
            enum: Object.values(lostItemStatusEnum),
            default: lostItemStatusEnum.PENDING
        }
    },
    {
        timestamps: true
    }
);

export const lostItemModel = mongoose.model<ILostItem>("LostItem", lostItemSchema);