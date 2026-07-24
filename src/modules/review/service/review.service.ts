import { Request, Response } from "express";
import { IRequest, IReview, roleEnum, tripStatusEnum } from "../../../common/index.js";
import { reviewModel, reviewRepository, tripModel, tripRepository, placeModel, placeRepository } from "../../../db/index.js";
import { badRequestException, pagination, successResponse } from "../../../utils/index.js";
import mongoose from "mongoose";

class reviewService {

    private reviewRepo = new reviewRepository(reviewModel);
    private tripRepo = new tripRepository(tripModel);
    private placeRepo = new placeRepository(placeModel);

    createReview = async (req: IRequest, res: Response) => {

        if (!req.loggedInUser) throw new badRequestException("User not authenticated");

        const touristId = req.loggedInUser.user._id;

        const { tripId, placeId, guideId, driverId, rating, comment } = req.body;
        if (!tripId) throw new badRequestException("Trip id is required");

        if (rating === undefined || rating < 1 || rating > 5)
            throw new badRequestException("Rating must be between 1 and 5");

        const trip = await this.tripRepo.findDocumentById(tripId);
        if (!trip) throw new badRequestException("Trip not found");

        if (trip.touristId.toString() !== touristId.toString())
            throw new badRequestException("You can review only your trips");

        if (trip.status !== tripStatusEnum.COMPLETED)
            throw new badRequestException("Trip must be completed before reviewing");

        if (placeId) {

            const place = await this.placeRepo.findDocumentById(placeId);
            if (!place) throw new badRequestException("Place not found");
            const placeExists = trip.places.some(
                place => place.toString() === placeId
            );
            if (!placeExists) throw new badRequestException("This place does not belong to this trip");
        }

        if (guideId) {

            if (!trip.guideId || trip.guideId.toString() !== guideId) {
                throw new badRequestException("Guide does not belong to this trip");
            }
        }

        if (driverId) {

            if (!trip.driverId || trip.driverId.toString() !== driverId) {
                throw new badRequestException("Driver does not belong to this trip");
            }
        }

        const existingReview = await this.reviewRepo.findOneDocument({
            touristId,
            tripId,
            placeId,
            guideId,
            driverId
        });
        if (existingReview) throw new badRequestException("You already reviewed this item");
        const review = await this.reviewRepo.createNewDocument({

            touristId,
            tripId,
            placeId,
            guideId,
            driverId,
            rating,
            comment
        } as Partial<IReview>);

        if (placeId) {
            const reviews = await this.reviewRepo.findDocuments({
                placeId
            });

            const averageRating = reviews.reduce((sum, review) =>
                sum + review.rating, 0) / reviews.length;

            await this.placeRepo.findDocumentByIdAndUpdate(
                placeId,
                {
                    averageRating,
                    reviewsCount: reviews.length
                }
            );
        }
        return res.json(successResponse("Review created successfully", 201, review));
    };
    getReviews = async (req: Request, res: Response) => {

        const { page, limit } = req.query;
        const paginateResult = await this.reviewRepo.paginateModel(
            {},
            {
                ...pagination({
                    page: Number(page),
                    limit: Number(limit)
                }),
                populate: [
                    {
                        path: "touristId",
                        select: "-password"
                    },
                    {
                        path: "tripId"
                    },
                    {
                        path: "placeId",
                        select: "name city averageRating"
                    },
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
                    }
                ],
                sort: {
                    createdAt: -1
                }
            }
        );
        return res.json(successResponse("Reviews fetched successfully", 200, paginateResult));
    };
    getReviewById = async (req: Request, res: Response) => {

        const { id } = req.params as { id: string };
        const review = await this.reviewRepo.findDocumentById(
            id,
            {},
            {
                populate: [
                    {
                        path: "touristId",
                        select: "-password"
                    },
                    {
                        path: "tripId"
                    },
                    {
                        path: "placeId",
                        select: "name city averageRating"
                    },
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
                    }
                ]
            }
        );
        if (!review) throw new badRequestException("Review not found");
        return res.json(successResponse("Review fetched successfully", 200, review));
    };

    updateReview = async (req: IRequest, res: Response) => {

        const { id } = req.params as { id: string };
        const { rating, comment } = req.body;

        const review = await this.reviewRepo.findDocumentById(id);
        if (!review) throw new badRequestException("Review not found");

        if (review.touristId.toString() !== req.loggedInUser!.user._id.toString() && req.loggedInUser!.user.role !== roleEnum.ADMIN) {
            throw new badRequestException("Unauthorized");
        }

        const updatedData: Partial<IReview> = {};
        if (rating !== undefined) {

            if (rating < 1 || rating > 5)
                throw new badRequestException("Rating must be between 1 and 5");
            updatedData.rating = rating;
        }

        if (comment) updatedData.comment = comment;

        if (!Object.keys(updatedData).length)
            throw new badRequestException("No data provided");

        const updatedReview = await this.reviewRepo.findDocumentByIdAndUpdate(
            id,
            {
                $set: updatedData
            },
            {
                new: true
            }
        );
        return res.json(successResponse("Review updated successfully", 200, updatedReview));
    };

    deleteReview = async (req: IRequest, res: Response) => {

        if (!req.loggedInUser) throw new badRequestException("User not authenticated");

        const user = req.loggedInUser.user;

        const { id } = req.params as { id: string };
        if (!mongoose.isValidObjectId(id))
            throw new badRequestException("Invalid review id");

        const review = await this.reviewRepo.findDocumentById(id);
        if (!review) throw new badRequestException("Review not found");
        if (review.touristId.toString() !== user._id.toString() && user.role !== roleEnum.ADMIN) {
            throw new badRequestException("Unauthorized");
        }

        await this.reviewRepo.deleteById(id);
        if (review.placeId) {

            const reviews = await this.reviewRepo.findDocuments({
                placeId: review.placeId
            });

            const averageRating = reviews.length > 0 ? reviews.reduce((sum, review) =>
                sum + review.rating, 0) / reviews.length : 0;

            await this.placeRepo.findDocumentByIdAndUpdate(
                review.placeId.toString(),
                {
                    averageRating,
                    reviewsCount: reviews.length
                }
            );
        }
        return res.json(successResponse("Review deleted successfully", 200));
    };
    getTripReviews = async (req: Request, res: Response) => {

        const { tripId } = req.params as { tripId: string };

        if (!mongoose.isValidObjectId(tripId))
            throw new badRequestException("Invalid trip id");

        const trip = await this.tripRepo.findDocumentById(tripId);
        if (!trip) throw new badRequestException("Trip not found");

        const reviews = await this.reviewRepo.findDocuments(
            {
                tripId
            },
            {},
            {
                populate: [
                    {
                        path: "touristId",
                        select: "name profileImage"
                    },
                    {
                        path: "placeId",
                        select: "name city"
                    },
                    {
                        path: "guideId",
                        populate: {
                            path: "userId",
                            select: "name"
                        }
                    },
                    {
                        path: "driverId",
                        populate: {
                            path: "userId",
                            select: "name"
                        }
                    }
                ],
                sort: {
                    createdAt: -1
                }
            }
        );
        return res.json(successResponse("Trip reviews fetched successfully", 200, reviews));
    };
    getPlaceReviews = async (req: Request, res: Response) => {

        const { placeId } = req.params as { placeId: string };
        if (!mongoose.isValidObjectId(placeId))
            throw new badRequestException("Invalid place id");

        const place = await this.placeRepo.findDocumentById(placeId);
        if (!place) throw new badRequestException("Place not found");

        const reviews = await this.reviewRepo.findDocuments(
            {
                placeId
            },
            {},
            {
                populate: [
                    {
                        path: "touristId",
                        select: "name profileImage"
                    },
                    {
                        path: "tripId"
                    }
                ],
                sort: {
                    createdAt: -1
                }
            }
        );
        return res.json(successResponse("Place reviews fetched successfully", 200, { averageRating: place.averageRating, reviewsCount: place.reviewsCount, reviews }));
    };
}

export default new reviewService();