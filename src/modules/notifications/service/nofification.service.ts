import { Request, Response } from "express";
import { IRequest } from "../../../common/index.js";
import { notificationModel, notificationRepository } from "../../../db/index.js";
import { badRequestException, successResponse } from "../../../utils/index.js";
import mongoose from "mongoose";
const getUser = (req: IRequest) => {
    if (!req.loggedInUser) {
        throw new badRequestException("User not authenticated");
    }

    return req.loggedInUser.user;
};
class notificationService {

    private notificationRepo = new notificationRepository(notificationModel);
    createNotification = async (req: IRequest, res: Response) => {

        const user = getUser(req);

        const { receiverId, title, message } = req.body;

        if (!mongoose.isValidObjectId(receiverId)) {
            throw new badRequestException("Invalid receiver id");
        }

        if (receiverId === user._id.toString()) {
            throw new badRequestException("You can't send notification to yourself");
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

        return res.json(
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
        const notification = await this.notificationRepo.findOneDocument(
            {
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

                receiverId: user._id
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

        successResponse(
            "All notifications deleted successfully",
            200,
            result
        )
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