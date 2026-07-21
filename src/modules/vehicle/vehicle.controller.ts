import { Router } from "express";
import vehicleService from "./service/vehicle.service.js";
import { authentication } from "../../middlewares/authentication.middleware.js";
import { authorization } from "../../middlewares/authorization.middleware.js";
import { hostUpload } from "../../middlewares/upload.middlewares.js";
import { fileTypes, roleEnum } from "../../common/index.js";

const vehicleRouter = Router();

// Create vehicle
vehicleRouter.post("/create_vehicle", authentication, authorization([roleEnum.DRIVER, roleEnum.ADMIN]), hostUpload([fileTypes.IMAGE]).single("image"), vehicleService.createVehicle);

// update vehicle
vehicleRouter.patch("/update/:id", authentication, authorization([roleEnum.DRIVER, roleEnum.ADMIN]), hostUpload([fileTypes.IMAGE]).single("image"), vehicleService.updateVehicle);

// get vehicle by id
vehicleRouter.get("/get/:id", vehicleService.getVehicleById);

// get all vehicles
vehicleRouter.get("/all", vehicleService.getVehicles);

// search vehicles  
vehicleRouter.get("/search", vehicleService.searchVehicles);

// delete vehicle
vehicleRouter.delete("/delete/:id", authentication, authorization([roleEnum.DRIVER, roleEnum.ADMIN]), vehicleService.deleteVehicle);

// get driver vehicles
vehicleRouter.get("/driver/:driverId", vehicleService.getDriverVehicles);

export { vehicleRouter };