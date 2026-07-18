import { Request, Response } from "express";
import { IPlace } from "../../../common/index.js";
import {
    placeModel,
    placeRepository
} from "../../../db/index.js";
import {
    badRequestException,
    conflictException,
    pagination,
    successResponse
} from "../../../utils/index.js";

class placeService {

    private placeRepo = new placeRepository(placeModel);

    createPlace = async (req: Request, res: Response) => {

        const {
            osmId,
            name,
            city,
            category,
            description,
            coordinates
        } = req.body;

        const existingPlace = await this.placeRepo.findOneDocument({
            osmId
        });

        if (existingPlace)
            throw new conflictException("Place already exists");

        const place = await this.placeRepo.createNewDocument({
            osmId,
            name,
            city,
            category,
            description,
            coordinates
        } as Partial<IPlace>);

        return res.json(
            successResponse(
                "Place created successfully",
                201,
                place
            )
        );
    };

    getPlaceById = async (req: Request, res: Response) => {

        const { id } = req.params as { id: string };

        const place = await this.placeRepo.findDocumentById(id);

        if (!place)
            throw new badRequestException("Place not found");

        return res.json(
            successResponse(
                "Place fetched successfully",
                200,
                place
            )
        );
    };

    getPlaces = async (req: Request, res: Response) => {

        const { page, limit } = req.query;

        const { skip, limit: currentLimit } = pagination({
            page: Number(page),
            limit: Number(limit)
        });

        const places = await placeModel
            .find()
            .skip(skip)
            .limit(currentLimit);

        return res.json(
            successResponse(
                "Places fetched successfully",
                200,
                places
            )
        );
    };

    updatePlace = async (req: Request, res: Response) => {

        const { id } = req.params as { id: string };

        const {
            name,
            city,
            category,
            description,
            coordinates
        } = req.body;

        const place = await this.placeRepo.findDocumentById(id);

        if (!place)
            throw new badRequestException("Place not found");

        const updatedData: Partial<IPlace> = {};

        if (name)
            updatedData.name = name;

        if (city)
            updatedData.city = city;

        if (category)
            updatedData.category = category;

        if (description)
            updatedData.description = description;

        if (coordinates)
            updatedData.coordinates = coordinates;

        if (!Object.keys(updatedData).length)
            throw new badRequestException("No data provided to update");

        const updatedPlace = await this.placeRepo.findDocumentByIdAndUpdate(
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
                "Place updated successfully",
                200,
                updatedPlace
            )
        );
    };

    deletePlace = async (req: Request, res: Response) => {

        const { id } = req.params as { id: string };

        const place = await this.placeRepo.findDocumentById(id);

        if (!place)
            throw new badRequestException("Place not found");

        await this.placeRepo.deleteById(id);

        return res.json(
            successResponse(
                "Place deleted successfully"
            )
        );
    };

    searchPlaces = async (req: Request, res: Response) => {

        const {
            name,
            city,
            category
        } = req.query;

        const filter: any = {};

        if (name) {
            filter.name = {
                $regex: name,
                $options: "i"
            };
        }

        if (city) {
            filter.city = {
                $regex: city,
                $options: "i"
            };
        }

        if (category) {
            filter.category = category;
        }

        const places = await placeModel.find(filter);

        return res.json(
            successResponse(
                "Places fetched successfully",
                200,
                places
            )
        );
    };

    getNearbyPlaces = async (req: Request, res: Response) => {

        const {
            lng,
            lat,
            radius = 5000
        } = req.query;

        if (!lng || !lat)
            throw new badRequestException("Latitude and longitude are required");

        const places = await placeModel.find({
            coordinates: {
                $near: {
                    $geometry: {
                        type: "Point",
                        coordinates: [
                            Number(lng),
                            Number(lat)
                        ]
                    },
                    $maxDistance: Number(radius)
                }
            }
        });

        return res.json(
            successResponse(
                "Nearby places fetched successfully",
                200,
                places
            )
        );
    };

}

export default new placeService();