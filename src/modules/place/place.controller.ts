import { Router } from "express";

import placeService from "./service/place.service.js";

import { authentication } from "../../middlewares/authentication.middleware.js";
import { authorization } from "../../middlewares/authorization.middleware.js";

import { roleEnum } from "../../common/index.js";

const placeRouter = Router();

/* Public */

// Get all places
placeRouter.get("/", placeService.getPlaces);

// Search places
placeRouter.get("/search", placeService.searchPlaces);

// Nearby places
placeRouter.get("/nearby", placeService.getNearbyPlaces);

// Get place by id
placeRouter.get("/:id", placeService.getPlaceById);

// Create place
placeRouter.post("/", authentication, authorization([roleEnum.ADMIN]), placeService.createPlace);

// Update place
placeRouter.patch("/:id", authentication, authorization([roleEnum.ADMIN]), placeService.updatePlace);

// Delete place
placeRouter.delete("/:id", authentication, authorization([roleEnum.ADMIN]), placeService.deletePlace);

export { placeRouter };