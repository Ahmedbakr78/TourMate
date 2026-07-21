import { Router } from "express";
import tripService from "./service/trip.service.js";
import { authentication } from "../../middlewares/authentication.middleware.js";
import { authorization } from "../../middlewares/authorization.middleware.js";
import { roleEnum } from "../../common/index.js";

const tripRouter = Router();

// Create trip
tripRouter.post("/", authentication, authorization([roleEnum.ADMIN, roleEnum.TOURIST]), tripService.createTrip);



export { tripRouter };