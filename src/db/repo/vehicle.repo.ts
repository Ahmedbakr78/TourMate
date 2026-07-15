import { Model } from "mongoose";
import { IVehicle } from "../../common/index.js";
import { baseRepository } from "./base.repo.js";

export class vehicleRepository extends baseRepository<IVehicle> {
    constructor(protected _vehicleModel: Model<IVehicle>) {
        super(_vehicleModel);
    }
}