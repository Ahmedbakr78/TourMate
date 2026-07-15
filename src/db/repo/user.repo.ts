import { Model } from "mongoose";
import { IUser } from "../../common/index.js";
import { baseRepository } from "./base.repo.js";

export class userRepository extends baseRepository<IUser> {
    constructor(protected _userModel: Model<IUser>) {
        super(_userModel);
    }
}