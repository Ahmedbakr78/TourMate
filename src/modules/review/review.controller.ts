import { Router } from "express";
import reviewService from "./service/review.service.js";
import { roleEnum } from "../../common/index.js";
import { authentication } from "../../middlewares/authentication.middleware.js";
import { authorization } from "../../middlewares/authorization.middleware.js";

const reviewRouter = Router();

// Create Review
reviewRouter.post("/", authentication, authorization([roleEnum.TOURIST]), reviewService.createReview);

// Get All Reviews
reviewRouter.get("/", reviewService.getReviews);

// Get Review By Id
reviewRouter.get("/:id", reviewService.getReviewById);

// Update Review
reviewRouter.patch("/:id", authentication, authorization([roleEnum.TOURIST]), reviewService.updateReview);

// Delete Review
reviewRouter.delete("/:id", authentication, authorization([roleEnum.TOURIST, roleEnum.ADMIN]), reviewService.deleteReview);

// Get Reviews By Trip
reviewRouter.get("/trip/:tripId", reviewService.getTripReviews);

// Get Reviews By Place
reviewRouter.get("/place/:placeId", reviewService.getPlaceReviews);

export { reviewRouter };