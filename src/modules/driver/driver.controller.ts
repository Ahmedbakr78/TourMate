import { Router } from "express";

import driverService from "./service/driver.service.js";

import { authentication } from "../../middlewares/authentication.middleware.js";
import { authorization } from "../../middlewares/authorization.middleware.js";

import { roleEnum } from "../../common/index.js";

const driverRouter = Router();

// Create driver
driverRouter.post("/create_driver", authentication, driverService.createDriver);

// Update driver
driverRouter.patch("/update/:id", authentication, authorization([roleEnum.ADMIN, roleEnum.DRIVER]), driverService.updateDriver);

// Delete driver
driverRouter.delete("/delete/:id", authentication, authorization([roleEnum.ADMIN, roleEnum.DRIVER]), driverService.deleteDriver);

// Get driver by id
driverRouter.get("/get/:id", driverService.getDriverById);

// Get all drivers
driverRouter.get("/all", driverService.getDrivers);

// Search drivers
driverRouter.post("/search", driverService.searchDrivers);


export { driverRouter };