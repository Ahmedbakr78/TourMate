import mongoose from "mongoose";
import { INotification } from "../../common/index.js";

const notificationSchema = new mongoose.Schema<INotification>(
    {
        senderId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        receiverId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        title: {
            type: String,
            required: true,
            trim: true
        },

        message: {
            type: String,
            required: true,
            trim: true
        },

        isRead: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true
    }
);

export const notificationModel = mongoose.model<INotification>("Notification", notificationSchema);