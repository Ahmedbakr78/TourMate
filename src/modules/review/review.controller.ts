import { Router } from "express";
import reviewService from "./service/review.service.js";
import { roleEnum } from "../../common/index.js";
import { authentication } from "../../middlewares/authentication.middleware.js";
import { authorization } from "../../middlewares/authorization.middleware.js";

const reviewRouter = Router();

// Create review
reviewRouter.post("/create_review", authentication, authorization([roleEnum.ADMIN, roleEnum.TOURIST]), reviewService.createReview);

// Get reviews
reviewRouter.get("/all", authentication, authorization([roleEnum.ADMIN, roleEnum.TOURIST]), reviewService.getReviews);

// Get review by id
reviewRouter.get("/get/:id", authentication, authorization([roleEnum.ADMIN, roleEnum.TOURIST]), reviewService.getReviewById);

// Update review
reviewRouter.patch("/:id/update", authentication, authorization([roleEnum.ADMIN, roleEnum.TOURIST]), reviewService.updateReview);

// Delete review
reviewRouter.delete("/:id/delete", authentication, authorization([roleEnum.ADMIN, roleEnum.TOURIST]), reviewService.deleteReview);

// Get trip reviews
reviewRouter.get("/:tripId/reviews", authentication, authorization([roleEnum.ADMIN, roleEnum.TOURIST]), reviewService.getTripReviews);

// Get place reviews
reviewRouter.get("/:placeId/place_reviews", authentication, authorization([roleEnum.ADMIN, roleEnum.TOURIST]), reviewService.getPlaceReviews);

export { reviewRouter };