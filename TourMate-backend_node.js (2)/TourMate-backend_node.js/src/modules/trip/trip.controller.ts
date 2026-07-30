import { Router } from "express";
import tripService from "./service/trip.service.js";
import { authentication } from "../../middlewares/authentication.middleware.js";
import { authorization } from "../../middlewares/authorization.middleware.js";
import { roleEnum } from "../../common/index.js";

const tripRouter = Router();

// Create trip
tripRouter.post("/create_trip", authentication, authorization([roleEnum.ADMIN, roleEnum.TOURIST]), tripService.createTrip);

// Get trip by id
tripRouter.get("/get/:id", authentication, tripService.getTripById);

// Get trips
tripRouter.get("/all", authentication, tripService.getTrips);

// Get my trips
tripRouter.get("/my_trips", authentication, tripService.getMyTrips);

// update trip 
tripRouter.patch("/:id/update", authentication, authorization([roleEnum.ADMIN, roleEnum.TOURIST]), tripService.updateTrip);

// cancel trip
tripRouter.patch("/:id/cancel", authentication, authorization([roleEnum.ADMIN, roleEnum.TOURIST]), tripService.cancelTrip);

// join trip
tripRouter.patch("/:id/join", authentication, authorization([roleEnum.ADMIN, roleEnum.TOURIST]), tripService.joinSharedTrip);

// delete trip
tripRouter.delete("/:id/delete", authentication, authorization([roleEnum.ADMIN, roleEnum.TOURIST]), tripService.deleteTrip);

// get shared trips
tripRouter.get("/shared", authentication, tripService.getSharedTrips);

// share trip
tripRouter.patch("/:id/share", authentication, authorization([roleEnum.ADMIN, roleEnum.TOURIST]), tripService.shareTrip);

// duplicate trip
tripRouter.post("/:id/duplicate", authentication, authorization([roleEnum.ADMIN, roleEnum.TOURIST]), tripService.duplicateTrip);

// get trip route
tripRouter.get("/:id/route", authentication, tripService.getTripRoute);

// assign guide
tripRouter.patch("/:id/assign-guide", authentication, authorization([roleEnum.ADMIN, roleEnum.TOURIST]), tripService.assignGuide);

// assign driver
tripRouter.patch("/:id/assign-driver", authentication, authorization([roleEnum.ADMIN, roleEnum.TOURIST]), tripService.assignDriver);

// assign vehicle
tripRouter.patch("/:id/assign-vehicle", authentication, authorization([roleEnum.ADMIN, roleEnum.TOURIST]), tripService.assignVehicle);

// start trip
tripRouter.patch("/:id/start", authentication, authorization([roleEnum.ADMIN]), tripService.startTrip);

// complete trip
tripRouter.patch("/:id/complete", authentication, authorization([roleEnum.ADMIN]), tripService.completeTrip);

// calculate price
tripRouter.post("/calculate-price", authentication, tripService.calculatePrice);

export { tripRouter };