import { Response } from "express";
import fs from "fs/promises";
import mongoose from "mongoose";
import {
    lostItemModel,
    lostItemRepository
} from "../../../db/index.js";
import {
    badRequestException,
    deleteFileFromCloudinary,
    successResponse,
    uploadFileToCloudinary
} from "../../../utils/index.js";
import {
    IRequest,
    lostItemStatusEnum
} from "../../../common/index.js";

class LostItemService {

    private lostItemRepo = new lostItemRepository(lostItemModel);

    createLostItem = async (req: IRequest, res: Response) => {

        const { tripId, title, description } = req.body;
        const userId = req.loggedInUser!.user._id;

        const lostItem = await this.lostItemRepo.createNewDocument({
            tripId,
            userId,
            title,
            description
        });

        if (!lostItem) {
            throw new badRequestException("Failed to create lost item");
        }

        return res.status(201).json(
            successResponse(
                "Lost item created successfully",
                201,
                lostItem
            )
        );
    };

    updateLostItem = async (req: IRequest, res: Response) => {

        const { id } = req.params;

        if (!mongoose.isValidObjectId(id)) {
            throw new badRequestException("Invalid lost item id");
        }

        const { title, description } = req.body;

        const lostItem = await this.lostItemRepo.findDocumentByIdAndUpdate(
            id as string,
            {
                ...(title && { title }),
                ...(description && { description })
            },
            {
                new: true
            }
        );

        if (!lostItem) {
            throw new badRequestException("Lost item not found");
        }

        return res.json(
            successResponse(
                "Lost item updated successfully",
                200,
                lostItem
            )
        );
    };

    updateLostItemStatus = async (req: IRequest, res: Response) => {

        const { id } = req.params;

        if (!mongoose.isValidObjectId(id)) {
            throw new badRequestException("Invalid lost item id");
        }

        const { status } = req.body;

        if (!Object.values(lostItemStatusEnum).includes(status as lostItemStatusEnum)) {
            throw new badRequestException("Invalid lost item status");
        }

        const lostItem = await this.lostItemRepo.findDocumentById(id as string);

        if (!lostItem) {
            throw new badRequestException("Lost item not found");
        }

        const currentStatus = lostItem.status;

        const allowedTransitions: Record<lostItemStatusEnum, lostItemStatusEnum[]> = {
            [lostItemStatusEnum.PENDING]: [lostItemStatusEnum.FOUND],
            [lostItemStatusEnum.FOUND]: [lostItemStatusEnum.CLOSED],
            [lostItemStatusEnum.CLOSED]: [lostItemStatusEnum.PENDING]
        };

        if (!allowedTransitions[currentStatus].includes(status)) {
            throw new badRequestException(
                `Cannot change status from ${currentStatus} to ${status}`
            );
        }

        const updatedLostItem = await this.lostItemRepo.findDocumentByIdAndUpdate(
            id as string,
            {
                status
            },
            {
                new: true
            }
        );

        return res.json(
            successResponse(
                "Lost item status updated successfully",
                200,
                updatedLostItem
            )
        );
    };

    deleteLostItem = async (req: IRequest, res: Response) => {

        const { id } = req.params;

        if (!mongoose.isValidObjectId(id)) {
            throw new badRequestException("Invalid lost item id");
        }

        const existingLostItem = await this.lostItemRepo.findDocumentById(id as string);

        if (!existingLostItem) {
            throw new badRequestException("Lost item not found");
        }

        if (existingLostItem.image?.public_id) {
            await deleteFileFromCloudinary(existingLostItem.image.public_id);
        }

        const lostItem = await this.lostItemRepo.deleteById(id as string);

        return res.json(
            successResponse(
                "Lost item deleted successfully",
                200,
                lostItem
            )
        );
    };

    getLostItem = async (req: IRequest, res: Response) => {

        const { id } = req.params;

        if (!mongoose.isValidObjectId(id)) {
            throw new badRequestException("Invalid lost item id");
        }

        const lostItem = await this.lostItemRepo.findDocumentById(id as string);

        if (!lostItem) {
            throw new badRequestException("Lost item not found");
        }

        return res.json(
            successResponse(
                "Lost item fetched successfully",
                200,
                lostItem
            )
        );
    };

