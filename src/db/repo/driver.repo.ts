import { FilterQuery, Model, PaginateOptions } from "mongoose";
import { IDriver } from "../../common/index.js";
import { baseRepository } from "./base.repo.js";
import { driverModel } from "../models/driver.model.js";

export class driverRepository extends baseRepository<IDriver> {
    constructor(protected _driverModel: Model<IDriver>) {
        super(_driverModel);
    }
    async paginateModel(filters?: FilterQuery<IDriver>, options?: PaginateOptions) {

        return await driverModel.paginate(filters, options);
    }
}