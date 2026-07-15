import { Model } from "mongoose";
import { ITrip } from "../../common/index.js";
import { baseRepository } from "./base.repo.js";

export class tripRepository extends baseRepository<ITrip> {
    constructor(protected _tripModel: Model<ITrip>) {
        super(_tripModel);
    }
}