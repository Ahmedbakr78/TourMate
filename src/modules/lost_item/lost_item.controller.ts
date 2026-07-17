import { Router } from "express";
import lostItemService from "./service/lost_item.service.js";
const lostItemRouter = Router();

lostItemRouter.post("/",lostItemService.createLostItem);
lostItemRouter.patch("/:id",lostItemService.updateLostItem);
lostItemRouter.patch("/:id/status",lostItemService.updateLostItemStatus);
lostItemRouter.delete("/:id",lostItemService.deleteLostItem);
lostItemRouter.get("/trip/:tripId",lostItemService.getTripLostItems);
lostItemRouter.get("/my-items",lostItemService.getMyLostItems);
lostItemRouter.patch("/:id/found",lostItemService.reportFoundItem);
lostItemRouter.patch("/:id/close",lostItemService.closeLostItem);
lostItemRouter.patch("/:id/reopen",lostItemService.reopenLostItem);
lostItemRouter.get("/:id", lostItemService.getLostItem);
export { lostItemRouter };
