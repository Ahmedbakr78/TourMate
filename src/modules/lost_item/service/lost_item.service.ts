import { Request, Response } from "express";
import mongoose from "mongoose";
import {lostItemModel,lostItemRepository} from "../../../db/index.js";
import {badRequestException,successResponse} from "../../../utils/index.js";
import { lostItemStatusEnum } from "../../../common/index.js";
class LostItemService {
    private lostItemRepo = new lostItemRepository(lostItemModel);
    createLostItem = async (req: Request, res: Response) => {

        const {
            tripId,
            userId,
            title,
            description,
            image
        } = req.body;

        const lostItem = await this.lostItemRepo.createNewDocument({
            tripId,
            userId,
            title,
            description,
            image
        });


        if (!lostItem) {
            throw new badRequestException("Failed to create lost item");
        }


        return res.json(
            successResponse(
                "Lost item created successfully",
                201,
                lostItem
            )
        );

    };
    updateLostItem = async (req: Request, res: Response) => {

   const { id } = req.params;

if (!mongoose.isValidObjectId(id)) {
    throw new badRequestException("Invalid lost item id");
}

const { title, description, image } = req.body;

    const lostItem = await this.lostItemRepo.findDocumentByIdAndUpdate(
        id as string,
        {
    ...(title && { title }),
    ...(description && { description }),
    ...(image && { image })
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
updateLostItemStatus = async (req: Request, res: Response) => {

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
const allowedTransitions = {
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
if (!allowedTransitions[currentStatus].includes(status)) {
    throw new badRequestException(
        `Cannot change status from ${currentStatus} to ${status}`
    );
}
const updatedLostItem =
    await this.lostItemRepo.findDocumentByIdAndUpdate(
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
deleteLostItem = async (req: Request, res: Response) => {

    const { id } = req.params;
if (!mongoose.isValidObjectId(id)) {
    throw new badRequestException("Invalid lost item id");
}
    const lostItem = await this.lostItemRepo.deleteById(id as string);

    if (!lostItem) {
        throw new badRequestException("Lost item not found");
    }

    return res.json(
        successResponse(
            "Lost item deleted successfully",
            200,
            lostItem
        )
    );
};

getLostItem = async (req: Request, res: Response) => {

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

getTripLostItems = async (req: Request, res: Response) => {

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

getMyLostItems = async (req: Request, res: Response) => {

   const { userId } = req.query;

if (!userId || typeof userId !== "string") {
    throw new badRequestException("User id is required");
}

if (!mongoose.isValidObjectId(userId)) {
    throw new badRequestException("Invalid user id");
}

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

reportFoundItem = async (req: Request, res: Response) => {

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
const updatedLostItem =
await this.lostItemRepo.findDocumentByIdAndUpdate(
    id as string,
    {
        status: lostItemStatusEnum.FOUND
    },
    {
        new:true
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
closeLostItem = async (req: Request, res: Response) => {

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


const updatedLostItem =
await this.lostItemRepo.findDocumentByIdAndUpdate(
    id as string,
    {
        status: lostItemStatusEnum.CLOSED
    },
    {
        new:true
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

reopenLostItem = async (req: Request, res: Response) => {

    const { id } = req.params;
if (!mongoose.isValidObjectId(id)) {
    throw new badRequestException("Invalid lost item id");
}
    const lostItem = await this.lostItemRepo.findDocumentByIdAndUpdate(
        
        id as string,
        
        {
            
            status: lostItemStatusEnum.PENDING
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
            "Lost item reopened successfully",
            200,
            lostItem
        )
    );
};
}

export default new LostItemService();