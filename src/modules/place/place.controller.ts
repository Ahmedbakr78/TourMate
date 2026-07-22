import { Router } from "express";

import placeService from "./service/place.service.js";

import { authentication } from "../../middlewares/authentication.middleware.js";
import { authorization } from "../../middlewares/authorization.middleware.js";

import { roleEnum } from "../../common/index.js";

const placeRouter = Router();

// Create a new place
placeRouter.post("/create_place", authentication, authorization([roleEnum.ADMIN, roleEnum.TOURIST]), placeService.createPlace);

// Get a place by id
placeRouter.get("/get/:id", authentication, placeService.getPlaceById);

// Get all places
placeRouter.get("/all", authentication, placeService.getPlaces);

// Update a place
placeRouter.put("/update/:id", authentication, authorization([roleEnum.ADMIN, roleEnum.TOURIST]), placeService.updatePlace);

// Delete a place
placeRouter.delete("/places/:id", authentication, authorization([roleEnum.ADMIN, roleEnum.TOURIST]), placeService.deletePlace);

// Search places
placeRouter.get("/search", authentication, placeService.searchPlaces);

// Get nearby places
placeRouter.get("/nearby", authentication, placeService.getNearbyPlaces);


export { placeRouter };