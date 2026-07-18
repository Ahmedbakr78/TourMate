import { Response } from "express";
import mongoose from "mongoose";
import { IRequest, ITrip, roleEnum, tripStatusEnum } from "../../../common/index.js";
import { tripModel, tripRepository, placeModel, placeRepository, guideModel, guideRepository, driverModel, driverRepository, vehicleModel, vehicleRepository } from "../../../db/index.js";
import { badRequestException, forbiddenException, pagination, successResponse } from "../../../utils/index.js";

const getUser = (req: IRequest) => { if (!req.loggedInUser) throw new badRequestException("User not authenticated"); return req.loggedInUser.user; };

class tripService {

    private tripRepo = new tripRepository(tripModel);
    private placeRepo = new placeRepository(placeModel);
    private guideRepo = new guideRepository(guideModel);
    private driverRepo = new driverRepository(driverModel);
    private vehicleRepo = new vehicleRepository(vehicleModel);

    createTrip = async (req: IRequest, res: Response) => {
        const user = getUser(req);
        const { places, startDate, endDate, peopleCount, price } = req.body;

        if (!Array.isArray(places) || !places.length) throw new badRequestException("Places are required");
        for (const placeId of places) {
            if (!mongoose.isValidObjectId(placeId)) throw new badRequestException("Invalid place id");
            const exists = await this.placeRepo.findDocumentById(placeId);
            if (!exists) throw new badRequestException(`Place ${placeId} not found`);
        }
        if (new Date(startDate) > new Date(endDate)) throw new badRequestException("Start date must be before end date");

        const trip = await this.tripRepo.createNewDocument({
            touristId: user._id,
            places,
            startDate,
            endDate,
            peopleCount: peopleCount || 1,
            price: price || 0,
            status: tripStatusEnum.ACTIVE
        } as Partial<ITrip>);

        return res.status(201).json(successResponse("Trip created successfully", 201, trip));
    };

    getTripById = async (req: IRequest, res: Response) => {
        const { id } = req.params as { id: string };
        if (!mongoose.isValidObjectId(id)) throw new badRequestException("Invalid trip id");

        const trip = await tripModel.findById(id)
            .populate("places")
            .populate({ path: "guideId", populate: { path: "userId", select: "name email phone profileImage" } })
            .populate({ path: "driverId", populate: { path: "userId", select: "name email phone profileImage" } })
            .populate("vehicleId")
            .populate("touristId", "-password");

        if (!trip) throw new badRequestException("Trip not found");
        return res.json(successResponse("Trip fetched successfully", 200, trip));
    };

    getTrips = async (req: IRequest, res: Response) => {
        const { page, limit } = req.query;
        const { skip, limit: currentLimit } = pagination({ page: Number(page), limit: Number(limit) });
        const trips = await tripModel.find().populate("places").populate("touristId", "-password").skip(skip).limit(currentLimit);
        return res.json(successResponse("Trips fetched successfully", 200, trips));
    };

    getMyTrips = async (req: IRequest, res: Response) => {
        const user = getUser(req);
        const trips = await tripModel.find({ touristId: user._id })
            .populate("places")
            .populate({ path: "guideId", populate: { path: "userId", select: "name email phone" } })
            .populate({ path: "driverId", populate: { path: "userId", select: "name email phone" } })
            .populate("vehicleId");
        return res.json(successResponse("My trips fetched successfully", 200, trips));
    };

    updateTrip = async (req: IRequest, res: Response) => {
        const user = getUser(req);
        const { id } = req.params as { id: string };
        if (!mongoose.isValidObjectId(id)) throw new badRequestException("Invalid trip id");

        const trip = await this.tripRepo.findDocumentById(id);
        if (!trip) throw new badRequestException("Trip not found");
        if (trip.touristId.toString() !== user._id.toString() && user.role !== roleEnum.ADMIN)
            throw new forbiddenException("You do not have permission to update this trip");

        const { places, startDate, endDate, peopleCount, price } = req.body;
        const updatedData: Partial<ITrip> = {};
        if (places) updatedData.places = places;
        if (startDate) updatedData.startDate = startDate;
        if (endDate) updatedData.endDate = endDate;
        if (peopleCount) updatedData.peopleCount = peopleCount;
        if (price) updatedData.price = price;
        if (!Object.keys(updatedData).length) throw new badRequestException("No data provided to update");

        const updatedTrip = await this.tripRepo.findDocumentByIdAndUpdate(id, { $set: updatedData }, { new: true });
        return res.json(successResponse("Trip updated successfully", 200, updatedTrip));
    };

