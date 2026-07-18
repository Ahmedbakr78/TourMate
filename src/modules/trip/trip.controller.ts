import { Router } from "express";
import tripService from "./service/trip.service.js";
import { authentication } from "../../middlewares/authentication.middleware.js";
import { authorization } from "../../middlewares/authorization.middleware.js";
import { roleEnum } from "../../common/index.js";

const tripRouter = Router();

tripRouter.post("/", authentication, authorization([roleEnum.TOURIST]), tripService.createTrip);
tripRouter.get("/", authentication, authorization([roleEnum.ADMIN]), tripService.getTrips);
tripRouter.get("/my-trips", authentication, tripService.getMyTrips);
tripRouter.post("/calculate-price", tripService.calculateTripPrice);
tripRouter.get("/:id", authentication, tripService.getTripById);
tripRouter.patch("/:id", authentication, tripService.updateTrip);
tripRouter.delete("/:id", authentication, tripService.deleteTrip);
tripRouter.patch("/:id/guide", authentication, authorization([roleEnum.ADMIN]), tripService.assignGuide);
tripRouter.patch("/:id/driver", authentication, authorization([roleEnum.ADMIN]), tripService.assignDriver);
tripRouter.patch("/:id/vehicle", authentication, authorization([roleEnum.ADMIN]), tripService.assignVehicle);
tripRouter.patch("/:id/confirm", authentication, authorization([roleEnum.ADMIN]), tripService.confirmTrip);
tripRouter.patch("/:id/start", authentication, authorization([roleEnum.DRIVER, roleEnum.ADMIN]), tripService.startTrip);
tripRouter.patch("/:id/complete", authentication, authorization([roleEnum.DRIVER, roleEnum.ADMIN]), tripService.completeTrip);
tripRouter.patch("/:id/cancel", authentication, tripService.cancelTrip);
tripRouter.patch("/:id/location", authentication, authorization([roleEnum.DRIVER]), tripService.updateTripLocation);
tripRouter.get("/:id/route", authentication, tripService.getTripRoute);
tripRouter.post("/:id/join", authentication, authorization([roleEnum.TOURIST]), tripService.joinSharedTrip);

export { tripRouter };