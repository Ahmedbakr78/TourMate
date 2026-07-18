import { Router } from "express";
import lostItemService from "./service/lost_item.service.js";
import { authentication } from "../../middlewares/authentication.middleware.js";
import { authorization } from "../../middlewares/authorization.middleware.js";
import { hostUpload } from "../../middlewares/upload.middlewares.js";
import { fileTypes, roleEnum } from "../../common/index.js";

const lostItemRouter = Router();

// Get my lost items
lostItemRouter.get("/my-items", authentication, lostItemService.getMyLostItems);

// Get trip lost items
lostItemRouter.get("/trip/:tripId", authentication, lostItemService.getTripLostItems);

// Get lost item by id
lostItemRouter.get("/:id", authentication, lostItemService.getLostItem);

// Create lost item
lostItemRouter.post("/", authentication, authorization([roleEnum.TOURIST]), lostItemService.createLostItem);

// Update lost item
lostItemRouter.patch("/:id", authentication, authorization([roleEnum.TOURIST]), lostItemService.updateLostItem);

// Delete lost item
lostItemRouter.delete("/:id", authentication, authorization([roleEnum.TOURIST, roleEnum.ADMIN]), lostItemService.deleteLostItem);

// Update lost item status
lostItemRouter.patch("/:id/status", authentication, authorization([roleEnum.DRIVER, roleEnum.ADMIN]), lostItemService.updateLostItemStatus);

// Report item as found
lostItemRouter.patch("/:id/found", authentication, authorization([roleEnum.DRIVER, roleEnum.ADMIN]), lostItemService.reportFoundItem);

// Close lost item
lostItemRouter.patch("/:id/close", authentication, authorization([roleEnum.DRIVER, roleEnum.ADMIN]), lostItemService.closeLostItem);

// Reopen lost item
lostItemRouter.patch("/:id/reopen", authentication, authorization([roleEnum.DRIVER, roleEnum.ADMIN]), lostItemService.reopenLostItem);

// Upload lost item image
lostItemRouter.post("/:id/image", authentication, authorization([roleEnum.TOURIST]), hostUpload([fileTypes.IMAGE]).single("image"), lostItemService.uploadLostItemImage);

export { lostItemRouter };