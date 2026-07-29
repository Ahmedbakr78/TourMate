import mongoose from "mongoose";
import { notificationModel, notificationRepository, userModel, userRepository } from "../../db/index.js";
import { badRequestException } from "../index.js";

class notificationService {

    private notificationRepo = new notificationRepository(notificationModel);
    private userRepo = new userRepository(userModel);

    createNotification = async ({
        senderId,
        receiverId,
        title,
        message
    }: {
        senderId?: string;
        receiverId: string;
        title: string;
        message: string;
    }) => {

        if (!mongoose.isValidObjectId(receiverId))
            throw new badRequestException("Invalid receiver id");

        const receiver = await this.userRepo.findDocumentById(receiverId);
        if (!receiver) return null;

        return await this.notificationRepo.createNewDocument({

            senderId: senderId
                ? new mongoose.Types.ObjectId(senderId)
                : undefined,

            receiverId: new mongoose.Types.ObjectId(receiverId),

            title,

            message,

            isRead: false

        });

    };

}

export default new notificationService();