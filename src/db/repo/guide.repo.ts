import { Model } from "mongoose";
import { IGuide } from "../../common/index.js";
import { baseRepository } from "./base.repo.js";

export class guideRepository extends baseRepository<IGuide> {
    constructor(protected _guideModel: Model<IGuide>) {
        super(_guideModel);
    }
}