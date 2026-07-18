import { FilterQuery, PaginateModel, PaginateOptions, PaginateResult } from "mongoose";
import { IUser } from "../../common/index.js";
import { baseRepository } from "./base.repo.js";
import { userModel } from "../models/user.model.js";

export class userRepository extends baseRepository<IUser> {

    constructor(protected _userModel: PaginateModel<IUser>) {
        super(_userModel);
    }
    async paginateModel(filters?: FilterQuery<IUser>, options?: PaginateOptions) {

        return await userModel.paginate(filters, options);
    }

}