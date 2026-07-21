import { Response } from "express";
import { IRequest, lostItemStatusEnum, roleEnum, statusUserEnum, tripStatusEnum, verificationStatusEnum } from "../../../common/index.js";
import { driverModel, driverRepository, guideModel, guideRepository, lostItemModel, lostItemRepository, placeModel, placeRepository, reviewModel, reviewRepository, tripModel, tripRepository, userModel, userRepository, voteModel, voteRepository } from "../../../db/index.js";
import { badRequestException, deleteFileFromCloudinary, successResponse, unauthorizedException } from "../../../utils/index.js";
import mongoose from "mongoose";


class adminService {

    private userRepo = new userRepository(userModel);
    private tripRepo = new tripRepository(tripModel);
    private placeRepo = new placeRepository(placeModel);
    private reviewRepo = new reviewRepository(reviewModel);
    private voteRepo = new voteRepository(voteModel);
    private guideRepo = new guideRepository(guideModel);
    private driverRepo = new driverRepository(driverModel);
    private lostItemRepo = new lostItemRepository(lostItemModel);

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
        if (!mongoose.isValidObjectId(id)) throw new badRequestException("Invalid driver id");

        if (verificationStatus !== verificationStatusEnum.APPROVED && verificationStatus !== verificationStatusEnum.REJECTED) {
            throw new badRequestException("verificationStatus must be APPROVED or REJECTED");
        }

        const driver = await this.driverRepo.findDocumentById(id);
        if (!driver) throw new badRequestException("Driver not found");
        if (driver.verificationStatus === verificationStatus) {
            throw new badRequestException(`Driver already ${verificationStatus.toLowerCase()}`);
        }

        await this.driverRepo.findDocumentByIdAndUpdate(id, { verificationStatus })
        if (verificationStatus === verificationStatusEnum.APPROVED) {
            await this.userRepo.findDocumentByIdAndUpdate(driver.userId, { role: roleEnum.DRIVER });
        }
        if (verificationStatus === verificationStatusEnum.REJECTED) {
            await this.userRepo.findDocumentByIdAndUpdate(driver.userId, { role: roleEnum.TOURIST });
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
        return res.json(successResponse(`Driver ${verificationStatus.toLowerCase()} successfully`, 200, updatedDriver));
    };
    updateGuideVerificationStatus = async (req: IRequest, res: Response) => {

        const { id } = req.params as { id: string };
        const { verificationStatus } = req.body;

        if (!mongoose.isValidObjectId(id)) throw new badRequestException("Invalid guide id");

        if (verificationStatus !== verificationStatusEnum.APPROVED && verificationStatus !== verificationStatusEnum.REJECTED) {
            throw new badRequestException(
                "verificationStatus must be APPROVED or REJECTED"
            );
        }

        const guide = await this.guideRepo.findDocumentById(id);
        if (!guide) throw new badRequestException("Guide not found");

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
        }

        if (verificationStatus === verificationStatusEnum.REJECTED) {
            await this.userRepo.findDocumentByIdAndUpdate(
                guide.userId,
                {
                    role: roleEnum.TOURIST
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
        return res.json(successResponse(`Guide ${verificationStatus.toLowerCase()} successfully`, 200, updatedGuide));
    };
}

export default new adminService();