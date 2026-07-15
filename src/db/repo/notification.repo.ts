import { Model } from "mongoose";
import { INotification } from "../../common/index.js";
import { baseRepository } from "./base.repo.js";

export class notificationRepository extends baseRepository<INotification> {
    constructor(protected _notificationModel: Model<INotification>) {
        super(_notificationModel);
    }
}