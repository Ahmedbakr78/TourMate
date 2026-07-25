import { FilterQuery, Model, PaginateOptions } from "mongoose";
import { IGuide, INotification } from "../../common/index.js";
import { baseRepository } from "./base.repo.js";
import { notificationModel } from "../models/notification.model.js";

export class notificationRepository extends baseRepository<INotification> {
    constructor(protected _notificationModel: Model<INotification>) {
        super(_notificationModel);
    }
    async paginateModel(filters?: FilterQuery<IGuide>, options?: PaginateOptions) {

        return await notificationModel.paginate(filters, options);
    }
}