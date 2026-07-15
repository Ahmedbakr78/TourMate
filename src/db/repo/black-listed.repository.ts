import { Model } from "mongoose";
import { IBlackListedTokens } from "../../common/index.js";
import { baseRepository } from "./base.repo.js";

export class blackListedTokensRepository extends baseRepository<IBlackListedTokens> {
    constructor(protected _blackListedTokensModel: Model<IBlackListedTokens>) {
        super(_blackListedTokensModel);
    }
}