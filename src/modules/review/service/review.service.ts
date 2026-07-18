import { Request, Response } from "express";
import { IRequest, IReview, roleEnum } from "../../../common/index.js";
import {
    reviewModel,
    reviewRepository,
    tripModel,
    tripRepository,
    placeModel,
    placeRepository
} from "../../../db/index.js";
import {
    badRequestException,
    successResponse
} from "../../../utils/index.js";

class reviewService {

    private reviewRepo = new reviewRepository(reviewModel);
    private tripRepo = new tripRepository(tripModel);
    private placeRepo = new placeRepository(placeModel);

    createReview = async (req: IRequest, res: Response) => {

        const {
            tripId,
            placeId,
            driverId,
            guideId,
            rating,
            comment
        } = req.body;

        const touristId = req.loggedInUser!.user._id;

        if (!tripId)
            throw new badRequestException("Trip id is required");

        if (rating < 1 || rating > 5)
            throw new badRequestException("Rating must be between 1 and 5");

        const trip = await this.tripRepo.findDocumentById(tripId);

        if (!trip)
            throw new badRequestException("Trip not found");

        if (placeId) {
            const place = await this.placeRepo.findDocumentById(placeId);

            if (!place)
                throw new badRequestException("Place not found");
        }

        const review = await this.reviewRepo.createNewDocument({
            tripId,
            touristId,
            placeId,
            driverId,
            guideId,
            rating,
            comment
        } as Partial<IReview>);

        return res.json(
            successResponse("Review created successfully", 201, review)
        );
    };

    getReviews = async (req: Request, res: Response) => {

        const reviews = await reviewModel
            .find()
            .populate("touristId", "-password")
            .populate("tripId")
            .populate("placeId")
            .populate("driverId")
            .populate("guideId");

        return res.json(
            successResponse("Reviews fetched successfully", 200, reviews)
        );
    };

    getReviewById = async (req: Request, res: Response) => {

        const { id } = req.params;

        const review = await reviewModel
            .findById(id)
            .populate("touristId", "-password")
            .populate("tripId")
            .populate("placeId")
            .populate("driverId")
            .populate("guideId");

        if (!review)
            throw new badRequestException("Review not found");

        return res.json(
            successResponse("Review fetched successfully", 200, review)
        );
    };

    updateReview = async (req: IRequest, res: Response) => {

        const { id } = req.params as { id: string };

        const {
            rating,
            comment
        } = req.body;

        const review = await this.reviewRepo.findDocumentById(id);

        if (!review)
            throw new badRequestException("Review not found");

        if (
            review.touristId.toString() !== req.loggedInUser!.user._id.toString() &&
            req.loggedInUser!.user.role !== roleEnum.ADMIN
        ) {
            throw new badRequestException("Unauthorized");
        }

        const updatedData: Partial<IReview> = {};

        if (rating !== undefined) {

            if (rating < 1 || rating > 5)
                throw new badRequestException("Rating must be between 1 and 5");

            updatedData.rating = rating;
        }

        if (comment)
            updatedData.comment = comment;

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

        return res.json(
            successResponse("Review updated successfully", 200, updatedReview)
        );
    };

    deleteReview = async (req: IRequest, res: Response) => {

        const { id } = req.params as { id: string };

        const review = await this.reviewRepo.findDocumentById(id);

        if (!review)
            throw new badRequestException("Review not found");

        if (
            review.touristId.toString() !== req.loggedInUser!.user._id.toString() &&
            req.loggedInUser!.user.role !== roleEnum.ADMIN
        ) {
            throw new badRequestException("Unauthorized");
        }

        await this.reviewRepo.deleteById(id);

        return res.json(
            successResponse("Review deleted successfully")
        );
    };

    getTripReviews = async (req: Request, res: Response) => {

        const { tripId } = req.params;

        const reviews = await reviewModel
            .find({ tripId })
            .populate("touristId", "-password")
            .populate("placeId")
            .populate("driverId")
            .populate("guideId");

        return res.json(
            successResponse("Trip reviews fetched successfully", 200, reviews)
        );
    };

    getPlaceReviews = async (req: Request, res: Response) => {

        const { placeId } = req.params;

        const reviews = await reviewModel
            .find({ placeId })
            .populate("touristId", "-password")
            .populate("tripId");

        return res.json(
            successResponse("Place reviews fetched successfully", 200, reviews)
        );
    };

}

export default new reviewService();