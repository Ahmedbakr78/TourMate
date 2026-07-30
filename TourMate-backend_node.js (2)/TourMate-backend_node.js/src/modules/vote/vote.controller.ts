import { Router } from "express";
import voteService from "./service/vote.service.js";
import { authentication } from "../../middlewares/authentication.middleware.js";

const voteRouter = Router();

// Create vote
voteRouter.post("/create_vote", authentication, voteService.createVote);

// Update vote
voteRouter.patch("/:id/update", authentication, voteService.updateVote);

// Delete vote
voteRouter.delete("/:id/delete", authentication, voteService.deleteVote);

// Get place votes
voteRouter.get("/:tripId/place/:placeId", authentication, voteService.getPlaceVotes);

// Get user votes
voteRouter.get("/user", authentication, voteService.getUserVotes);


export { voteRouter };