    deleteTrip = async (req: IRequest, res: Response) => {
        const user = getUser(req);
        const { id } = req.params as { id: string };
        if (!mongoose.isValidObjectId(id)) throw new badRequestException("Invalid trip id");

        const trip = await this.tripRepo.findDocumentById(id);
        if (!trip) throw new badRequestException("Trip not found");
        if (trip.touristId.toString() !== user._id.toString() && user.role !== roleEnum.ADMIN)
            throw new forbiddenException("You do not have permission to delete this trip");

        await this.tripRepo.deleteById(id);
        return res.json(successResponse("Trip deleted successfully", 200));
    };

    assignGuide = async (req: IRequest, res: Response) => {
        const { id } = req.params as { id: string };
        const { guideId } = req.body;
        if (!mongoose.isValidObjectId(guideId)) throw new badRequestException("Invalid guide id");

        const trip = await this.tripRepo.findDocumentById(id);
        if (!trip) throw new badRequestException("Trip not found");

        const guide = await this.guideRepo.findDocumentById(guideId);
        if (!guide) throw new badRequestException("Guide not found");

        const updatedTrip = await this.tripRepo.findDocumentByIdAndUpdate(id, { guideId }, { new: true });
        return res.json(successResponse("Guide assigned successfully", 200, updatedTrip));
    };

    assignDriver = async (req: IRequest, res: Response) => {
        const { id } = req.params as { id: string };
        const { driverId } = req.body;
        if (!mongoose.isValidObjectId(driverId)) throw new badRequestException("Invalid driver id");

        const trip = await this.tripRepo.findDocumentById(id);
        if (!trip) throw new badRequestException("Trip not found");

        const driver = await this.driverRepo.findDocumentById(driverId);
        if (!driver) throw new badRequestException("Driver not found");

        const updatedTrip = await this.tripRepo.findDocumentByIdAndUpdate(id, { driverId }, { new: true });
        return res.json(successResponse("Driver assigned successfully", 200, updatedTrip));
    };

    assignVehicle = async (req: IRequest, res: Response) => {
        const { id } = req.params as { id: string };
        const { vehicleId } = req.body;
        if (!mongoose.isValidObjectId(vehicleId)) throw new badRequestException("Invalid vehicle id");

        const trip = await this.tripRepo.findDocumentById(id);
        if (!trip) throw new badRequestException("Trip not found");

        const vehicle = await this.vehicleRepo.findDocumentById(vehicleId);
        if (!vehicle) throw new badRequestException("Vehicle not found");
        if (vehicle.capacity < trip.peopleCount) throw new badRequestException("Vehicle capacity is not enough for this trip");

        const updatedTrip = await this.tripRepo.findDocumentByIdAndUpdate(id, { vehicleId }, { new: true });
        return res.json(successResponse("Vehicle assigned successfully", 200, updatedTrip));
    };

    confirmTrip = async (req: IRequest, res: Response) => {
        const { id } = req.params as { id: string };
        const trip = await this.tripRepo.findDocumentById(id);
        if (!trip) throw new badRequestException("Trip not found");
        if (trip.status !== tripStatusEnum.PENDING) throw new badRequestException("Only pending trips can be confirmed");

        const updatedTrip = await this.tripRepo.findDocumentByIdAndUpdate(id, { status: tripStatusEnum.CONFIRMED }, { new: true });
        return res.json(successResponse("Trip confirmed successfully", 200, updatedTrip));
    };

    startTrip = async (req: IRequest, res: Response) => {
        const { id } = req.params as { id: string };
        const trip = await this.tripRepo.findDocumentById(id);
        if (!trip) throw new badRequestException("Trip not found");
        if (trip.status !== tripStatusEnum.CONFIRMED) throw new badRequestException("Only confirmed trips can be started");

        const updatedTrip = await this.tripRepo.findDocumentByIdAndUpdate(id, { status: tripStatusEnum.ONGOING }, { new: true });
        return res.json(successResponse("Trip started successfully", 200, updatedTrip));
    };

    completeTrip = async (req: IRequest, res: Response) => {
        const { id } = req.params as { id: string };
        const trip = await this.tripRepo.findDocumentById(id);
        if (!trip) throw new badRequestException("Trip not found");
        if (trip.status !== tripStatusEnum.ONGOING) throw new badRequestException("Only ongoing trips can be completed");

        const updatedTrip = await this.tripRepo.findDocumentByIdAndUpdate(id, { status: tripStatusEnum.COMPLETED }, { new: true });
        return res.json(successResponse("Trip completed successfully", 200, updatedTrip));
    };

