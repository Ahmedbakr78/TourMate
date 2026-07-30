import { Response } from "express";
import mongoose from "mongoose";
import { IRequest, ITrip, roleEnum, tripStatusEnum, verificationStatusEnum } from "../../../common/index.js";
import { tripModel, tripRepository, placeModel, placeRepository, guideModel, guideRepository, driverModel, driverRepository, vehicleModel, vehicleRepository, notificationRepository, notificationModel } from "../../../db/index.js";
import { badRequestException, forbiddenException, pagination, successResponse } from "../../../utils/index.js";
import TripPriceService from "../../../utils/services/tripPrice.service.js";
import { sendNotification } from "../../../socket/sendNotification.js";
import notificationService from "../../../utils/services/createnotification.service.js";

class tripService {

    private tripRepo = new tripRepository(tripModel);
    private placeRepo = new placeRepository(placeModel);
    private guideRepo = new guideRepository(guideModel);
    private driverRepo = new driverRepository(driverModel);
    private vehicleRepo = new vehicleRepository(vehicleModel);
    private notificationRepo = new notificationRepository(notificationModel);

    createTrip = async (req: IRequest, res: Response) => {

        const user = req.loggedInUser!.user;

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

        let guide = null;
        let driver = null;

        if (guideId) {

            guide = await this.guideRepo.findDocumentById(guideId);

            if (!guide)
                throw new badRequestException("Guide not found");

            if (!guide.availability)
                throw new badRequestException("Guide is not available");

            if (guide.verificationStatus !== verificationStatusEnum.APPROVED)
                throw new badRequestException("Guide is not approved");

        }

        if (driverId) {

            driver = await this.driverRepo.findDocumentById(driverId);

            if (!driver)
                throw new badRequestException("Driver not found");

            if (!driver.availability)
                throw new badRequestException("Driver is not available");

            if (driver.verificationStatus !== verificationStatusEnum.APPROVED)
                throw new badRequestException("Driver is not approved");

        }

        if (vehicleId) {

            const vehicle = await this.vehicleRepo.findDocumentById(vehicleId);

            if (!vehicle)
                throw new badRequestException("Vehicle not found");

            if (vehicle.capacity < Number(peopleCount))
                throw new badRequestException("Vehicle capacity is not enough");

        }

        const finalPrice = await TripPriceService.calculateTripPrice(
            places,
            startDate,
            endDate,
            peopleCount,
            guideId,
            driverId,
            vehicleId
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


        if (guide) {

            await notificationService.createNotification({

                senderId: user._id.toString(),

                receiverId: guide.userId.toString(),

                title: "New Trip",

                message: "A new trip has been assigned to you."

            });

            sendNotification(

                guide.userId.toString(),

                {

                    title: "New Trip",

                    message: "A new trip has been assigned to you."

                }

            );

        }
        if (driver) {

            await notificationService.createNotification({
                senderId: user._id.toString(),
                receiverId: driver.userId.toString(),
                title: "New Trip",
                message: "A new trip has been assigned to you."
            });
            sendNotification(
                driver.userId.toString(),
                {
                    title: "New Trip",
                    message: "A new trip has been assigned to you."
                }
            );
        }
        return res.status(201).json(successResponse("Trip created successfully", 201, trip));

    };
    getTripById = async (req: IRequest, res: Response) => {

        const { id } = req.params as { id: string };
        if (!mongoose.isValidObjectId(id)) throw new badRequestException("Invalid trip id");

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
                            select: "name email phone profileImage "
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
                        select: "-password -otps"
                    }
                ]
            }
        );
        if (!trip) throw new badRequestException("Trip not found");
        return res.json(successResponse("Trip fetched successfully", 200, trip));
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
                        select: "-password -otps"
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
        return res.json(successResponse("Trips fetched successfully", 200, paginateResult));
    };
    getMyTrips = async (req: IRequest, res: Response) => {

        const userId = req.loggedInUser!.user._id;
        if (!mongoose.isValidObjectId(userId)) throw new badRequestException("Invalid user id");
        const { page, limit } = req.query;
        const paginateResult = await this.tripRepo.paginateModel(
            {
                touristId: userId
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
        return res.json(successResponse("My trips fetched successfully", 200, paginateResult));
    };
    updateTrip = async (req: IRequest, res: Response) => {

        if (!req.loggedInUser) throw new badRequestException("User not authenticated");
        const user = req.loggedInUser.user;
        const { id } = req.params as { id: string };
        if (!mongoose.isValidObjectId(id)) throw new badRequestException("Invalid trip id");

        const trip = await this.tripRepo.findDocumentById(id);
        if (!trip) throw new badRequestException("Trip not found");

        if (
            trip.touristId.toString() !== user._id.toString() &&
            user.role !== roleEnum.ADMIN
        ) {
            throw new forbiddenException("You do not have permission to update this trip");
        }

        const { places, startDate, endDate, peopleCount } = req.body;
        const updatedData: Partial<ITrip> = {};
        if (places) {

            if (!Array.isArray(places) || !places.length)
                throw new badRequestException("Places are required");
            for (const placeId of places) {

                if (!mongoose.isValidObjectId(placeId))
                    throw new badRequestException("Invalid place id");

                const place = await this.placeRepo.findDocumentById(placeId);
                if (!place) throw new badRequestException(`Place ${placeId} not found`);
            }
            updatedData.places = places;
        }

        const newStartDate = startDate || trip.startDate;
        const newEndDate = endDate || trip.endDate;

        if (new Date(newStartDate) > new Date(newEndDate))
            throw new badRequestException("Start date must be before end date");

        if (startDate) updatedData.startDate = startDate;
        if (endDate) updatedData.endDate = endDate;

        if (peopleCount !== undefined) {

            if (Number(peopleCount) <= 0)
                throw new badRequestException("People count must be greater than zero");

            if (trip.vehicleId) {

                const vehicle = await this.vehicleRepo.findDocumentById(
                    trip.vehicleId.toString()
                );
                if (vehicle && vehicle.capacity < Number(peopleCount)) {
                    throw new badRequestException("Vehicle capacity is not enough");
                }
            }
            updatedData.peopleCount = Number(peopleCount);
        }

        if (!Object.keys(updatedData).length) throw new badRequestException("No data provided to update");
        const updatedTrip = await this.tripRepo.findDocumentByIdAndUpdate(
            id,
            {
                $set: updatedData
            },
            {
                new: true
            }
        );
        return res.json(successResponse("Trip updated successfully", 200, updatedTrip));
    };
    cancelTrip = async (req: IRequest, res: Response) => {

        if (!req.loggedInUser)
            throw new badRequestException("User not authenticated");

        const user = req.loggedInUser.user;

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
            throw new forbiddenException("You do not have permission");
        }

        if (
            trip.status === tripStatusEnum.COMPLETED ||
            trip.status === tripStatusEnum.CANCELLED
        ) {
            throw new badRequestException("Trip cannot be cancelled");
        }

        await this.tripRepo.findDocumentByIdAndUpdate(
            id,
            {
                status: tripStatusEnum.CANCELLED
            }
        );


        if (trip.guideId) {

            const guide = await this.guideRepo.findDocumentById(
                trip.guideId
            );

            await this.guideRepo.findDocumentByIdAndUpdate(
                trip.guideId,
                {
                    availability: true
                }
            );

            if (guide) {

                await notificationService.createNotification({

                    senderId: user._id.toString(),

                    receiverId: guide.userId.toString(),

                    title: "Trip Cancelled",

                    message: "The assigned trip has been cancelled."

                });

                sendNotification(

                    guide.userId.toString(),

                    {

                        title: "Trip Cancelled",

                        message: "The assigned trip has been cancelled."

                    }

                );

            }

        }

        if (trip.driverId) {

            const driver = await this.driverRepo.findDocumentById(
                trip.driverId
            );

            await this.driverRepo.findDocumentByIdAndUpdate(
                trip.driverId,
                {
                    availability: true
                }
            );

            if (driver) {

                await notificationService.createNotification({

                    senderId: user._id.toString(),

                    receiverId: driver.userId.toString(),

                    title: "Trip Cancelled",

                    message: "The assigned trip has been cancelled."

                });

                sendNotification(
                    driver.userId.toString(),
                    {

                        title: "Trip Cancelled",

                        message: "The assigned trip has been cancelled."

                    }
                );
            }
        }
        return res.json(successResponse("Trip cancelled successfully", 200));
    };
    joinSharedTrip = async (req: IRequest, res: Response) => {

        if (!req.loggedInUser)
            throw new badRequestException("User not authenticated");

        const user = req.loggedInUser.user;

        const { id } = req.params as { id: string };

        if (!mongoose.isValidObjectId(id))
            throw new badRequestException("Invalid trip id");

        const { peopleCount = 1 } = req.body;

        const trip = await this.tripRepo.findDocumentById(id);

        if (!trip)
            throw new badRequestException("Trip not found");

        if (trip.status !== tripStatusEnum.CONFIRMED)
            throw new badRequestException("Only confirmed trips can be joined");

        if (trip.touristId.toString() === user._id.toString())
            throw new badRequestException("You cannot join your own trip");

        const alreadyJoined = await this.tripRepo.findOneDocument({

            sharedTripId: trip._id,

            touristId: user._id

        });

        if (alreadyJoined)
            throw new badRequestException("You already joined this trip");

        let totalPeople = trip.peopleCount;

        const joinedTrips = await this.tripRepo.findDocuments({

            sharedTripId: trip._id

        });

        joinedTrips.forEach(item => {

            totalPeople += item.peopleCount;

        });

        totalPeople += Number(peopleCount);

        if (trip.vehicleId) {

            const vehicle = await this.vehicleRepo.findDocumentById(
                trip.vehicleId
            );

            if (!vehicle)
                throw new badRequestException("Vehicle not found");

            if (totalPeople > vehicle.capacity)
                throw new badRequestException("Vehicle capacity exceeded");

        }

        const joinedTrip = await this.tripRepo.createNewDocument({

            touristId: user._id,

            sharedTripId: trip._id,

            places: trip.places,

            guideId: trip.guideId,

            driverId: trip.driverId,

            vehicleId: trip.vehicleId,

            startDate: trip.startDate,

            endDate: trip.endDate,

            peopleCount,

            price: trip.price,

            status: trip.status,

            routePath: trip.routePath

        } as Partial<ITrip>);

        await notificationService.createNotification({

            senderId: user._id.toString(),

            receiverId: trip.touristId.toString(),

            title: "Shared Trip",

            message: `${user.name} joined your shared trip.`

        });

        sendNotification(

            trip.touristId.toString(),

            {

                title: "Shared Trip",

                message: `${user.name} joined your shared trip.`

            }

        );
        return res.status(201).json(successResponse("Joined trip successfully", 201, joinedTrip));
    };
    deleteTrip = async (req: IRequest, res: Response) => {

        if (!req.loggedInUser)
            throw new badRequestException("User not authenticated");

        const user = req.loggedInUser.user;
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

        await this.tripRepo.deleteById(id);
        return res.json(successResponse("Trip deleted successfully", 200));
    };
    getSharedTrips = async (req: IRequest, res: Response) => {

        const { page, limit } = req.query;
        const paginateResult = await this.tripRepo.paginateModel(
            {
                sharedTripId: { $exists: true }
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
                        path: "touristId",
                        select: "-password -otps"
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
        return res.json(successResponse("Shared trips fetched successfully", 200, paginateResult));
    };
    shareTrip = async (req: IRequest, res: Response) => {

        if (!req.loggedInUser)
            throw new badRequestException("User not authenticated");

        const user = req.loggedInUser.user;
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
            throw new forbiddenException("You do not have permission to share this trip");
        }

        const shareCode = new mongoose.Types.ObjectId().toString();
        const updatedTrip = await this.tripRepo.findDocumentByIdAndUpdate(
            id,
            {
                $set: { status: tripStatusEnum.CONFIRMED }
            },
            {
                new: true
            }
        );
        return res.json(successResponse("Trip shared successfully", 200, { shareCode, tripId: id }));
    };
    duplicateTrip = async (req: IRequest, res: Response) => {

        if (!req.loggedInUser)
            throw new badRequestException("User not authenticated");

        const user = req.loggedInUser.user;
        const { id } = req.params as { id: string };

        if (!mongoose.isValidObjectId(id))
            throw new badRequestException("Invalid trip id");

        const trip = await this.tripRepo.findDocumentById(id);

        if (!trip)
            throw new badRequestException("Trip not found");

        const duplicatedTrip = await this.tripRepo.createNewDocument({
            touristId: user._id,
            places: trip.places,
            guideId: trip.guideId,
            driverId: trip.driverId,
            vehicleId: trip.vehicleId,
            startDate: trip.startDate,
            endDate: trip.endDate,
            peopleCount: trip.peopleCount,
            price: trip.price,
            status: tripStatusEnum.PENDING,
            routePath: trip.routePath
        } as Partial<ITrip>);
        return res.status(201).json(successResponse("Trip duplicated successfully", 201, duplicatedTrip));
    };
    getTripRoute = async (req: IRequest, res: Response) => {

        const { id } = req.params as { id: string };

        if (!mongoose.isValidObjectId(id))
            throw new badRequestException("Invalid trip id");

        const trip = await this.tripRepo.findDocumentById(id);

        if (!trip)
            throw new badRequestException("Trip not found");

        return res.json(successResponse("Trip route fetched successfully", 200, trip.routePath));
    };
    assignGuide = async (req: IRequest, res: Response) => {

        if (!req.loggedInUser)
            throw new badRequestException("User not authenticated");

        const user = req.loggedInUser.user;
        const { id } = req.params as { id: string };

        if (!mongoose.isValidObjectId(id))
            throw new badRequestException("Invalid trip id");

        const { guideId } = req.body;

        if (!guideId)
            throw new badRequestException("Guide id is required");

        if (!mongoose.isValidObjectId(guideId))
            throw new badRequestException("Invalid guide id");

        const trip = await this.tripRepo.findDocumentById(id);

        if (!trip)
            throw new badRequestException("Trip not found");

        if (
            trip.touristId.toString() !== user._id.toString() &&
            user.role !== roleEnum.ADMIN
        ) {
            throw new forbiddenException("You do not have permission to assign guide");
        }

        const guide = await this.guideRepo.findDocumentById(guideId);

        if (!guide)
            throw new badRequestException("Guide not found");

        if (!guide.availability)
            throw new badRequestException("Guide is not available");

        if (guide.verificationStatus !== verificationStatusEnum.APPROVED)
            throw new badRequestException("Guide is not approved");

        const updatedTrip = await this.tripRepo.findDocumentByIdAndUpdate(
            id,
            {
                $set: { guideId }
            },
            {
                new: true
            }
        );

        await this.guideRepo.findDocumentByIdAndUpdate(
            guideId,
            {
                $set: { availability: false }
            }
        );

        await notificationService.createNotification({
            senderId: user._id.toString(),
            receiverId: guide.userId.toString(),
            title: "Guide Assigned",
            message: "You have been assigned to a trip."
        });

        sendNotification(
            guide.userId.toString(),
            {
                title: "Guide Assigned",
                message: "You have been assigned to a trip."
            }
        );
        return res.json(successResponse("Guide assigned successfully", 200, updatedTrip));
    };
    assignDriver = async (req: IRequest, res: Response) => {

        if (!req.loggedInUser)
            throw new badRequestException("User not authenticated");

        const user = req.loggedInUser.user;
        const { id } = req.params as { id: string };

        if (!mongoose.isValidObjectId(id))
            throw new badRequestException("Invalid trip id");

        const { driverId } = req.body;

        if (!driverId)
            throw new badRequestException("Driver id is required");

        if (!mongoose.isValidObjectId(driverId))
            throw new badRequestException("Invalid driver id");

        const trip = await this.tripRepo.findDocumentById(id);

        if (!trip)
            throw new badRequestException("Trip not found");

        if (
            trip.touristId.toString() !== user._id.toString() &&
            user.role !== roleEnum.ADMIN
        ) {
            throw new forbiddenException("You do not have permission to assign driver");
        }

        const driver = await this.driverRepo.findDocumentById(driverId);

        if (!driver)
            throw new badRequestException("Driver not found");

        if (!driver.availability)
            throw new badRequestException("Driver is not available");

        if (driver.verificationStatus !== verificationStatusEnum.APPROVED)
            throw new badRequestException("Driver is not approved");

        const updatedTrip = await this.tripRepo.findDocumentByIdAndUpdate(
            id,
            {
                $set: { driverId }
            },
            {
                new: true
            }
        );

        await this.driverRepo.findDocumentByIdAndUpdate(
            driverId,
            {
                $set: { availability: false }
            }
        );

        await notificationService.createNotification({
            senderId: user._id.toString(),
            receiverId: driver.userId.toString(),
            title: "Driver Assigned",
            message: "You have been assigned to a trip."
        });

        sendNotification(
            driver.userId.toString(),
            {
                title: "Driver Assigned",
                message: "You have been assigned to a trip."
            }
        );
        return res.json(successResponse("Driver assigned successfully", 200, updatedTrip));
    };
    assignVehicle = async (req: IRequest, res: Response) => {

        if (!req.loggedInUser)
            throw new badRequestException("User not authenticated");

        const user = req.loggedInUser.user;
        const { id } = req.params as { id: string };

        if (!mongoose.isValidObjectId(id))
            throw new badRequestException("Invalid trip id");

        const { vehicleId } = req.body;

        if (!vehicleId)
            throw new badRequestException("Vehicle id is required");

        if (!mongoose.isValidObjectId(vehicleId))
            throw new badRequestException("Invalid vehicle id");

        const trip = await this.tripRepo.findDocumentById(id);

        if (!trip)
            throw new badRequestException("Trip not found");

        if (
            trip.touristId.toString() !== user._id.toString() &&
            user.role !== roleEnum.ADMIN
        ) {
            throw new forbiddenException("You do not have permission to assign vehicle");
        }

        const vehicle = await this.vehicleRepo.findDocumentById(vehicleId);

        if (!vehicle)
            throw new badRequestException("Vehicle not found");

        if (vehicle.capacity < Number(trip.peopleCount))
            throw new badRequestException("Vehicle capacity is not enough");

        const updatedTrip = await this.tripRepo.findDocumentByIdAndUpdate(
            id,
            {
                $set: { vehicleId }
            },
            {
                new: true
            }
        );
        return res.json(successResponse("Vehicle assigned successfully", 200, updatedTrip));
    };
    startTrip = async (req: IRequest, res: Response) => {

        if (!req.loggedInUser)
            throw new badRequestException("User not authenticated");

        const { id } = req.params as { id: string };

        if (!mongoose.isValidObjectId(id))
            throw new badRequestException("Invalid trip id");

        const trip = await this.tripRepo.findDocumentById(id);

        if (!trip)
            throw new badRequestException("Trip not found");

        if (trip.status !== tripStatusEnum.CONFIRMED)
            throw new badRequestException("Only confirmed trips can be started");

        const updatedTrip = await this.tripRepo.findDocumentByIdAndUpdate(
            id,
            {
                $set: { status: tripStatusEnum.ONGOING }
            },
            {
                new: true
            }
        );
        return res.json(successResponse("Trip started successfully", 200, updatedTrip));
    };
    completeTrip = async (req: IRequest, res: Response) => {

        if (!req.loggedInUser)
            throw new badRequestException("User not authenticated");

        const { id } = req.params as { id: string };

        if (!mongoose.isValidObjectId(id))
            throw new badRequestException("Invalid trip id");

        const trip = await this.tripRepo.findDocumentById(id);

        if (!trip)
            throw new badRequestException("Trip not found");

        if (trip.status !== tripStatusEnum.ONGOING)
            throw new badRequestException("Only ongoing trips can be completed");

        const updatedTrip = await this.tripRepo.findDocumentByIdAndUpdate(
            id,
            {
                $set: { status: tripStatusEnum.COMPLETED }
            },
            {
                new: true
            }
        );

        if (trip.guideId) {
            await this.guideRepo.findDocumentByIdAndUpdate(
                trip.guideId,
                {
                    $set: { availability: true }
                }
            );
        }

        if (trip.driverId) {
            await this.driverRepo.findDocumentByIdAndUpdate(
                trip.driverId,
                {
                    $set: { availability: true }
                }
            );
        }
        return res.json(successResponse("Trip completed successfully", 200, updatedTrip));
    };
    calculatePrice = async (req: IRequest, res: Response) => {

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

        const price = await TripPriceService.calculateTripPrice(
            places,
            startDate,
            endDate,
            peopleCount,
            guideId,
            driverId,
            vehicleId
        );
        return res.json(successResponse("Price calculated successfully", 200, { price }));
    };

}

export default new tripService();