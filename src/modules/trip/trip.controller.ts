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

export { tripRouter };