    getTripLostItems = async (req: IRequest, res: Response) => {

        const { tripId } = req.params;

        if (!mongoose.isValidObjectId(tripId)) {
            throw new badRequestException("Invalid trip id");
        }

        const lostItems = await this.lostItemRepo.findDocuments({
            tripId
        });

        return res.json(
            successResponse(
                "Trip lost items fetched successfully",
                200,
                lostItems
            )
        );
    };

    getMyLostItems = async (req: IRequest, res: Response) => {

        const userId = req.loggedInUser!.user._id;

        const lostItems = await this.lostItemRepo.findDocuments({
            userId
        });

        return res.json(
            successResponse(
                "My lost items fetched successfully",
                200,
                lostItems
            )
        );
    };

    reportFoundItem = async (req: IRequest, res: Response) => {

        const { id } = req.params;

        if (!mongoose.isValidObjectId(id)) {
            throw new badRequestException("Invalid lost item id");
        }

        const lostItem = await this.lostItemRepo.findDocumentById(id as string);

        if (!lostItem) {
            throw new badRequestException("Lost item not found");
        }

        if (lostItem.status !== lostItemStatusEnum.PENDING) {
            throw new badRequestException(
                "Only pending items can be reported as found"
            );
        }

        const updatedLostItem = await this.lostItemRepo.findDocumentByIdAndUpdate(
            id as string,
            {
                status: lostItemStatusEnum.FOUND
            },
            {
                new: true
            }
        );

        return res.json(
            successResponse(
                "Item reported as found successfully",
                200,
                updatedLostItem
            )
        );
    };

    closeLostItem = async (req: IRequest, res: Response) => {

        const { id } = req.params;

        if (!mongoose.isValidObjectId(id)) {
            throw new badRequestException("Invalid lost item id");
        }

        const lostItem = await this.lostItemRepo.findDocumentById(id as string);

        if (!lostItem) {
            throw new badRequestException("Lost item not found");
        }

        if (lostItem.status !== lostItemStatusEnum.FOUND) {
            throw new badRequestException(
                "Only found items can be closed"
            );
        }

        const updatedLostItem = await this.lostItemRepo.findDocumentByIdAndUpdate(
            id as string,
            {
                status: lostItemStatusEnum.CLOSED
            },
            {
                new: true
            }
        );

        return res.json(
            successResponse(
                "Lost item closed successfully",
                200,
                updatedLostItem
            )
        );
    };

    reopenLostItem = async (req: IRequest, res: Response) => {

        const { id } = req.params;

        if (!mongoose.isValidObjectId(id)) {
            throw new badRequestException("Invalid lost item id");
        }

        const lostItem = await this.lostItemRepo.findDocumentById(id as string);

        if (!lostItem) {
            throw new badRequestException("Lost item not found");
        }

        if (lostItem.status !== lostItemStatusEnum.CLOSED) {
            throw new badRequestException(
                "Only closed items can be reopened"
            );
        }

        const updatedLostItem = await this.lostItemRepo.findDocumentByIdAndUpdate(
            id as string,
            {
                status: lostItemStatusEnum.PENDING
            },
            {
                new: true
            }
        );

        return res.json(
            successResponse(
                "Lost item reopened successfully",
                200,
                updatedLostItem
            )
        );
    };

    uploadLostItemImage = async (req: IRequest, res: Response) => {

        const { id } = req.params;

        if (!mongoose.isValidObjectId(id)) {
            throw new badRequestException("Invalid lost item id");
        }

        const imagePath = req.file?.path;

        if (!imagePath) {
            throw new badRequestException("Image is required");
        }

        const existingLostItem = await this.lostItemRepo.findDocumentById(id as string);

        if (!existingLostItem) {
            throw new badRequestException("Lost item not found");
        }

        if (existingLostItem.image?.public_id) {
            await deleteFileFromCloudinary(existingLostItem.image.public_id);
        }

        const uploadResult = await uploadFileToCloudinary(
            imagePath,
            {
                folder: "lost_item_images"
            }
        );

        await fs.unlink(imagePath);

        const updatedLostItem = await this.lostItemRepo.findDocumentByIdAndUpdate(
            id as string,
            {
                image: {
                    secure_url: uploadResult.secure_url,
                    public_id: uploadResult.public_id
                }
            },
            {
                new: true
            }
        );

        return res.status(201).json(
            successResponse(
                "Lost item image uploaded successfully",
                201,
                updatedLostItem
            )
        );
    };

}

export default new LostItemService();