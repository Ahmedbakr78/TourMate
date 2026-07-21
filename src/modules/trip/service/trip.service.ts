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

        const {
            places,
            startDate,
            endDate,
            peopleCount,
            guideId,
            driverId,
            vehicleId
        } = req.body;

        if (!Array.isArray(places) || !places.length)
            throw new badRequestException("Places are required");

        if (!startDate || !endDate)
            throw new badRequestException("Trip dates are required");

        if (new Date(startDate) > new Date(endDate))
            throw new badRequestException("Start date must be before end date");

        if (Number(peopleCount) <= 0)
            throw new badRequestException("People count must be greater than zero");

        for (const placeId of places) {

            if (!mongoose.isValidObjectId(placeId))
                throw new badRequestException("Invalid place id");

            const place = await this.placeRepo.findDocumentById(placeId);

            if (!place)
                throw new badRequestException(`Place ${placeId} not found`);
        }

        if (guideId) {

            const guide = await this.guideRepo.findDocumentById(guideId);

            if (!guide)
                throw new badRequestException("Guide not found");

            if (!guide.availability)
                throw new badRequestException("Guide is not available");
        }

        if (driverId) {

            const driver = await this.driverRepo.findDocumentById(driverId);

            if (!driver)
                throw new badRequestException("Driver not found");

            if (!driver.availability)
                throw new badRequestException("Driver is not available");
        }

        if (vehicleId) {

            const vehicle = await this.vehicleRepo.findDocumentById(vehicleId);

            if (!vehicle)
                throw new badRequestException("Vehicle not found");

            if (vehicle.capacity < Number(peopleCount))
                throw new badRequestException("Vehicle capacity is not enough");
        }

        const days = Math.max(
            1,
            Math.ceil(
                (new Date(endDate).getTime() - new Date(startDate).getTime())
                / (1000 * 60 * 60 * 24)
            )
        );

        let price = 50 * days;

        if (guideId)
            price += 100 * days;

        if (driverId)
            price += 80 * days;

        if (vehicleId)
            price += 60 * days;

        const finalPrice = Math.round(
            price * (1 + (Number(peopleCount) - 1) * 0.1)
        );

        const trip = await this.tripRepo.createNewDocument({

            touristId: user._id,

            places,

            guideId,

            driverId,

            vehicleId,

            startDate,

            endDate,

            peopleCount,

            price: finalPrice,

            status: tripStatusEnum.PENDING

        } as Partial<ITrip>);

        return res.status(201).json(
            successResponse(
                "Trip created successfully",
                201,
                trip
            )
        );
    };
    getTripById = async (req: IRequest, res: Response) => {

        const { id } = req.params as { id: string };

        if (!mongoose.isValidObjectId(id))
            throw new badRequestException("Invalid trip id");

        const trip = await this.tripRepo.findDocumentById(
            id,
            {},
            {
                populate: [
                    { path: "places" },
                    {
                        path: "guideId",
                        populate: {
                            path: "userId",
                            select: "name email phone profileImage"
                        }
                    },
                    {
                        path: "driverId",
                        populate: {
                            path: "userId",
                            select: "name email phone profileImage"
                        }
                    },
                    {
                        path: "vehicleId"
                    },
                    {
                        path: "touristId",
                        select: "-password"
                    }
                ]
            }
        );

        if (!trip)
            throw new badRequestException("Trip not found");

        return res.json(
            successResponse(
                "Trip fetched successfully",
                200,
                trip
            )
        );
    };
    getTrips = async (req: IRequest, res: Response) => {

        const { page, limit } = req.query;

        const paginateResult = await this.tripRepo.paginateModel(
            {},
            {
                ...pagination({
                    page: Number(page),
                    limit: Number(limit)
                }),
                populate: [
                    {
                        path: "places"
                    },
                    {
                        path: "touristId",
                        select: "-password"
                    },
                    {
                        path: "guideId",
                        populate: {
                            path: "userId",
                            select: "name email phone"
                        }
                    },
                    {
                        path: "driverId",
                        populate: {
                            path: "userId",
                            select: "name email phone"
                        }
                    },
                    {
                        path: "vehicleId"
                    }
                ],
                sort: {
                    createdAt: -1
                }
            }
        );

        return res.json(
            successResponse(
                "Trips fetched successfully",
                200,
                paginateResult
            )
        );
    };
    getMyTrips = async (req: IRequest, res: Response) => {

        const user = getUser(req);

        const { page, limit } = req.query;

        const paginateResult = await this.tripRepo.paginateModel(
            {
                touristId: user._id
            },
            {
                ...pagination({
                    page: Number(page),
                    limit: Number(limit)
                }),
                populate: [
                    {
                        path: "places"
                    },
                    {
                        path: "guideId",
                        populate: {
                            path: "userId",
                            select: "name email phone"
                        }
                    },
                    {
                        path: "driverId",
                        populate: {
                            path: "userId",
                            select: "name email phone"
                        }
                    },
                    {
                        path: "vehicleId"
                    }
                ],
                sort: {
                    createdAt: -1
                }
            }
        );

        return res.json(
            successResponse(
                "My trips fetched successfully",
                200,
                paginateResult
            )
        );
    };
    updateTrip = async (req: IRequest, res: Response) => {

        const user = getUser(req);

        const { id } = req.params as { id: string };

        if (!mongoose.isValidObjectId(id))
            throw new badRequestException("Invalid trip id");

        const trip = await this.tripRepo.findDocumentById(id);

        if (!trip)
            throw new badRequestException("Trip not found");

        if (
            trip.touristId.toString() !== user._id.toString() &&
            user.role !== roleEnum.ADMIN
        ) {
            throw new forbiddenException("You do not have permission to update this trip");
        }

        const {
            places,
            startDate,
            endDate,
            peopleCount
        } = req.body;

        const updatedData: Partial<ITrip> = {};

        if (places) {

            if (!Array.isArray(places) || !places.length)
                throw new badRequestException("Places are required");

            for (const placeId of places) {

                if (!mongoose.isValidObjectId(placeId))
                    throw new badRequestException("Invalid place id");

                const place = await this.placeRepo.findDocumentById(placeId);

                if (!place)
                    throw new badRequestException(`Place ${placeId} not found`);
            }

            updatedData.places = places;
        }

        if (startDate)
            updatedData.startDate = startDate;

        if (endDate)
            updatedData.endDate = endDate;

        if (startDate && endDate) {

            if (new Date(startDate) > new Date(endDate))
                throw new badRequestException("Start date must be before end date");
        }

        if (peopleCount) {

            if (Number(peopleCount) <= 0)
                throw new badRequestException("People count must be greater than zero");

            updatedData.peopleCount = peopleCount;
        }

        if (!Object.keys(updatedData).length)
            throw new badRequestException("No data provided to update");

        const updatedTrip = await this.tripRepo.findDocumentByIdAndUpdate(
            id,
            {
                $set: updatedData
            },
            {
                new: true
            }
        );

        return res.json(
            successResponse(
                "Trip updated successfully",
                200,
                updatedTrip
            )
        );
    };
    deleteTrip = async (req: IRequest, res: Response) => {

        const user = getUser(req);

        const { id } = req.params as { id: string };

        if (!mongoose.isValidObjectId(id))
            throw new badRequestException("Invalid trip id");

        const trip = await this.tripRepo.findDocumentById(id);

        if (!trip)
            throw new badRequestException("Trip not found");

        if (
            trip.touristId.toString() !== user._id.toString() &&
            user.role !== roleEnum.ADMIN
        ) {
            throw new forbiddenException("You do not have permission to delete this trip");
        }

        if (trip.status === tripStatusEnum.ONGOING)
            throw new badRequestException("Cannot delete ongoing trip");

        await this.tripRepo.deleteById(id);

        return res.json(
            successResponse(
                "Trip deleted successfully",
                200
            )
        );
    };
    assignResources = async (req: IRequest, res: Response) => {

        const { id } = req.params as { id: string };

        if (!mongoose.isValidObjectId(id))
            throw new badRequestException("Invalid trip id");

        const {
            guideId,
            driverId,
            vehicleId
        } = req.body;

        const trip = await this.tripRepo.findDocumentById(id);

        if (!trip)
            throw new badRequestException("Trip not found");

        const updatedData: Partial<ITrip> = {};

        if (guideId) {

            if (!mongoose.isValidObjectId(guideId))
                throw new badRequestException("Invalid guide id");

            const guide = await this.guideRepo.findDocumentById(guideId);

            if (!guide)
                throw new badRequestException("Guide not found");

            updatedData.guideId = guideId;
        }

        if (driverId) {

            if (!mongoose.isValidObjectId(driverId))
                throw new badRequestException("Invalid driver id");

            const driver = await this.driverRepo.findDocumentById(driverId);

            if (!driver)
                throw new badRequestException("Driver not found");

            updatedData.driverId = driverId;
        }

        if (vehicleId) {

            if (!mongoose.isValidObjectId(vehicleId))
                throw new badRequestException("Invalid vehicle id");

            const vehicle = await this.vehicleRepo.findDocumentById(vehicleId);

            if (!vehicle)
                throw new badRequestException("Vehicle not found");

            if (vehicle.capacity < trip.peopleCount)
                throw new badRequestException("Vehicle capacity is not enough");

            updatedData.vehicleId = vehicleId;
        }

        if (!Object.keys(updatedData).length)
            throw new badRequestException("No data provided");

        const updatedTrip = await this.tripRepo.findDocumentByIdAndUpdate(
            id,
            {
                $set: updatedData
            },
            {
                new: true
            }
        );

        return res.json(
            successResponse(
                "Trip resources assigned successfully",
                200,
                updatedTrip
            )
        );

    };
    updateTripStatus = async (req: IRequest, res: Response) => {

        const user = getUser(req);

        const { id } = req.params as { id: string };

        if (!mongoose.isValidObjectId(id))
            throw new badRequestException("Invalid trip id");

        const { status } = req.body;

        if (
            !Object.values(tripStatusEnum).includes(status)
        ) {
            throw new badRequestException("Invalid trip status");
        }

        const trip = await this.tripRepo.findDocumentById(id);

        if (!trip)
            throw new badRequestException("Trip not found");

        if (
            user.role !== roleEnum.ADMIN &&
            trip.touristId.toString() !== user._id.toString()
        ) {
            throw new forbiddenException("You do not have permission");
        }

        switch (status) {

            case tripStatusEnum.CONFIRMED:

                if (trip.status !== tripStatusEnum.PENDING)
                    throw new badRequestException("Only pending trips can be confirmed");

                break;

            case tripStatusEnum.ONGOING:

                if (trip.status !== tripStatusEnum.CONFIRMED)
                    throw new badRequestException("Only confirmed trips can be started");

                if (!trip.guideId)
                    throw new badRequestException("Guide is required");

                if (!trip.driverId)
                    throw new badRequestException("Driver is required");

                if (!trip.vehicleId)
                    throw new badRequestException("Vehicle is required");

                break;

            case tripStatusEnum.COMPLETED:

                if (trip.status !== tripStatusEnum.ONGOING)
                    throw new badRequestException("Only ongoing trips can be completed");

                break;

            case tripStatusEnum.CANCELLED:

                if (
                    trip.status === tripStatusEnum.COMPLETED ||
                    trip.status === tripStatusEnum.CANCELLED
                ) {
                    throw new badRequestException(`Cannot cancel trip with status ${trip.status}`);
                }

                break;

            default:
                throw new badRequestException("Invalid status");
        }

        const updatedTrip = await this.tripRepo.findDocumentByIdAndUpdate(
            id,
            {
                status
            },
            {
                new: true
            }
        );

        return res.json(
            successResponse(
                `Trip ${status.toLowerCase()} successfully`,
                200,
                updatedTrip
            )
        );

    };


}

export default new tripService();