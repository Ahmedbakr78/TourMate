import { Router } from "express";
import { authentication } from "../../middlewares/authentication.middleware.js";
import { authorization } from "../../middlewares/authorization.middleware.js";
import { roleEnum } from "../../common/index.js";
import adminService from "./service/admin.service.js";


const adminRouter = Router();

// Dashboard
adminRouter.get("/dashboard", authentication, authorization([roleEnum.ADMIN]), adminService.dashboard);

// System Statistics
adminRouter.get("/system-statistics", authentication, authorization([roleEnum.ADMIN]), adminService.systemStatistics);

// Change User Role
adminRouter.patch("/:id/role", authentication, authorization([roleEnum.ADMIN]), adminService.changeUserRole);

// Change User Status
adminRouter.patch("/:id/status", authentication, authorization([roleEnum.ADMIN]), adminService.changeUserStatus);

// Delete User
adminRouter.delete("/:id", authentication, authorization([roleEnum.ADMIN]), adminService.deleteUser);

// Update Driver Verification Status
adminRouter.patch("/driver/:id/verification-status", authentication, authorization([roleEnum.ADMIN]), adminService.updateDriverVerificationStatus);

// Update Guide Verification Status
adminRouter.patch("/guide/:id/verification-status", authentication, authorization([roleEnum.ADMIN]), adminService.updateGuideVerificationStatus);

export { adminRouter };