import { FilterQuery, Model, PaginateOptions } from "mongoose";
import { IPlace } from "../../common/index.js";
import { baseRepository } from "./base.repo.js";
import { placeModel } from "../models/place.model.js";

export class placeRepository extends baseRepository<IPlace> {
    constructor(protected _placeModel: Model<IPlace>) {
        super(_placeModel);
    }
    async paginateModel(filters?: FilterQuery<IPlace>, options?: PaginateOptions) {

        return await placeModel.paginate(filters, options);
    }
}