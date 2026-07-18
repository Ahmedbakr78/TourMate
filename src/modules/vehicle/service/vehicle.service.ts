import { Response } from "express";
import fs from "fs/promises";
import {
    IRequest,
    IVehicle
} from "../../../common/index.js";
import {
    driverModel,
    driverRepository,
    vehicleModel,
    vehicleRepository
} from "../../../db/index.js";
import {
    badRequestException,
    conflictException,
    deleteFileFromCloudinary,
    pagination,
    successResponse,
    uploadFileToCloudinary
} from "../../../utils/index.js";

class vehicleService {

    private vehicleRepo = new vehicleRepository(vehicleModel);
    private driverRepo = new driverRepository(driverModel);

    createVehicle = async (req: IRequest, res: Response) => {

        const {
            driverId,
            brand,
            vehicleModel: model,
            capacity,
            plateNumber
        } = req.body;

        const driver = await this.driverRepo.findDocumentById(driverId);

        if (!driver)
            throw new badRequestException("Driver not found");

        const plateExists = await this.vehicleRepo.exists({ plateNumber });

        if (plateExists)
            throw new conflictException("Plate number already exists");

        const vehicle = await this.vehicleRepo.createNewDocument({
            driverId,
            brand,
            vehicleModel: model,
            capacity,
            plateNumber,
            carImages: []
        } as Partial<IVehicle>);

        return res.status(201).json(
            successResponse(
                "Vehicle created successfully",
                201,
                vehicle
            )
        );
    };

    getVehicleById = async (req: IRequest, res: Response) => {

        const { id } = req.params as { id: string };

        const vehicle = await this.vehicleRepo.findDocumentById(id);

        if (!vehicle)
            throw new badRequestException("Vehicle not found");

        return res.json(
            successResponse(
                "Vehicle fetched successfully",
                200,
                vehicle
            )
        );
    };

    getVehicles = async (req: IRequest, res: Response) => {

        const { page, limit } = req.query;

        const { skip, limit: currentLimit } = pagination({
            page: Number(page),
            limit: Number(limit)
        });

        const vehicles = await vehicleModel
            .find()
            .skip(skip)
            .limit(currentLimit);

        return res.json(
            successResponse(
                "Vehicles fetched successfully",
                200,
                vehicles
            )
        );
    };

    searchVehicles = async (req: IRequest, res: Response) => {

        const { brand, plateNumber } = req.query;

        const filter: any = {};

        if (brand) {
            filter.brand = { $regex: brand, $options: "i" };
        }

        if (plateNumber) {
            filter.plateNumber = { $regex: plateNumber, $options: "i" };
        }

        const vehicles = await vehicleModel.find(filter);

        return res.json(
            successResponse(
                "Vehicles fetched successfully",
                200,
                vehicles
            )
        );
    };

    updateVehicle = async (req: IRequest, res: Response) => {

        const { id } = req.params as { id: string };

        const {
            brand,
            vehicleModel: model,
            capacity,
            plateNumber
        } = req.body;

        const vehicle = await this.vehicleRepo.findDocumentById(id);

        if (!vehicle)
            throw new badRequestException("Vehicle not found");

        const updatedData: Partial<IVehicle> = {};

        if (brand)
            updatedData.brand = brand;

        if (model)
            updatedData.vehicleModel = model;

        if (capacity)
            updatedData.capacity = capacity;

        if (plateNumber) {

            const plateExists = await this.vehicleRepo.exists({
                plateNumber,
                _id: { $ne: id }
            });

            if (plateExists)
                throw new conflictException("Plate number already exists");

            updatedData.plateNumber = plateNumber;
        }

        if (!Object.keys(updatedData).length)
            throw new badRequestException("No data provided to update");

        const updatedVehicle = await this.vehicleRepo.findDocumentByIdAndUpdate(
            id,
            { $set: updatedData },
            { new: true }
        );

        return res.json(
            successResponse(
                "Vehicle updated successfully",
                200,
                updatedVehicle
            )
        );
    };

    deleteVehicle = async (req: IRequest, res: Response) => {

        const { id } = req.params as { id: string };

        const vehicle = await this.vehicleRepo.findDocumentById(id);

        if (!vehicle)
            throw new badRequestException("Vehicle not found");

        if (vehicle.carImages?.length) {
            await Promise.all(
                vehicle.carImages.map((image) =>
                    deleteFileFromCloudinary(image.public_id)
                )
            );
        }

        await this.vehicleRepo.deleteById(id);

        return res.json(
            successResponse("Vehicle deleted successfully", 200)
        );
    };

    getDriverVehicles = async (req: IRequest, res: Response) => {

        const { driverId } = req.params as { driverId: string };

        const vehicles = await this.vehicleRepo.findDocuments({ driverId });

        return res.json(
            successResponse(
                "Driver vehicles fetched successfully",
                200,
                vehicles
            )
        );
    };

    uploadVehicleImage = async (req: IRequest, res: Response) => {

        const { id } = req.params as { id: string };
        const imagePath = req.file?.path;

        if (!imagePath)
            throw new badRequestException("Vehicle image is required");

        const vehicle = await this.vehicleRepo.findDocumentById(id);

        if (!vehicle)
            throw new badRequestException("Vehicle not found");

        const uploadResult = await uploadFileToCloudinary(
            imagePath,
            {
                folder: "vehicle_images"
            }
        );

        await fs.unlink(imagePath);

        const updatedVehicle = await this.vehicleRepo.findDocumentByIdAndUpdate(
            id,
            {
                $push: {
                    carImages: {
                        secure_url: uploadResult.secure_url,
                        public_id: uploadResult.public_id
                    }
                }
            },
            { new: true }
        );

        return res.status(201).json(
            successResponse(
                "Vehicle image uploaded successfully",
                201,
                updatedVehicle
            )
        );
    };

    deleteVehicleImage = async (req: IRequest, res: Response) => {

        const { id } = req.params as { id: string };
        const { public_id } = req.body;

        if (!public_id)
            throw new badRequestException("public_id is required");

        const vehicle = await this.vehicleRepo.findDocumentById(id);

        if (!vehicle)
            throw new badRequestException("Vehicle not found");

        const imageExists = vehicle.carImages?.some(
            (image) => image.public_id === public_id
        );

        if (!imageExists)
            throw new badRequestException("Image not found on this vehicle");

        await deleteFileFromCloudinary(public_id);

        const updatedVehicle = await this.vehicleRepo.findDocumentByIdAndUpdate(
            id,
            {
                $pull: { carImages: { public_id } }
            },
            { new: true }
        );

        return res.json(
            successResponse(
                "Vehicle image deleted successfully",
                200,
                updatedVehicle
            )
        );
    };

}

export default new vehicleService();