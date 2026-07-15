import { Model } from "mongoose";
import { IDriver } from "../../common/index.js";
import { baseRepository } from "./base.repo.js";

export class driverRepository extends baseRepository<IDriver> {
    constructor(protected _driverModel: Model<IDriver>) {
        super(_driverModel);
    }
}