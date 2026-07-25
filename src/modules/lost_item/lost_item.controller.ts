import { Router } from "express";
import lostItemService from "./service/lost_item.service.js";
import { authentication } from "../../middlewares/authentication.middleware.js";
import { authorization } from "../../middlewares/authorization.middleware.js";
import { hostUpload } from "../../middlewares/upload.middlewares.js";
import { fileTypes, roleEnum } from "../../common/index.js";

const lostItemRouter = Router();

// Create lost item
lostItemRouter.post("/create_lost_item", authentication, lostItemService.createLostItem);

// Update lost item 
lostItemRouter.patch("/:id/update", authentication, lostItemService.updateLostItem);

// Update lost item status
lostItemRouter.patch("/:id/status", authentication, lostItemService.updateLostItemStatus);

// Delete lost item
lostItemRouter.delete("/:id/delete", authentication, lostItemService.deleteLostItem);

// Get lost item
lostItemRouter.get("/get/:id", authentication, lostItemService.getLostItem);

// Get trip lost items
lostItemRouter.get("/:tripId/trip_lost_items", authentication, lostItemService.getTripLostItems);

// Get my lost items    
lostItemRouter.get("/my_lost_items", authentication, lostItemService.getMyLostItems);

export { lostItemRouter };