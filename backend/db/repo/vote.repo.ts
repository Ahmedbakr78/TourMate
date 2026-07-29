import { Model } from "mongoose";
import { IVote } from "../../common/index.js";
import { baseRepository } from "./base.repo.js";

export class voteRepository extends baseRepository<IVote> {
    constructor(protected _voteModel: Model<IVote>) {
        super(_voteModel);
    }
}