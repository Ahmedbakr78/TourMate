import mongoose from "mongoose";
import { IVote, voteValueEnum } from "../../common/index.js";

const voteSchema = new mongoose.Schema<IVote>(
    {
        tripId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Trip",
            required: true
        },

        placeId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Place",
            required: true
        },

        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        voteValue: {
            type: String,
            enum: voteValueEnum,
            required: true
        }
    },
    {
        timestamps: true
    }
);

voteSchema.index(
    {
        tripId: 1,
        placeId: 1,
        userId: 1
    },
    {
        unique: true
    }
);

export const voteModel = mongoose.model<IVote>("Vote", voteSchema);