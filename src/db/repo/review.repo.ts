import { Model } from "mongoose";
import { IReview } from "../../common/index.js";
import { baseRepository } from "./base.repo.js";

export class reviewRepository extends baseRepository<IReview> {
    constructor(protected _reviewModel: Model<IReview>) {
        super(_reviewModel);
    }
}