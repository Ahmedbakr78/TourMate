import { Response } from "express";
import { IRequest, ITrip, lostItemStatusEnum, roleEnum, statusUserEnum, tripStatusEnum, verificationStatusEnum } from "../../../common/index.js";
import { driverModel, driverRepository, guideModel, guideRepository, lostItemModel, lostItemRepository, placeModel, placeRepository, reviewModel, reviewRepository, tripModel, tripRepository, userModel, userRepository, vehicleModel, vehicleRepository, voteModel, voteRepository } from "../../../db/index.js";
import { badRequestException, deleteFileFromCloudinary, successResponse, unauthorizedException } from "../../../utils/index.js";
import mongoose from "mongoose";
import notificationService from "../../../utils/services/createnotification.service.js";
import { sendNotification } from "../../../socket/sendNotification.js";



class adminService {

    private userRepo = new userRepository(userModel);
    private tripRepo = new tripRepository(tripModel);
    private placeRepo = new placeRepository(placeModel);
    private reviewRepo = new reviewRepository(reviewModel);
    private voteRepo = new voteRepository(voteModel);
    private guideRepo = new guideRepository(guideModel);
    private driverRepo = new driverRepository(driverModel);
    private lostItemRepo = new lostItemRepository(lostItemModel);
    private vehicleRepo = new vehicleRepository(vehicleModel);

