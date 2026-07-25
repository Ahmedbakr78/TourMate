import { Response } from "express";
import fs from "fs/promises";
import mongoose from "mongoose";
import { driverModel, driverRepository, guideModel, guideRepository, lostItemModel, lostItemRepository, tripModel, tripRepository, userModel, userRepository } from "../../../db/index.js";
import { badRequestException, deleteFileFromCloudinary, forbiddenException, successResponse, uploadFileToCloudinary } from "../../../utils/index.js";
import { ILostItem, IRequest, lostItemStatusEnum, roleEnum } from "../../../common/index.js";
import { sendNotification } from "../../../socket/sendNotification.js";
import notificationService from "../../../utils/services/createnotification.service.js";

class LostItemService {

    private lostItemRepo = new lostItemRepository(lostItemModel);
    private tripRepo = new tripRepository(tripModel);
    private userRepo = new userRepository(userModel);
    private guideRepo = new guideRepository(guideModel);
    private driverRepo = new driverRepository(driverModel);
    createLostItem = async (req: IRequest, res: Response) => {

        const user = req.loggedInUser!.user;
        const { tripId, title, description } = req.body;
        if (!tripId) throw new badRequestException("Trip id is required");

        if (!mongoose.isValidObjectId(tripId))
            throw new badRequestException("Invalid trip id");

        if (!title) throw new badRequestException("Title is required");

        const trip = await this.tripRepo.findDocumentById(tripId);
        if (!trip) throw new badRequestException("Trip not found");

        const imagePath = req.file?.path;

        let image;

        if (imagePath) {

            const uploadResult = await uploadFileToCloudinary(
                imagePath,
                {
                    folder: "lost_item_images"
                }
            );

            await fs.unlink(imagePath);
            image = {
                secure_url: uploadResult.secure_url,
                public_id: uploadResult.public_id
            };
        }

        const lostItem = await this.lostItemRepo.createNewDocument({

            tripId,
            userId: user._id,
            title,
            description,
            image

        });
        if (trip.guideId) {

            const guide = await this.guideRepo.findDocumentById(
                trip.guideId.toString()
            );
            if (guide) {

                await notificationService.createNotification({

                    senderId: user._id.toString(),
                    receiverId: guide.userId.toString(),
                    title: "Lost Item Reported",
                    message: `${user.name} reported a lost item during the trip.`

                });

                sendNotification(
                    guide.userId.toString(),
                    {
                        title: "Lost Item Reported",
                        message: `${user.name} reported a lost item during the trip.`
                    }
                );
            }
        }
        if (trip.driverId) {

            const driver = await this.driverRepo.findDocumentById(
                trip.driverId.toString()
            );
            if (driver) {

                await notificationService.createNotification({

                    senderId: user._id.toString(),
                    receiverId: driver.userId.toString(),
                    title: "Lost Item Reported",
                    message: `${user.name} reported a lost item during the trip.`
                });
                sendNotification(
                    driver.userId.toString(),
                    {
                        title: "Lost Item Reported",
                        message: `${user.name} reported a lost item during the trip.`
                    }
                );
            }
        }
        const admins = await this.userRepo.findDocuments({
            role: roleEnum.ADMIN
        });

        for (const admin of admins) {

            await notificationService.createNotification({
                senderId: user._id.toString(),
                receiverId: admin._id.toString(),
                title: "New Lost Item",
                message: `${user.name} reported a new lost item.`
            });
            sendNotification(
                admin._id.toString(),
                {
                    title: "New Lost Item",
                    message: `${user.name} reported a new lost item.`
                }
            );
        }

        return res.status(201).json(successResponse("Lost item created successfully", 201, lostItem));
    };
    updateLostItem = async (req: IRequest, res: Response) => {

        const user = req.loggedInUser!.user;
        const { id } = req.params as { id: string };

        if (!mongoose.isValidObjectId(id))
            throw new badRequestException("Invalid lost item id");

        const lostItem = await this.lostItemRepo.findDocumentById(id);
        if (!lostItem) throw new badRequestException("Lost item not found");
        if (lostItem.userId.toString() !== user._id.toString() && user.role !== roleEnum.ADMIN) {
            throw new forbiddenException("You do not have permission to update this lost item");
        }
        const { title, description } = req.body;
        const updatedData: Partial<ILostItem> = {};

        if (title) updatedData.title = title;
        if (description) updatedData.description = description;
        if (!Object.keys(updatedData).length)
            throw new badRequestException("No data provided");

        const updatedLostItem =
            await this.lostItemRepo.findDocumentByIdAndUpdate(
                id,
                {
                    $set: updatedData
                },
                {
                    new: true
                }
            );
        return res.json(successResponse("Lost item updated successfully", 200, updatedLostItem));
    };
    updateLostItemStatus = async (req: IRequest, res: Response) => {

        const user = req.loggedInUser!.user;

        const { id } = req.params as { id: string };

        if (!mongoose.isValidObjectId(id))
            throw new badRequestException("Invalid lost item id");

        const { status } = req.body;
        if (!Object.values(lostItemStatusEnum).includes(status)) {
            throw new badRequestException("Invalid status");
        }

        const lostItem = await this.lostItemRepo.findDocumentById(id);
        if (!lostItem) throw new badRequestException("Lost item not found");

        if (lostItem.userId.toString() !== user._id.toString() && user.role !== roleEnum.ADMIN) {
            throw new forbiddenException("You do not have permission");
        }

        const allowedTransitions: Record<
            lostItemStatusEnum,
            lostItemStatusEnum[]
        > = {

            [lostItemStatusEnum.PENDING]: [
                lostItemStatusEnum.FOUND
            ],

            [lostItemStatusEnum.FOUND]: [
                lostItemStatusEnum.CLOSED
            ],

            [lostItemStatusEnum.CLOSED]: [
                lostItemStatusEnum.PENDING
            ]
        };

        if (!allowedTransitions[lostItem.status].includes(status)) {
            throw new badRequestException(`Cannot change status from ${lostItem.status} to ${status}`);
        }

        const updatedLostItem =
            await this.lostItemRepo.findDocumentByIdAndUpdate(
                id,
                {
                    status
                },
                {
                    new: true
                }
            );

        if (status === lostItemStatusEnum.FOUND) {

            await notificationService.createNotification({
                senderId: user._id.toString(),
                receiverId: lostItem.userId.toString(),
                title: "Lost Item Found",
                message: `Your lost item "${lostItem.title}" has been marked as FOUND.`
            });
            sendNotification(
                lostItem.userId.toString(),
                {
                    title: "Lost Item Found",
                    message: `Your lost item "${lostItem.title}" has been marked as FOUND.`
                }
            );
        }

        if (status === lostItemStatusEnum.CLOSED) {

            await notificationService.createNotification({
                senderId: user._id.toString(),
                receiverId: lostItem.userId.toString(),
                title: "Lost Item Closed",
                message: `Your lost item "${lostItem.title}" has been closed successfully.`
            });
            sendNotification(
                lostItem.userId.toString(),
                {
                    title: "Lost Item Closed",
                    message: `Your lost item "${lostItem.title}" has been closed successfully.`
                }
            );
        }

        if (status === lostItemStatusEnum.PENDING) {

            await notificationService.createNotification({
                senderId: user._id.toString(),
                receiverId: lostItem.userId.toString(),
                title: "Lost Item Reopened",
                message: `Your lost item "${lostItem.title}" has been reopened and is pending again.`
            });

            sendNotification(
                lostItem.userId.toString(),
                {
                    title: "Lost Item Reopened",
                    message: `Your lost item "${lostItem.title}" has been reopened and is pending again.`
                }
            );
        }
        return res.json(successResponse("Lost item status updated successfully", 200, updatedLostItem));
    };
    deleteLostItem = async (req: IRequest, res: Response) => {

        const user = req.loggedInUser!.user;
        const { id } = req.params as { id: string };
        if (!mongoose.isValidObjectId(id))
            throw new badRequestException("Invalid lost item id");

        const lostItem = await this.lostItemRepo.findDocumentById(id);

        if (!lostItem) throw new badRequestException("Lost item not found");

        if (lostItem.userId.toString() !== user._id.toString() && user.role !== roleEnum.ADMIN) {
            throw new forbiddenException("You do not have permission");
        }

        if (lostItem.image?.public_id) {
            await deleteFileFromCloudinary(
                lostItem.image.public_id
            );
        }

        await this.lostItemRepo.deleteById(id);
        return res.json(successResponse("Lost item deleted successfully", 200));
    }
    getLostItem = async (req: IRequest, res: Response) => {

        const { id } = req.params as { id: string };
        if (!mongoose.isValidObjectId(id))
            throw new badRequestException("Invalid lost item id");

        const lostItem = await this.lostItemRepo.findDocumentById(
            id,
            {},
            {
                populate: [
                    {
                        path: "userId",
                        select: "name email profileImage"
                    },
                    {
                        path: "tripId"
                    }
                ]
            }
        );
        if (!lostItem) throw new badRequestException("Lost item not found");
        return res.json(successResponse("Lost item fetched successfully", 200, lostItem));
    };
    getTripLostItems = async (req: IRequest, res: Response) => {

        const { tripId } = req.params as { tripId: string };
        if (!mongoose.isValidObjectId(tripId))
            throw new badRequestException("Invalid trip id");

        const lostItems = await this.lostItemRepo.findDocuments(
            {
                tripId
            },
            {},
            {
                populate: [
                    {
                        path: "userId",
                        select: "name profileImage"
                    }
                ]
            }
        );

        return res.json(successResponse("Trip lost items fetched successfully", 200, lostItems));
    };
    getMyLostItems = async (req: IRequest, res: Response) => {

        const user = req.loggedInUser!.user;

        const lostItems = await this.lostItemRepo.findDocuments(
            {
                userId: user._id
            },
            {},
            {
                populate: [
                    {
                        path: "tripId"
                    }
                ]
            }
        );
        return res.json(successResponse("My lost items fetched successfully", 200, lostItems));
    };
}

export default new LostItemService();