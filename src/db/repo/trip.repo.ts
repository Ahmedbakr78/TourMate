import { FilterQuery, Model, PaginateOptions } from "mongoose";
import { ITrip } from "../../common/index.js";
import { baseRepository } from "./base.repo.js";
import { tripModel } from "../models/trip.model.js";

export class tripRepository extends baseRepository<ITrip> {
    constructor(protected _tripModel: Model<ITrip>) {
        super(_tripModel);
    }
    async paginateModel(filters?: FilterQuery<ITrip>, options?: PaginateOptions) {

        return await tripModel.paginate(filters, options);
    }
}