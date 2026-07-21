import { FilterQuery, Model, PaginateOptions } from "mongoose";
import { IGuide } from "../../common/index.js";
import { baseRepository } from "./base.repo.js";
import { guideModel } from "../models/guide.model.js";

export class guideRepository extends baseRepository<IGuide> {
    constructor(protected _guideModel: Model<IGuide>) {
        super(_guideModel);
    }
    async paginateModel(filters?: FilterQuery<IGuide>, options?: PaginateOptions) {

        return await guideModel.paginate(filters, options);
    }
}