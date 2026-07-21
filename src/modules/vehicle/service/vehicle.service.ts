import { Response } from "express";
import fs from "fs/promises";
import { IRequest, IVehicle } from "../../../common/index.js";
import { driverModel, driverRepository, vehicleModel, vehicleRepository } from "../../../db/index.js";
import { badRequestException, conflictException, deleteFileFromCloudinary, pagination, successResponse, uploadFileToCloudinary } from "../../../utils/index.js";

class vehicleService {

    private vehicleRepo = new vehicleRepository(vehicleModel);
    private driverRepo = new driverRepository(driverModel);

    createVehicle = async (req: IRequest, res: Response) => {

        const { brand, vehicleModel, capacity, plateNumber } = req.body;
        const files = req.files as Express.Multer.File[];

        const user = req.loggedInUser?.user;
        if (!user) throw new badRequestException("Unauthorized");
        const driver = await this.driverRepo.findOneDocument({
            userId: user._id
        });

        if (!driver) throw new badRequestException("Driver profile not found");
        const plateExists = await this.vehicleRepo.exists({ plateNumber });
        if (plateExists) throw new conflictException("Plate number already exists");

        const carImages = [];

        if (files?.length) {

            for (const file of files) {

                const uploadResult = await uploadFileToCloudinary(
                    file.path,
                    {
                        folder: "vehicle_images"
                    }
                );

                await fs.unlink(file.path);
                carImages.push({
                    secure_url: uploadResult.secure_url,
                    public_id: uploadResult.public_id
                });
            }
        }

        const vehicle = await this.vehicleRepo.createNewDocument({
            driverId: driver._id,
            brand,
            vehicleModel,
            capacity,
            plateNumber,
            carImages
        } as Partial<IVehicle>);
        return res.status(201).json(successResponse("Vehicle created successfully", 201, vehicle));
    };
    updateVehicle = async (req: IRequest, res: Response) => {

        const { id } = req.params as { id: string };
        const { brand, vehicleModel, capacity, plateNumber } = req.body;
        const files = req.files as Express.Multer.File[];

        const vehicle = await this.vehicleRepo.findDocumentById(id);
        if (!vehicle) throw new badRequestException("Vehicle not found");

        const updatedData: Partial<IVehicle> = {};

        if (brand) updatedData.brand = brand;
        if (vehicleModel) updatedData.vehicleModel = vehicleModel;
        if (capacity) updatedData.capacity = capacity;
        if (plateNumber) {
            const plateExists = await this.vehicleRepo.exists({
                plateNumber,
                _id: { $ne: id }
            });
            if (plateExists) throw new conflictException("Plate number already exists");
            updatedData.plateNumber = plateNumber;
        }
        if (files?.length) {
            if (vehicle.carImages?.length) {
                await Promise.all(
                    vehicle.carImages.map(image =>
                        deleteFileFromCloudinary(image.public_id)
                    )
                );
            }

            const uploadedImages = [];
            for (const file of files) {

                const uploadResult = await uploadFileToCloudinary(
                    file.path,
                    {
                        folder: "vehicle_images"
                    }
                );
                await fs.unlink(file.path);
                uploadedImages.push({
                    secure_url: uploadResult.secure_url,
                    public_id: uploadResult.public_id
                });
            }
            updatedData.carImages = uploadedImages;
        }

        if (!Object.keys(updatedData).length) throw new badRequestException("No data provided to update");
        const updatedVehicle = await this.vehicleRepo.findDocumentByIdAndUpdate(
            id,
            {
                $set: updatedData
            },
            {
                new: true
            }
        );
        return res.json(successResponse("Vehicle updated successfully", 200, updatedVehicle));
    };

    getVehicleById = async (req: IRequest, res: Response) => {

        const { id } = req.params as { id: string };

        const vehicle = await this.vehicleRepo.findDocumentById(
            id,
            {},
            {
                populate: {
                    path: "driverId",
                    populate: {
                        path: "userId",
                        select: "-password"
                    }
                }
            }
        );
        if (!vehicle) throw new badRequestException("Vehicle not found");
        return res.json(successResponse("Vehicle fetched successfully", 200, vehicle));
    };
    getVehicles = async (req: IRequest, res: Response) => {

        const { page, limit } = req.query;

        const vehicles = await this.vehicleRepo.paginateModel(
            {},
            {
                ...pagination({
                    page: Number(page),
                    limit: Number(limit)
                }),
                populate: {
                    path: "driverId",
                    populate: {
                        path: "userId",
                        select: "-password"
                    }
                },
                sort: {
                    createdAt: -1
                }
            }
        );
        return res.json(successResponse("Vehicles fetched successfully", 200, vehicles));
    };

    searchVehicles = async (req: IRequest, res: Response) => {

        const { brand, plateNumber, page, limit } = req.body;

        const filter: any = {};

        if (brand) {
            filter.brand = { $regex: brand, $options: "i" };
        }

        if (plateNumber) {
            filter.plateNumber = {
                $regex: plateNumber,
                $options: "i"
            };
        }

        const vehicles = await this.vehicleRepo.paginateModel(
            filter,
            {
                ...pagination({
                    page: Number(page),
                    limit: Number(limit)
                }),
                populate: {
                    path: "driverId",
                    populate: {
                        path: "userId",
                        select: "-password"
                    }
                },
                sort: {
                    createdAt: -1
                }
            }
        );
        return res.json(successResponse("Vehicles fetched successfully", 200, vehicles));
    };


    deleteVehicle = async (req: IRequest, res: Response) => {

        const { id } = req.params as { id: string };

        const vehicle = await this.vehicleRepo.findDocumentById(id);
        if (!vehicle) throw new badRequestException("Vehicle not found");

        if (vehicle.carImages?.length) {
            await Promise.all(
                vehicle.carImages.map(image =>
                    deleteFileFromCloudinary(image.public_id)
                )
            );
        }

        await this.vehicleRepo.deleteById(id);
        return res.json(successResponse("Vehicle deleted successfully"));
    };

    getDriverVehicles = async (req: IRequest, res: Response) => {

        const { driverId } = req.params as { driverId: string };
        const vehicles = await this.vehicleRepo.findDocuments(
            {
                driverId
            },
            {},
            {
                populate: {
                    path: "driverId",
                    populate: {
                        path: "userId",
                        select: "-password"
                    }
                },
                sort: {
                    createdAt: -1
                }
            }
        );
        return res.json(successResponse("Driver vehicles fetched successfully", 200, vehicles));
    };
}

export default new vehicleService();