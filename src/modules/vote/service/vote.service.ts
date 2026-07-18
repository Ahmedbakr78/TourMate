import { Response } from "express";
import mongoose from "mongoose";
import { IRequest, roleEnum, voteValueEnum } from "../../../common/index.js";
import { voteModel, voteRepository, tripModel, tripRepository, placeModel, placeRepository } from "../../../db/index.js";
import { badRequestException, forbiddenException, successResponse } from "../../../utils/index.js";

const getUser = (req: IRequest) => { if (!req.loggedInUser) throw new badRequestException("User not authenticated"); return req.loggedInUser.user; };

class voteService {

    private voteRepo = new voteRepository(voteModel);
    private tripRepo = new tripRepository(tripModel);
    private placeRepo = new placeRepository(placeModel);

    createVote = async (req: IRequest, res: Response) => {
        const user = getUser(req);
        const { tripId, placeId, voteValue } = req.body;

        if (!tripId || !placeId || !voteValue) throw new badRequestException("tripId, placeId and voteValue are required");
        if (!Object.values(voteValueEnum).includes(voteValue)) throw new badRequestException("voteValue must be like or dislike");
        if (!mongoose.isValidObjectId(tripId) || !mongoose.isValidObjectId(placeId)) throw new badRequestException("Invalid tripId or placeId");

        const trip = await this.tripRepo.findDocumentById(tripId);
        if (!trip) throw new badRequestException("Trip not found");

        const place = await this.placeRepo.findDocumentById(placeId);
        if (!place) throw new badRequestException("Place not found");

        const vote = await this.voteRepo.updateOneDocument(
            { tripId, placeId, userId: user._id },
            { voteValue },
            { upsert: true, new: true }
        );

        return res.status(201).json(successResponse("Vote submitted successfully", 201, vote));
    };

    updateVote = async (req: IRequest, res: Response) => {
        const user = getUser(req);
        const { id } = req.params as { id: string };
        const { voteValue } = req.body;

        if (!mongoose.isValidObjectId(id)) throw new badRequestException("Invalid vote id");
        if (!voteValue || !Object.values(voteValueEnum).includes(voteValue)) throw new badRequestException("voteValue must be like or dislike");

        const vote = await this.voteRepo.findDocumentById(id);
        if (!vote) throw new badRequestException("Vote not found");
        if (vote.userId.toString() !== user._id.toString() && user.role !== roleEnum.ADMIN)
            throw new forbiddenException("You do not have permission to update this vote");

        const updatedVote = await this.voteRepo.findDocumentByIdAndUpdate(id, { voteValue }, { new: true });
        return res.json(successResponse("Vote updated successfully", 200, updatedVote));
    };

    deleteVote = async (req: IRequest, res: Response) => {
        const user = getUser(req);
        const { id } = req.params as { id: string };
        if (!mongoose.isValidObjectId(id)) throw new badRequestException("Invalid vote id");

        const vote = await this.voteRepo.findDocumentById(id);
        if (!vote) throw new badRequestException("Vote not found");
        if (vote.userId.toString() !== user._id.toString() && user.role !== roleEnum.ADMIN)
            throw new forbiddenException("You do not have permission to delete this vote");

        await this.voteRepo.deleteById(id);
        return res.json(successResponse("Vote deleted successfully", 200));
    };

    getPlaceVotes = async (req: IRequest, res: Response) => {
        const { tripId, placeId } = req.params as { tripId: string; placeId: string };
        if (!mongoose.isValidObjectId(tripId) || !mongoose.isValidObjectId(placeId)) throw new badRequestException("Invalid tripId or placeId");

        const votes = await voteModel.find({ tripId, placeId }).populate("userId", "name email profileImage");
        const likeCount = votes.filter(v => v.voteValue === voteValueEnum.LIKE).length;
        const dislikeCount = votes.filter(v => v.voteValue === voteValueEnum.DISLIKE).length;

        return res.json(successResponse("Place votes fetched successfully", 200, { votes, likeCount, dislikeCount, score: likeCount - dislikeCount }));
    };

    getUserVotes = async (req: IRequest, res: Response) => {
        const user = getUser(req);
        const votes = await voteModel.find({ userId: user._id }).populate("tripId").populate("placeId");
        return res.json(successResponse("User votes fetched successfully", 200, votes));
    };

}

export default new voteService();