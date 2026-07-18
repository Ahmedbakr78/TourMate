import { Router } from "express";
import vehicleService from "./service/vehicle.service.js";
import { authentication } from "../../middlewares/authentication.middleware.js";
import { authorization } from "../../middlewares/authorization.middleware.js";
import { hostUpload } from "../../middlewares/upload.middlewares.js";
import { fileTypes, roleEnum } from "../../common/index.js";

const vehicleRouter = Router();

// Get all vehicles
vehicleRouter.get(
    "/",
    vehicleService.getVehicles
);

// Search vehicles
vehicleRouter.get(
    "/search",
    vehicleService.searchVehicles
);

// Get vehicles by driver id
vehicleRouter.get(
    "/driver/:driverId",
    vehicleService.getDriverVehicles
);

// Get vehicle by id
vehicleRouter.get(
    "/:id",
    vehicleService.getVehicleById
);

// Create vehicle
vehicleRouter.post(
    "/",
    authentication,
    authorization([roleEnum.DRIVER, roleEnum.ADMIN]),
    vehicleService.createVehicle
);

// Update vehicle
vehicleRouter.patch(
    "/:id",
    authentication,
    authorization([roleEnum.DRIVER, roleEnum.ADMIN]),
    vehicleService.updateVehicle
);

// Delete vehicle
vehicleRouter.delete(
    "/:id",
    authentication,
    authorization([roleEnum.DRIVER, roleEnum.ADMIN]),
    vehicleService.deleteVehicle
);

// Upload vehicle image
vehicleRouter.post(
    "/:id/image",
    authentication,
    authorization([roleEnum.DRIVER, roleEnum.ADMIN]),
    hostUpload([fileTypes.IMAGE]).single("image"),
    vehicleService.uploadVehicleImage
);

// Delete vehicle image
vehicleRouter.delete(
    "/:id/image",
    authentication,
    authorization([roleEnum.DRIVER, roleEnum.ADMIN]),
    vehicleService.deleteVehicleImage
);

export { vehicleRouter };