    cancelTrip = async (req: IRequest, res: Response) => {
        const user = getUser(req);
        const { id } = req.params as { id: string };
        const trip = await this.tripRepo.findDocumentById(id);
        if (!trip) throw new badRequestException("Trip not found");
        if (trip.touristId.toString() !== user._id.toString() && user.role !== roleEnum.ADMIN)
            throw new forbiddenException("You do not have permission to cancel this trip");
        if ([tripStatusEnum.COMPLETED, tripStatusEnum.CANCELLED].includes(trip.status))
            throw new badRequestException(`Cannot cancel a trip with status ${trip.status}`);

        const updatedTrip = await this.tripRepo.findDocumentByIdAndUpdate(id, { status: tripStatusEnum.CANCELLED }, { new: true });
        return res.json(successResponse("Trip cancelled successfully", 200, updatedTrip));
    };

    updateTripLocation = async (req: IRequest, res: Response) => {
        const { id } = req.params as { id: string };
        const { coordinates } = req.body;
        if (!Array.isArray(coordinates) || coordinates.length !== 2) throw new badRequestException("Invalid coordinates");

        const trip = await this.tripRepo.findDocumentById(id);
        if (!trip) throw new badRequestException("Trip not found");
        if (trip.status !== tripStatusEnum.ONGOING) throw new badRequestException("Trip is not ongoing");

        const updatedTrip = await this.tripRepo.findDocumentByIdAndUpdate(id, { $push: { routePath: coordinates } }, { new: true });
        return res.json(successResponse("Trip location updated successfully", 200, updatedTrip));
    };

    getTripRoute = async (req: IRequest, res: Response) => {
        const { id } = req.params as { id: string };
        const trip = await this.tripRepo.findDocumentById(id);
        if (!trip) throw new badRequestException("Trip not found");
        return res.json(successResponse("Trip route fetched successfully", 200, { routePath: trip.routePath }));
    };

    joinSharedTrip = async (req: IRequest, res: Response) => {
        const user = getUser(req);
        const { id } = req.params as { id: string };
        const { peopleCount } = req.body;

        const originalTrip = await this.tripRepo.findDocumentById(id);
        if (!originalTrip) throw new badRequestException("Trip not found");
        if (originalTrip.touristId.toString() === user._id.toString()) throw new badRequestException("You already own this trip");

        if (originalTrip.vehicleId) {
            const vehicle = await this.vehicleRepo.findDocumentById(originalTrip.vehicleId);
            const joinedTrips = await this.tripRepo.findDocuments({ sharedTripId: originalTrip._id });
            const totalPeople = joinedTrips.reduce((sum, t) => sum + t.peopleCount, originalTrip.peopleCount) + Number(peopleCount || 1);
            if (vehicle && totalPeople > vehicle.capacity) throw new badRequestException("Vehicle capacity exceeded");
        }

        const sharedPrice = Math.round(originalTrip.price / (originalTrip.peopleCount + Number(peopleCount || 1)) * Number(peopleCount || 1));

        const trip = await this.tripRepo.createNewDocument({
            touristId: user._id,
            places: originalTrip.places,
            guideId: originalTrip.guideId,
            driverId: originalTrip.driverId,
            vehicleId: originalTrip.vehicleId,
            startDate: originalTrip.startDate,
            endDate: originalTrip.endDate,
            peopleCount: peopleCount || 1,
            price: sharedPrice,
            status: originalTrip.status,
            sharedTripId: originalTrip._id
        } as Partial<ITrip>);

        return res.status(201).json(successResponse("Joined shared trip successfully", 201, trip));
    };

    calculateTripPrice = async (req: IRequest, res: Response) => {
        const { startDate, endDate, peopleCount, guideId, driverId, vehicleId } = req.body;
        const days = Math.max(1, Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24)));

        let price = 50 * days;
        if (guideId) price += 100 * days;
        if (driverId) price += 80 * days;
        if (vehicleId) price += 60 * days;

        const finalPrice = Math.round(price * (1 + (Number(peopleCount || 1) - 1) * 0.1));
        return res.json(successResponse("Trip price calculated successfully", 200, { price: finalPrice }));
    };

}

export default new tripService();