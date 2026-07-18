import { Router } from "express";
import notificationService from "./service/nofification.service.js";
import { authentication } from "../../middlewares/authentication.middleware.js";

const notificationRouter = Router();

notificationRouter.post("/", authentication, notificationService.createNotification);
notificationRouter.get("/", authentication, notificationService.getNotifications);
notificationRouter.get("/unread-count", authentication, notificationService.getUnreadCount);
notificationRouter.patch("/read-all", authentication, notificationService.markAllNotificationsAsRead);
notificationRouter.delete("/delete-all", authentication, notificationService.deleteAllNotifications);
notificationRouter.get("/:id", authentication, notificationService.getNotificationById);
notificationRouter.patch("/:id/read", authentication, notificationService.markNotificationAsRead);
notificationRouter.delete("/:id", authentication, notificationService.deleteNotification);

export { notificationRouter };