import { Request, Response } from "express";
import mongoose from "mongoose";
import { IPlace, IRequest } from "../../../common/index.js";
import { placeModel, placeRepository, userModel, userRepository } from "../../../db/index.js";
import { badRequestException, conflictException, pagination, successResponse } from "../../../utils/index.js";

class placeService {

    private placeRepo = new placeRepository(placeModel);
    private userRepo = new userRepository(userModel);

    createPlace = async (req: Request, res: Response) => {

        const { osmId, name, city, category, description, coordinates, price } = req.body;

        const existingPlace = await this.placeRepo.findOneDocument({ osmId });
        if (existingPlace) throw new conflictException("Place already exists");
        if (price < 0) throw new badRequestException("Invalid price");

        if (
            !coordinates ||
            coordinates.type !== "Point" ||
            !Array.isArray(coordinates.coordinates) ||
            coordinates.coordinates.length !== 2
        ) {
            throw new badRequestException("Invalid coordinates");
        }

        const place = await this.placeRepo.createNewDocument({
            osmId,
            name,
            city,
            category,
            description,
            coordinates,
            price
        } as Partial<IPlace>);

        return res.json(successResponse("Place created successfully", 201, place));
    };

    getPlaceById = async (req: Request, res: Response) => {

        const { id } = req.params as { id: string };
        const place = await this.placeRepo.findDocumentById(id);
        if (!place) throw new badRequestException("Place not found");
        return res.json(successResponse("Place fetched successfully", 200, place));
    };

    getPlaces = async (req: Request, res: Response) => {

        const { page, limit } = req.query;
        const paginateResult = await this.placeRepo.paginateModel(
            {},
            {
                ...pagination({
                    page: Number(page),
                    limit: Number(limit)
                }),
                sort: {
                    createdAt: -1
                }
            }
        );

        return res.json(successResponse("Places fetched successfully", 200, paginateResult));
    };

    updatePlace = async (req: Request, res: Response) => {

        const { id } = req.params as { id: string };

        const { name, city, category, description, price, coordinates } = req.body;

        const place = await this.placeRepo.findDocumentById(id);
        if (!place) throw new badRequestException("Place not found");

        const updatedData: Partial<IPlace> = {};

        if (name) updatedData.name = name;
        if (city) updatedData.city = city;
        if (category) updatedData.category = category;
        if (description) updatedData.description = description;
        if (price !== undefined) {
            if (price < 0) throw new badRequestException("Invalid price");
            updatedData.price = price;
        }
        if (coordinates) {
            if (
                coordinates.type !== "Point" ||
                !Array.isArray(coordinates.coordinates) ||
                coordinates.coordinates.length !== 2
            ) {
                throw new badRequestException("Invalid coordinates");
            }
            updatedData.coordinates = coordinates;
        }

        if (!Object.keys(updatedData).length) throw new badRequestException("No data provided to update");
        const updatedPlace = await this.placeRepo.findDocumentByIdAndUpdate(
            id,
            {
                $set: updatedData
            },
            {
                new: true
            }
        );

        return res.json(successResponse("Place updated successfully", 200, updatedPlace));
    };
    deletePlace = async (req: Request, res: Response) => {

        const { id } = req.params as { id: string };
        const place = await this.placeRepo.findDocumentById(id);
        if (!place) throw new badRequestException("Place not found");
        await this.placeRepo.deleteById(id);
        return res.json(successResponse("Place deleted successfully", 200));
    };

    searchPlaces = async (req: Request, res: Response) => {

        const { name, city, category, price, page, limit } = req.query;

        const filter: any = {};

        if (name) {
            filter.name = { $regex: name, $options: "i" };
        }

        if (city) {
            filter.city = { $regex: city, $options: "i" };
        }

        if (category) filter.category = category;
        if (price) filter.price = Number(price);

        const paginateResult = await this.placeRepo.paginateModel(
            filter,
            {
                ...pagination({
                    page: Number(page),
                    limit: Number(limit)
                }),
                sort: {
                    createdAt: -1
                }
            }
        );
        return res.json(successResponse("Places fetched successfully", 200, paginateResult));
    };

    getNearbyPlaces = async (req: Request, res: Response) => {

        const { lng, lat, radius = 5000 } = req.query;
        if (!lng || !lat) throw new badRequestException("Latitude and longitude are required");

        const places = await this.placeRepo.findDocuments(
            {
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
            }
        );
        return res.json(successResponse("Nearby places fetched successfully", 200, places));
    };
    getPopularPlaces = async (req: Request, res: Response) => {
        const places = await this.placeRepo.findDocuments(
            {},
            {},
            { sort: { averageRating: -1 }, limit: 10 }
        );
        return res.json(successResponse("Popular places fetched successfully", 200, places));
    };
    filterPlaces = async (req: Request, res: Response) => {
        const { name, city, category, minPrice, maxPrice, page, limit } = req.query;
        const filter: any = {};
        if (name) filter.name = { $regex: name, $options: "i" };
        if (city) filter.city = { $regex: city, $options: "i" };
        if (category) filter.category = category;
        if (minPrice || maxPrice) {
            filter.price = {};
            if (minPrice) filter.price.$gte = Number(minPrice);
            if (maxPrice) filter.price.$lte = Number(maxPrice);
        }
        const paginateResult = await this.placeRepo.paginateModel(
            filter,
            {
                ...pagination({ page: Number(page), limit: Number(limit) }),
                sort: { createdAt: -1 }
            }
        );
        return res.json(successResponse("Places filtered successfully", 200, paginateResult));
    };
    savePlace = async (req: IRequest, res: Response) => {
        const user = req.loggedInUser!.user;
        const { id } = req.params as { id: string };
        if (!mongoose.isValidObjectId(id)) throw new badRequestException("Invalid place id");
        const place = await this.placeRepo.findDocumentById(id);
        if (!place) throw new badRequestException("Place not found");
        const currentUser = await this.userRepo.findDocumentById(user._id);
        if (!currentUser) throw new badRequestException("User not found");
        if (currentUser.savedPlaces?.some(p => p.toString() === id)) {
            throw new badRequestException("Place already saved");
        }
        await this.userRepo.findDocumentByIdAndUpdate(
            user._id,
            { $push: { savedPlaces: id } }
        );
        return res.json(successResponse("Place saved successfully", 200));
    };
    unsavePlace = async (req: IRequest, res: Response) => {
        const user = req.loggedInUser!.user;
        const { id } = req.params as { id: string };
        if (!mongoose.isValidObjectId(id)) throw new badRequestException("Invalid place id");
        await this.userRepo.findDocumentByIdAndUpdate(
            user._id,
            { $pull: { savedPlaces: id } }
        );
        return res.json(successResponse("Place unsaved successfully", 200));
    };
}
export default new placeService();