import { Router } from "express";
import { authentication } from "../../middlewares/authentication.middleware.js";
import { authorization } from "../../middlewares/authorization.middleware.js";
import { roleEnum } from "../../common/index.js";
import adminService from "./service/admin.service.js";


const adminRouter = Router();

// Dashboard
// adminRouter.get("/dashboard", authentication, authorization(roleEnum.ADMIN), adminService.dashboard);

export { adminRouter };