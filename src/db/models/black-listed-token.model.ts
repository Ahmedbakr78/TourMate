import mongoose from "mongoose";
import { IBlackListedTokens } from "../../common/index.js";

const blackListedTokenSchema = new mongoose.Schema<IBlackListedTokens>(
    {
        tokenId: {
            type: String,
            required: true,
            unique: true
        },

        expiresAt: {
            type: Date,
            required: true
        }
    },
    {
        timestamps: true
    }
);

blackListedTokenSchema.index(
    { expiresAt: 1 },
    { expireAfterSeconds: 0 }
);

export const blackListedTokensModel = mongoose.model<IBlackListedTokens>("BlackListedToken", blackListedTokenSchema);