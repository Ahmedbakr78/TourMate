import { FilterQuery, Model, PaginateOptions } from "mongoose";
import { IReview } from "../../common/index.js";
import { baseRepository } from "./base.repo.js";
import { reviewModel } from "../models/review.model.js";

export class reviewRepository extends baseRepository<IReview> {
    constructor(protected _reviewModel: Model<IReview>) {
        super(_reviewModel);
    }
    async paginateModel(filters?: FilterQuery<IReview>, options?: PaginateOptions) {

        return await reviewModel.paginate(filters, options);
    }
}