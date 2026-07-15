import { Model } from "mongoose";
import { IPlace } from "../../common/index.js";
import { baseRepository } from "./base.repo.js";

export class placeRepository extends baseRepository<IPlace> {
    constructor(protected _placeModel: Model<IPlace>) {
        super(_placeModel);
    }
}