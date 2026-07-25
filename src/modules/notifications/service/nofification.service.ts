import { Response } from "express";
import mongoose from "mongoose";
import { IRequest } from "../../../common/index.js";
import { notificationModel, notificationRepository, userModel, userRepository } from "../../../db/index.js";
import { badRequestException, pagination, successResponse } from "../../../utils/index.js";

class notificationService {

    private notificationRepo = new notificationRepository(notificationModel);
    private userRepo = new userRepository(userModel);

    getNotifications = async (req: IRequest, res: Response) => {
        const user = req.loggedInUser!.user;
        const { page, limit } = req.query;

        const { skip, limit: currentLimit } = pagination({
            page: Number(page),
            limit: Number(limit)
        });
      
        const notifications = await this.notificationRepo.findDocuments(
            {
                receiverId: user._id
            },
            {},
            {
                populate: [
                    {
                        path: "senderId",
                        select: "name email profileImage"
                    }
                ],
                sort: {
                    createdAt: -1
                },
                skip,
                limit: currentLimit
            }
        );

        const unreadCount = await this.notificationRepo.countDocuments({ receiverId: user._id, isRead: false });
        return res.json(successResponse("Notifications fetched successfully", 200, { unreadCount, notifications }));
    };
    getNotificationById = async (req: IRequest, res: Response) => {

        if (!req.loggedInUser) throw new badRequestException("User not authenticated");
        const user = req.loggedInUser.user;
        const { id } = req.params as { id: string; };

        if (!mongoose.isValidObjectId(id))
            throw new badRequestException("Invalid notification id");

        const notification = await this.notificationRepo.findOneDocument(
            {
                _id: id,
                receiverId: user._id
            },
            {},
            {
                populate: [
                    {
                        path: "senderId",
                        select: "name email profileImage"
                    }
                ]
            }
        );
        if (!notification) throw new badRequestException("Notification not found");
        return res.json(successResponse("Notification fetched successfully", 200, notification));
    };

    markNotificationAsRead = async (req: IRequest, res: Response) => {

        const user = req.loggedInUser!.user;
        const { id } = req.params as { id: string; };
        if (!mongoose.isValidObjectId(id)) throw new badRequestException("Invalid notification id");

        const notification = await this.notificationRepo.findOneDocument({
            _id: id,
            receiverId: user._id
        });

        if (!notification) throw new badRequestException("Notification not found");

        const updatedNotification =
            await this.notificationRepo.findDocumentByIdAndUpdate(
                id,
                {
                    isRead: true
                },
                {
                    new: true
                }
            );
        return res.json(successResponse("Notification marked as read", 200, updatedNotification));
    };
    markAllNotificationsAsRead = async (req: IRequest, res: Response) => {

        const user = req.loggedInUser!.user;
        await this.notificationRepo.updateMultipleDocument(
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
        return res.json(successResponse("All notifications marked as read", 200));
    };
    deleteNotification = async (req: IRequest, res: Response) => {

        const user = req.loggedInUser!.user;
        const { id } = req.params as { id: string; };

        if (!mongoose.isValidObjectId(id)) throw new badRequestException("Invalid notification id");

        const notification = await this.notificationRepo.findAndDeleteDocument({
            _id: id,
            receiverId: user._id
        });
        if (!notification) throw new badRequestException("Notification not found");
        return res.json(successResponse("Notification deleted successfully", 200, notification));
    };
}

export default new notificationService();