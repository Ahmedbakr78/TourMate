import { FilterQuery, Model, PaginateOptions } from "mongoose";
import { IVehicle } from "../../common/index.js";
import { baseRepository } from "./base.repo.js";
import { vehicleModel } from "../models/vehicle.model.js";

export class vehicleRepository extends baseRepository<IVehicle> {
    constructor(protected _vehicleModel: Model<IVehicle>) {
        super(_vehicleModel);
    }
    async paginateModel(filters?: FilterQuery<IVehicle>, options?: PaginateOptions) {

        return await vehicleModel.paginate(filters, options);
    }
}