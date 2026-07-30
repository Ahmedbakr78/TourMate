import { Router } from "express";
import { authentication } from "../../middlewares/authentication.middleware.js";
import { authorization } from "../../middlewares/authorization.middleware.js";
import { roleEnum, IRequest } from "../../common/index.js";
import { successResponse, badRequestException } from "../../utils/index.js";
import { locationStore } from "./location.store.js";

const locationRouter = Router();

// Driver sends their location (polling-based, NOT WebSocket)
locationRouter.post("/update", authentication, authorization([roleEnum.DRIVER]), (req: IRequest, res: any) => {
    const { tripId, lat, lng } = req.body;
    const driverId = req.loggedInUser!.user._id.toString();
    if (!tripId || lat === undefined || lng === undefined) throw new badRequestException("tripId, lat, and lng are required");
    locationStore.setLocation(driverId, tripId, Number(lat), Number(lng));
    return res.json(successResponse("Location updated", 200));
});

// Tourist/admin polls driver's location
locationRouter.get("/driver/:driverId", authentication, (req: IRequest, res: any) => {
    const { driverId } = req.params;
    const loc = locationStore.getLocation(driverId);
    if (!loc) throw new badRequestException("Driver location not available");
    return res.json(successResponse("Driver location", 200, loc));
});

// Get location by trip ID
locationRouter.get("/trip/:tripId", authentication, (req: IRequest, res: any) => {
    const { tripId } = req.params;
    const loc = locationStore.getTripLocation(tripId);
    if (!loc) throw new badRequestException("Location not available for this trip");
    return res.json(successResponse("Trip location", 200, loc));
});

export { locationRouter };
