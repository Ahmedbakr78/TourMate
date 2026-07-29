import { Router } from "express";

import placeService from "./service/place.service.js";
import overpassService from "./service/overpass.service.js";

import { authentication } from "../../middlewares/authentication.middleware.js";
import { authorization } from "../../middlewares/authorization.middleware.js";

import { roleEnum, IRequest } from "../../common/index.js";
import { successResponse, badRequestException } from "../../utils/index.js";

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

// Get popular places
placeRouter.get("/popular", placeService.getPopularPlaces);

// Filter places
placeRouter.get("/filter", placeService.filterPlaces);

// Save place
placeRouter.post("/save/:id", authentication, placeService.savePlace);

// Unsave place
placeRouter.delete("/save/:id", authentication, placeService.unsavePlace);

// Overpass API proxy
placeRouter.get("/overpass/search", authentication, async (req: IRequest, res: any) => {
    const { q, city } = req.query;
    if (!q) throw new badRequestException("Query parameter 'q' is required");
    const places = await overpassService.searchPlaces(q as string, city as string | undefined);
    return res.json(successResponse("Places fetched from Overpass", 200, places));
});

placeRouter.get("/overpass/nearby", authentication, async (req: IRequest, res: any) => {
    const { lat, lng, radius } = req.query;
    if (!lat || !lng) throw new badRequestException("lat and lng are required");
    const places = await overpassService.getNearbyPlaces(Number(lat), Number(lng), Number(radius) || 1000);
    return res.json(successResponse("Nearby places from Overpass", 200, places));
});

export { placeRouter };