import { Model } from "mongoose";
import { ILostItem } from "../../common/index.js";
import { baseRepository } from "./base.repo.js";

export class lostItemRepository extends baseRepository<ILostItem> {
    constructor(protected _lostItemModel: Model<ILostItem>) {
        super(_lostItemModel);
    }
}