import { NextFunction, Response } from "express";
import { IRequest, roleEnum } from "../common/index.js";
import { forbiddenException, unauthorizedException } from "../utils/index.js";

export const authorization = (roles: ReadonlyArray<roleEnum>) => {

    return  (req: IRequest, res: Response, next: NextFunction) => {

        if (!req.loggedInUser) {
            throw new unauthorizedException("Please login first");
        }

        const { user } = req.loggedInUser;

        if (!roles.includes(user.role)) {
            throw new forbiddenException("You are not authorized to access this resource");
        }

        next();
    };

};