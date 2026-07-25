import { Router } from "express";
import notificationService from "./service/nofification.service.js";
import { authentication } from "../../middlewares/authentication.middleware.js";

const notificationRouter = Router();


// Get Notifications
notificationRouter.get("/notifications", authentication, notificationService.getNotifications);

// Get Notification By Id
notificationRouter.get("/get/:id", authentication, notificationService.getNotificationById);

// Mark Notification As Read
notificationRouter.patch("/:id/mark-as-read", authentication, notificationService.markNotificationAsRead);

// Mark All Notifications As Read
notificationRouter.patch("/mark-all-as-read", authentication, notificationService.markAllNotificationsAsRead);

// Delete Notification
notificationRouter.delete("/:id/delete", authentication, notificationService.deleteNotification);

export { notificationRouter };