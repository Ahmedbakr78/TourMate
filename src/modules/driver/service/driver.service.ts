import { Request, Response } from "express";
import {
    IDriver,
    roleEnum,
    verificationStatusEnum
} from "../../../common/index.js";
import {
    driverModel,
    driverRepository,
    userModel,
    userRepository
} from "../../../db/index.js";
import {
    badRequestException,
    conflictException,
    pagination,
    successResponse
} from "../../../utils/index.js";

class driverService {

    private driverRepo = new driverRepository(driverModel);
    private userRepo = new userRepository(userModel);

    createDriver = async (req: Request, res: Response) => {

        const { userId, licenseNumber, currentLocation } = req.body;

        const user = await this.userRepo.findDocumentById(userId);
        if (!user) throw new badRequestException("User not found");

        const existingDriver = await this.driverRepo.findOneDocument({ userId });
        if (existingDriver) throw new conflictException("Driver already exists");

        const licenseExists = await this.driverRepo.exists({ licenseNumber });
        if (licenseExists) throw new conflictException("License number already exists");

        await this.userRepo.findDocumentByIdAndUpdate(userId, {
            role: roleEnum.DRIVER
        });

        const driver = await this.driverRepo.createNewDocument({
            userId,
            licenseNumber,
            currentLocation,
            availability: true,
            rating: 0,
            verificationStatus: verificationStatusEnum.PENDING
        } as Partial<IDriver>);

        return res.json(
            successResponse("Driver created successfully", 201, driver)
        );
    };

    updateDriver = async (req: Request, res: Response) => {

        const { id } = req.params as { id: string };

        const {
            licenseNumber,
            availability,
            currentLocation,
            verificationStatus
        } = req.body;

        const driver = await this.driverRepo.findDocumentById(id);

        if (!driver)
            throw new badRequestException("Driver not found");

        const updatedData: Partial<IDriver> = {};

        if (licenseNumber) {

            const licenseExists = await this.driverRepo.exists({
                licenseNumber,
                _id: { $ne: id }
            });

            if (licenseExists)
                throw new conflictException("License number already exists");

            updatedData.licenseNumber = licenseNumber;
        }

        if (typeof availability === "boolean")
            updatedData.availability = availability;

        if (currentLocation)
            updatedData.currentLocation = currentLocation;

        if (verificationStatus)
            updatedData.verificationStatus = verificationStatus;

        if (!Object.keys(updatedData).length)
            throw new badRequestException("No data provided to update");

        const updatedDriver = await this.driverRepo.findDocumentByIdAndUpdate(
            id,
            { $set: updatedData },
            { new: true }
        );

        return res.json(
            successResponse("Driver updated successfully", 200, updatedDriver)
        );
    };

    deleteDriver = async (req: Request, res: Response) => {

        const { id } = req.params as { id: string };

        const driver = await this.driverRepo.findDocumentById(id);

        if (!driver)
            throw new badRequestException("Driver not found");

        await this.userRepo.findDocumentByIdAndUpdate(driver.userId, {
            role: roleEnum.TOURIST
        });

        await this.driverRepo.deleteById(id);

        return res.json(
            successResponse("Driver deleted successfully")
        );
    };

    getDriverById = async (req: Request, res: Response) => {

        const { id } = req.params as { id: string };

        const driver = await driverModel
            .findById(id)
            .populate("userId", "-password");

        if (!driver)
            throw new badRequestException("Driver not found");

        return res.json(
            successResponse("Driver fetched successfully", 200, driver)
        );
    };

    getDrivers = async (req: Request, res: Response) => {

        const { page, limit } = req.query;

        const { skip, limit: currentLimit } = pagination({
            page: Number(page),
            limit: Number(limit)
        });

        const drivers = await driverModel
            .find()
            .populate("userId", "-password")
            .skip(skip)
            .limit(currentLimit);

        return res.json(
            successResponse("Drivers fetched successfully", 200, drivers)
        );
    };

    searchDrivers = async (req: Request, res: Response) => {

        const {
            licenseNumber,
            availability,
            verificationStatus
        } = req.query;

        const filter: any = {};

        if (licenseNumber) {
            filter.licenseNumber = {
                $regex: licenseNumber,
                $options: "i"
            };
        }

        if (availability !== undefined) {
            filter.availability = availability === "true";
        }

        if (verificationStatus) {
            filter.verificationStatus = verificationStatus;
        }

        const drivers = await driverModel
            .find(filter)
            .populate("userId", "-password");

        return res.json(
            successResponse("Drivers fetched successfully", 200, drivers)
        );
    };

}

export default new driverService();