    dashboard = async (req: IRequest, res: Response) => {

        const [
            totalUsers, totalTrips, totalPlaces, totalReviews,
            totalVotes, totalGuides, totalDrivers, totalLostItems
        ] = await Promise.all([

            this.userRepo.countDocuments(),
            this.tripRepo.countDocuments(),
            this.placeRepo.countDocuments(),
            this.reviewRepo.countDocuments(),
            this.voteRepo.countDocuments(),
            this.guideRepo.countDocuments(),
            this.driverRepo.countDocuments(),
            this.lostItemRepo.countDocuments()
        ]);

        return res.json(successResponse("Dashboard fetched successfully", 200, {
            totalUsers,
            totalTrips,
            totalPlaces,
            totalReviews,
            totalVotes,
            totalGuides,
            totalDrivers,
            totalLostItems
        }));
    };
    systemStatistics = async (req: IRequest, res: Response) => {

        const [
            totalUsers, activeUsers, blockedUsers, totalTrips,
            activeTrips, completedTrips, cancelledTrips,
            totalLostItems, pendingLostItems, resolvedLostItems
        ] = await Promise.all([

            // Users
            this.userRepo.countDocuments(),
            this.userRepo.countDocuments({ status: statusUserEnum.ACTIVE }),
            this.userRepo.countDocuments({ status: statusUserEnum.BLOCKED }),

            // Trips
            this.tripRepo.countDocuments(),
            this.tripRepo.countDocuments({ status: tripStatusEnum.ACTIVE }),
            this.tripRepo.countDocuments({ status: tripStatusEnum.COMPLETED }),
            this.tripRepo.countDocuments({ status: tripStatusEnum.CANCELLED }),

            // Lost Items
            this.lostItemRepo.countDocuments(),
            this.lostItemRepo.countDocuments({ status: lostItemStatusEnum.PENDING }),
            this.lostItemRepo.countDocuments({ status: lostItemStatusEnum.FOUND })

        ]);

        return res.json(successResponse("System statistics fetched successfully", 200, {
            users: {
                total: totalUsers,
                active: activeUsers,
                blocked: blockedUsers
            },
            trips: {
                total: totalTrips,
                active: activeTrips,
                completed: completedTrips,
                cancelled: cancelledTrips
            },
            lostItems: {
                total: totalLostItems,
                pending: pendingLostItems,
                resolved: resolvedLostItems
            }
        }));
    };
    changeUserRole = async (req: IRequest, res: Response) => {

        const { id } = req.params as { id: string };
        const { role } = req.body;

        const currentAdmin = req.loggedInUser!.user;
        if (currentAdmin._id.toString() === id) {
            throw new badRequestException("You cannot change your own role");
        }

        if (!Object.values(roleEnum).includes(role)) {
            throw new badRequestException("Invalid role");
        }

        const user = await this.userRepo.findDocumentById(id);
        if (!user) throw new badRequestException("User not found");
        if (user.role === role) {
            throw new badRequestException(`User is already ${role}`);
        }
        if (user.status === statusUserEnum.BLOCKED) {
            throw new badRequestException("Blocked user role cannot be changed");
        }

        const updatedUser = await this.userRepo.findDocumentByIdAndUpdate(
            id,
            { role },
            { new: true }
        );
        return res.json(successResponse("User role updated successfully", 200, updatedUser));
    };
    changeUserStatus = async (req: IRequest, res: Response) => {

        const { id } = req.params as { id: string };
        if (req.loggedInUser!.user._id.toString() === id) {
            throw new badRequestException("You cannot delete your own account");
        }
        const { status } = req.body;

        if (!Object.values(statusUserEnum).includes(status)) {
            throw new badRequestException("Invalid status");
        }

        const user = await this.userRepo.findDocumentById(id);
        if (!user) throw new badRequestException("User not found");
        if (user.role === roleEnum.ADMIN) {
            throw new badRequestException("Admin status cannot be changed");
        }
        if (user.status === status) throw new badRequestException(`User is already ${status}`);

        const updatedUser = await this.userRepo.findDocumentByIdAndUpdate(
            id,
            {
                status
            },
            {
                new: true
            }
        );
        return res.json(successResponse("User status updated successfully", 200, updatedUser));
    };
    deleteUser = async (req: IRequest, res: Response) => {

        const { id } = req.params as { id: string };
        if (req.loggedInUser!.user._id.toString() === id) {
            throw new badRequestException("You cannot delete your own account");
        }

        const user = await this.userRepo.findDocumentById(id);
        if (!user) throw new badRequestException("User not found");
        if (user.role === roleEnum.ADMIN) {
            throw new badRequestException("Admin account cannot be deleted");
        }

        if (user.profileImage?.public_id) {
            await deleteFileFromCloudinary(user.profileImage.public_id);
        }
        await this.userRepo.deleteById(id);

        return res.json(successResponse("User deleted successfully", 200));
    };
    updateDriverVerificationStatus = async (req: IRequest, res: Response) => {

        const { id } = req.params as { id: string };
        const { verificationStatus } = req.body;

        if (!mongoose.isValidObjectId(id))
            throw new badRequestException("Invalid driver id");

        if (
            verificationStatus !== verificationStatusEnum.APPROVED &&
            verificationStatus !== verificationStatusEnum.REJECTED
        ) {
            throw new badRequestException(
                "verificationStatus must be APPROVED or REJECTED"
            );
        }

        const driver = await this.driverRepo.findDocumentById(id);

        if (!driver)
            throw new badRequestException("Driver not found");

        if (driver.verificationStatus === verificationStatus) {
            throw new badRequestException(
                `Driver already ${verificationStatus.toLowerCase()}`
            );
        }

        await this.driverRepo.findDocumentByIdAndUpdate(
            id,
            {
                verificationStatus
            }
        );

        if (verificationStatus === verificationStatusEnum.APPROVED) {

            await this.userRepo.findDocumentByIdAndUpdate(
                driver.userId,
                {
                    role: roleEnum.DRIVER
                }
            );

            await notificationService.createNotification({
                receiverId: driver.userId.toString(),
                title: "Driver Verification",
                message: "Congratulations! Your driver account has been approved."
            });

            sendNotification(
                driver.userId.toString(),
                {
                    title: "Driver Verification",
                    message: "Congratulations! Your driver account has been approved."
                }
            );

        }

        if (verificationStatus === verificationStatusEnum.REJECTED) {

            await this.userRepo.findDocumentByIdAndUpdate(
                driver.userId,
                {
                    role: roleEnum.TOURIST
                }
            );

            await notificationService.createNotification({
                receiverId: driver.userId.toString(),
                title: "Driver Verification",
                message: "Unfortunately, your driver account has been rejected."
            });

            sendNotification(
                driver.userId.toString(),
                {
                    title: "Driver Verification",
                    message: "Unfortunately, your driver account has been rejected."
                }
            );
        }

        const updatedDriver = await this.driverRepo.findDocumentById(
            id,
            {},
            {
                populate: {
                    path: "userId",
                    select: "-password"
                }
            }
        );

        return res.json(
            successResponse(
                `Driver ${verificationStatus.toLowerCase()} successfully`,
                200,
                updatedDriver
            )
        );
    };
    updateGuideVerificationStatus = async (req: IRequest, res: Response) => {

        const { id } = req.params as { id: string };
        const { verificationStatus } = req.body;

        if (!mongoose.isValidObjectId(id))
            throw new badRequestException("Invalid guide id");

        if (
            verificationStatus !== verificationStatusEnum.APPROVED &&
            verificationStatus !== verificationStatusEnum.REJECTED
        ) {
            throw new badRequestException(
                "verificationStatus must be APPROVED or REJECTED"
            );
        }

        const guide = await this.guideRepo.findDocumentById(id);

        if (!guide)
            throw new badRequestException("Guide not found");

        if (guide.verificationStatus === verificationStatus) {
            throw new badRequestException(
                `Guide already ${verificationStatus.toLowerCase()}`
            );
        }

        await this.guideRepo.findDocumentByIdAndUpdate(
            id,
            {
                verificationStatus
            }
        );

        if (verificationStatus === verificationStatusEnum.APPROVED) {

            await this.userRepo.findDocumentByIdAndUpdate(
                guide.userId,
                {
                    role: roleEnum.GUIDE
                }
            );

            await notificationService.createNotification({
                receiverId: guide.userId.toString(),
                title: "Guide Verification",
                message: "Congratulations! Your guide account has been approved."
            });

            sendNotification(
                guide.userId.toString(),
                {
                    title: "Guide Verification",
                    message: "Congratulations! Your guide account has been approved."
                }
            );
        }

        if (verificationStatus === verificationStatusEnum.REJECTED) {

            await this.userRepo.findDocumentByIdAndUpdate(
                guide.userId,
                {
                    role: roleEnum.TOURIST
                }
            );

            await notificationService.createNotification({
                receiverId: guide.userId.toString(),
                title: "Guide Verification",
                message: "Unfortunately, your guide account has been rejected."
            });

            sendNotification(
                guide.userId.toString(),
                {
                    title: "Guide Verification",
                    message: "Unfortunately, your guide account has been rejected."
                }
            );
        }

        const updatedGuide = await this.guideRepo.findDocumentById(
            id,
            {},
            {
                populate: {
                    path: "userId",
                    select: "-password"
                }
            }
        );

        return res.json(
            successResponse(
                `Guide ${verificationStatus.toLowerCase()} successfully`,
                200,
                updatedGuide
            )
        );
    };
    assignTripResources = async (req: IRequest, res: Response) => {

        const { id } = req.params as { id: string };

        if (!mongoose.isValidObjectId(id))
            throw new badRequestException("Invalid trip id");

        const { guideId, driverId, vehicleId } = req.body;

        const trip = await this.tripRepo.findDocumentById(id);
        if (!trip) throw new badRequestException("Trip not found");

        const updatedData: Partial<ITrip> = {};

        let guide;
        let driver;

        if (guideId) {

            if (!mongoose.isValidObjectId(guideId))
                throw new badRequestException("Invalid guide id");

            guide = await this.guideRepo.findDocumentById(guideId);

            if (!guide)
                throw new badRequestException("Guide not found");

            if (!guide.availability)
                throw new badRequestException("Guide is not available");

            updatedData.guideId = guideId;
        }

        if (driverId) {

            if (!mongoose.isValidObjectId(driverId))
                throw new badRequestException("Invalid driver id");

            driver = await this.driverRepo.findDocumentById(driverId);

            if (!driver)
                throw new badRequestException("Driver not found");

            if (!driver.availability)
                throw new badRequestException("Driver is not available");

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

        if (guideId && guide) {

            await this.guideRepo.findDocumentByIdAndUpdate(
                guideId,
                {
                    availability: false
                }
            );

            await notificationService.createNotification({
                receiverId: guide.userId.toString(),
                title: "Trip Assigned",
                message: "You have been assigned to a new trip."
            });

            sendNotification(
                guide.userId.toString(),
                {
                    title: "Trip Assigned",
                    message: "You have been assigned to a new trip."
                }
            );
        }

        if (driverId && driver) {

            await this.driverRepo.findDocumentByIdAndUpdate(
                driverId,
                {
                    availability: false
                }
            );

            await notificationService.createNotification({
                receiverId: driver.userId.toString(),
                title: "Trip Assigned",
                message: "You have been assigned to a new trip."
            });

            sendNotification(
                driver.userId.toString(),
                {
                    title: "Trip Assigned",
                    message: "You have been assigned to a new trip."
                }
            );
        }

        return res.json(
            successResponse(
                "Trip resources assigned successfully",
                200,
                updatedTrip
            )
        );
    };
    updateTripStatus = async (req: IRequest, res: Response) => {

        const { id } = req.params as { id: string };

        if (!mongoose.isValidObjectId(id))
            throw new badRequestException("Invalid trip id");

        const { status } = req.body;

        if (!Object.values(tripStatusEnum).includes(status))
            throw new badRequestException("Invalid trip status");

        const trip = await this.tripRepo.findDocumentById(id);

        if (!trip)
            throw new badRequestException("Trip not found");

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
                )
                    throw new badRequestException(
                        `Cannot cancel trip with status ${trip.status}`
                    );

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

        if (status === tripStatusEnum.COMPLETED) {

            if (trip.guideId) {
                await this.guideRepo.findDocumentByIdAndUpdate(
                    trip.guideId,
                    {
                        availability: true
                    }
                );
            }

            if (trip.driverId) {
                await this.driverRepo.findDocumentByIdAndUpdate(
                    trip.driverId,
                    {
                        availability: true
                    }
                );
            }
        }

        if (status === tripStatusEnum.CANCELLED) {

            if (trip.guideId) {
                await this.guideRepo.findDocumentByIdAndUpdate(
                    trip.guideId,
                    {
                        availability: true
                    }
                );
            }

            if (trip.driverId) {
                await this.driverRepo.findDocumentByIdAndUpdate(
                    trip.driverId,
                    {
                        availability: true
                    }
                );
            }
        }

        // ⬇️ Notification + Socket هيكون هنا
        // ==========================
        // Notifications
        // ==========================

        let touristMessage = "";

        switch (status) {

            case tripStatusEnum.CONFIRMED:
                touristMessage = "Your trip has been confirmed.";
                break;

            case tripStatusEnum.ONGOING:
                touristMessage = "Your trip has started.";
                break;

            case tripStatusEnum.COMPLETED:
                touristMessage = "Your trip has been completed.";
                break;

            case tripStatusEnum.CANCELLED:
                touristMessage = "Your trip has been cancelled.";
                break;
        }

        // Tourist
        await notificationService.createNotification({
            receiverId: trip.touristId.toString(),
            title: "Trip Status Updated",
            message: touristMessage
        });

        sendNotification(
            trip.touristId.toString(),
            {
                title: "Trip Status Updated",
                message: touristMessage
            }
        );

        // Guide
        if (trip.guideId) {

            const guide = await this.guideRepo.findDocumentById(trip.guideId);

            if (guide) {

                await notificationService.createNotification({
                    receiverId: guide.userId.toString(),
                    title: "Trip Status Updated",
                    message: `Trip status changed to ${status}.`
                });

                sendNotification(
                    guide.userId.toString(),
                    {
                        title: "Trip Status Updated",
                        message: `Trip status changed to ${status}.`
                    }
                );
            }
        }

        // Driver
        if (trip.driverId) {

            const driver = await this.driverRepo.findDocumentById(trip.driverId);

            if (driver) {

                await notificationService.createNotification({
                    receiverId: driver.userId.toString(),
                    title: "Trip Status Updated",
                    message: `Trip status changed to ${status}.`
                });

                sendNotification(
                    driver.userId.toString(),
                    {
                        title: "Trip Status Updated",
                        message: `Trip status changed to ${status}.`
                    }
                );
            }
        }

        return res.json(
            successResponse(
                `Trip ${status.toLowerCase()} successfully`,
                200,
                updatedTrip
            )
        );
    };



    confirmTripPayment = async (req: IRequest, res: Response) => {

        const { id } = req.params as { id: string };
        const { isPaid } = req.body;

        if (!mongoose.isValidObjectId(id))
            throw new badRequestException("Invalid trip id");

        if (typeof isPaid !== "boolean")
            throw new badRequestException("isPaid must be true or false");

        const trip = await this.tripRepo.findDocumentById(id);

        if (!trip)
            throw new badRequestException("Trip not found");

        const updatedTrip = await this.tripRepo.findDocumentByIdAndUpdate(
            id,
            {
                isPaid
            },
            {
                new: true
            }
        );

        await notificationService.createNotification({
            receiverId: trip.touristId.toString(),
            title: "Trip Payment",
            message: isPaid
                ? "Your trip payment has been confirmed."
                : "Your trip payment has been cancelled."
        });

        sendNotification(
            trip.touristId.toString(),
            {
                title: "Trip Payment",
                message: isPaid
                    ? "Your trip payment has been confirmed."
                    : "Your trip payment has been cancelled."
            }
        );

        return res.json(
            successResponse(
                `Trip payment ${isPaid ? "confirmed" : "cancelled"} successfully`,
                200,
                updatedTrip
            )
        );
    };



}

export default new adminService();