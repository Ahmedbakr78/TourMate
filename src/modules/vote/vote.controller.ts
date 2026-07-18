import { Router } from "express";
import voteService from "./service/vote.service.js";
import { authentication } from "../../middlewares/authentication.middleware.js";

const voteRouter = Router();

voteRouter.post("/", authentication, voteService.createVote);
voteRouter.get("/my-votes", authentication, voteService.getUserVotes);
voteRouter.get("/:tripId/:placeId", authentication, voteService.getPlaceVotes);
voteRouter.patch("/:id", authentication, voteService.updateVote);
voteRouter.delete("/:id", authentication, voteService.deleteVote);

export { voteRouter };