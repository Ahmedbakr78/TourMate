import { Request, Response } from "express";
import { IDriver, IRequest, roleEnum, statusUserEnum, verificationStatusEnum } from "../../../common/index.js";
import { driverModel, driverRepository, userModel, userRepository } from "../../../db/index.js";
import { badRequestException, conflictException, pagination, successResponse } from "../../../utils/index.js";
import mongoose from "mongoose";

class driverService {

    private driverRepo = new driverRepository(driverModel);
    private userRepo = new userRepository(userModel);

    createDriver = async (req: IRequest, res: Response) => {

        const { userId, licenseNumber, currentLocation } = req.body;
        if (!mongoose.isValidObjectId(userId)) throw new badRequestException("Invalid user id");

        const user = await this.userRepo.findDocumentById(userId);
        if (!user) throw new badRequestException("User not found");
        if (user.role !== roleEnum.TOURIST) throw new badRequestException("Only tourist can become a driver");

        if (!user.isVerified) throw new badRequestException("User is not verified");

        if (user.status !== statusUserEnum.ACTIVE) throw new badRequestException("User is blocked");

        const existingDriver = await this.driverRepo.findOneDocument({ userId });
        if (existingDriver) throw new conflictException("Driver already exists");

        if (!licenseNumber) throw new badRequestException("License number is required");
        const licenseExists = await this.driverRepo.exists({ licenseNumber });
        if (licenseExists) throw new conflictException("License number already exists");


        const driver = await this.driverRepo.createNewDocument({
            userId,
            licenseNumber,
            currentLocation,
            availability: true,
            rating: 0,
            verificationStatus: verificationStatusEnum.PENDING
        } as Partial<IDriver>);

        return res.json(successResponse("Driver created successfully", 201, { driver }));
    };

    updateDriver = async (req: Request, res: Response) => {

        const { id } = req.params as { id: string };
        if (!mongoose.isValidObjectId(id)) throw new badRequestException("Invalid driver id");

        const { licenseNumber, availability, currentLocation, verificationStatus } = req.body;

        const driver = await this.driverRepo.findDocumentById(id);
        if (!driver) throw new badRequestException("Driver not found");

        const updatedData: Partial<IDriver> = {};

        if (licenseNumber) {
            const licenseExists = await this.driverRepo.exists({ licenseNumber, _id: { $ne: id } });
            if (licenseExists) throw new conflictException("License number already exists");
            updatedData.licenseNumber = licenseNumber;
        }

        if (typeof availability === "boolean") updatedData.availability = availability;

        if (currentLocation) {
            if (currentLocation.type !== "Point" || !Array.isArray(currentLocation.coordinates) || currentLocation.coordinates.length !== 2) {
                throw new badRequestException("Invalid current location");
            }
            updatedData.currentLocation = currentLocation;
        }

        if (verificationStatus) {

            if (!Object.values(verificationStatusEnum).includes(verificationStatus)) {
                throw new badRequestException("Invalid verification status");
            }
            updatedData.verificationStatus = verificationStatus;
        }

        if (!Object.keys(updatedData).length) throw new badRequestException("No data provided to update");

        await this.driverRepo.findDocumentByIdAndUpdate(
            id,
            {
                $set: updatedData
            },
            {
                new: true
            }
        );

        if (verificationStatus === verificationStatusEnum.APPROVED) {
            await this.userRepo.findDocumentByIdAndUpdate(
                driver.userId,
                {
                    role: roleEnum.DRIVER
                }
            );
        } else if (verificationStatus === verificationStatusEnum.REJECTED) {

            await this.userRepo.findDocumentByIdAndUpdate(
                driver.userId,
                {
                    role: roleEnum.TOURIST
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
        return res.json(successResponse("Driver updated successfully", 200, updatedDriver));
    };

    deleteDriver = async (req: Request, res: Response) => {

        const { id } = req.params as { id: string };

        if (!mongoose.isValidObjectId(id)) throw new badRequestException("Invalid driver id");

        const driver = await this.driverRepo.findDocumentById(id);
        if (!driver) throw new badRequestException("Driver not found");

        await this.userRepo.findDocumentByIdAndUpdate(driver.userId, { role: roleEnum.TOURIST });

        await this.driverRepo.deleteById(id);

        return res.json(successResponse("Driver deleted successfully", 200));
    };

    getDriverById = async (req: Request, res: Response) => {

        const { id } = req.params as { id: string };
        if (!mongoose.isValidObjectId(id)) throw new badRequestException("Invalid driver id");

        const driver = await this.driverRepo.findDocumentById(
            id,
            {},
            {
                populate: {
                    path: "userId",
                    select: "-password"
                }
            }
        );

        if (!driver) throw new badRequestException("Driver not found");
        return res.json(successResponse("Driver fetched successfully", 200, driver));
    };

    getDrivers = async (req: Request, res: Response) => {

        const { page, limit } = req.query;

        const { skip, limit: currentLimit } = pagination({
            page: Number(page),
            limit: Number(limit)
        });

        const drivers = await this.driverRepo.findDocuments(
            {},
            {},
            {
                populate: {
                    path: "userId",
                    select: "-password"
                },
                skip,
                limit: currentLimit,
                sort: { createdAt: -1 }
            }
        );
        return res.json(successResponse("Drivers fetched successfully", 200, drivers));
    };
    searchDrivers = async (req: Request, res: Response) => {

        const { licenseNumber, availability, verificationStatus } = req.body;

        const filter: any = {};
        if (licenseNumber) { filter.licenseNumber = { $regex: licenseNumber, $options: "i" }; }

        if (availability !== undefined) {
            filter.availability = availability === "true";
        }

        if (verificationStatus && !Object.values(verificationStatusEnum).includes(verificationStatus as verificationStatusEnum)) {
            throw new badRequestException("Invalid verification status");
        }

        if (verificationStatus) filter.verificationStatus = verificationStatus;
        const drivers = await this.driverRepo.findDocuments(
            filter,
            {},
            {
                populate: {
                    path: "userId",
                    select: "-password"
                },
                sort: { createdAt: -1 }
            }
        );
        return res.json(successResponse("Drivers fetched successfully", 200, drivers));
    };
}

export default new driverService();