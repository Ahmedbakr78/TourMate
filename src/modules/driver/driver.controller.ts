import { Router } from "express";

import driverService from "./service/driver.service.js";

import { authentication } from "../../middlewares/authentication.middleware.js";
import { authorization } from "../../middlewares/authorization.middleware.js";

import { roleEnum } from "../../common/index.js";

const driverRouter = Router();


// Get all drivers
driverRouter.get(
    "/",
    driverService.getDrivers
);

// Search drivers
driverRouter.get(
    "/search",
    driverService.searchDrivers
);

// Get driver by id
driverRouter.get(
    "/:id",
    driverService.getDriverById
);


// Create driver
driverRouter.post(
    "/",
    authentication,
    authorization([roleEnum.ADMIN]),
    driverService.createDriver
);

// Update driver
driverRouter.patch(
    "/:id",
    authentication,
    authorization([roleEnum.ADMIN]),
    driverService.updateDriver
);

// Delete driver
driverRouter.delete(
    "/:id",
    authentication,
    authorization([roleEnum.ADMIN]),
    driverService.deleteDriver
);

export { driverRouter };