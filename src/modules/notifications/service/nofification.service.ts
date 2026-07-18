import { Response } from "express";
import mongoose from "mongoose";
import { IRequest } from "../../../common/index.js";
import {
    notificationModel,
    notificationRepository,
    userModel,
    userRepository
} from "../../../db/index.js";
import { badRequestException, successResponse } from "../../../utils/index.js";

const getUser = (req: IRequest) => {
    if (!req.loggedInUser) {
        throw new badRequestException("User not authenticated");
    }

    return req.loggedInUser.user;
};

class notificationService {

    private notificationRepo = new notificationRepository(notificationModel);
    private userRepo = new userRepository(userModel);

    createNotification = async (req: IRequest, res: Response) => {

        const user = getUser(req);

        const { receiverId, title, message } = req.body;

        if (!mongoose.isValidObjectId(receiverId)) {
            throw new badRequestException("Invalid receiver id");
        }

        if (receiverId === user._id.toString()) {
            throw new badRequestException("You can't send notification to yourself");
        }

        const receiver = await this.userRepo.findDocumentById(receiverId);

        if (!receiver) {
            throw new badRequestException("Receiver not found");
        }

        const notification = await this.notificationRepo.createNewDocument({
            senderId: user._id,
            receiverId,
            title,
            message
        });

        if (!notification) {
            throw new badRequestException("Failed to create notification");
        }

        return res.status(201).json(
            successResponse(
                "Notification created successfully",
                201,
                notification
            )
        );
    };

    getNotifications = async (req: IRequest, res: Response) => {

        const user = getUser(req);

        const notifications = await this.notificationRepo.findDocuments(
            {
                receiverId: user._id
            },
            undefined,
            {
                sort: { createdAt: -1 }
            }
        );

        return res.json(
            successResponse(
                "Notifications fetched successfully",
                200,
                notifications
            )
        );
    };

    getNotificationById = async (req: IRequest, res: Response) => {

        const id = req.params.id as string;

        if (!mongoose.isValidObjectId(id)) {
            throw new badRequestException("Invalid notification id");
        }

        const user = getUser(req);

        const notification = await this.notificationRepo.findOneDocument({
            _id: id,
            receiverId: user._id
        });

        if (!notification) {
            throw new badRequestException("Notification not found");
        }

        return res.json(
            successResponse(
                "Notification fetched successfully",
                200,
                notification
            )
        );
    };

    markNotificationAsRead = async (req: IRequest, res: Response) => {

        const id = req.params.id as string;

        if (!mongoose.isValidObjectId(id)) {
            throw new badRequestException("Invalid notification id");
        }

        const user = getUser(req);

        const notification = await this.notificationRepo.findOneDocument({
            _id: id,
            receiverId: user._id
        });

        if (!notification) {
            throw new badRequestException("Notification not found");
        }

        notification.isRead = true;
        await notification.save();

        return res.json(
            successResponse(
                "Notification marked as read",
                200,
                notification
            )
        );
    };

    markAllNotificationsAsRead = async (req: IRequest, res: Response) => {

        const user = getUser(req);

        const result = await this.notificationRepo.updateMultipleDocument(
            {
                receiverId: user._id,
                isRead: false
            },
            {
                $set: {
                    isRead: true
                }
            }
        );

        if (result.modifiedCount === 0) {
            throw new badRequestException("No unread notifications found");
        }

        return res.json(
            successResponse(
                "All notifications marked as read",
                200,
                result
            )
        );
    };

    deleteNotification = async (req: IRequest, res: Response) => {

        const id = req.params.id as string;

        if (!mongoose.isValidObjectId(id)) {
            throw new badRequestException("Invalid notification id");
        }

        const user = getUser(req);

        const notification = await this.notificationRepo.findAndDeleteDocument({
            _id: id,
            receiverId: user._id
        });

        if (!notification) {
            throw new badRequestException("Notification not found");
        }

        return res.json(
            successResponse(
                "Notification deleted successfully",
                200,
                notification
            )
        );
    };

    deleteAllNotifications = async (req: IRequest, res: Response) => {

        const user = getUser(req);

        const result = await this.notificationRepo.deleteMultipleDocument({
            receiverId: user._id
        });

        if (!result.deletedCount) {
            throw new badRequestException("No notifications found");
        }

        return res.json(
            successResponse(
                "All notifications deleted successfully",
                200,
                result
            )
        );
    };

    getUnreadCount = async (req: IRequest, res: Response) => {

        const user = getUser(req);

        const count = await this.notificationRepo.countDocuments({
            receiverId: user._id,
            isRead: false
        });

        return res.json(
            successResponse(
                "Unread notifications count fetched successfully",
                200,
                { count }
            )
        );
    };
}

export default new notificationService();