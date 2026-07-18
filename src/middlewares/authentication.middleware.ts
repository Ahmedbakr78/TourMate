import { NextFunction, Response } from "express";
import { IRequest, statusUserEnum } from "../common/index.js";
import { unauthorizedException, verifyToken } from "../utils/index.js";

import { blackListedTokensModel, blackListedTokensRepository, userModel, userRepository } from "../db/index.js";

const userRepo = new userRepository(userModel);

const blackListedRepo = new blackListedTokensRepository(blackListedTokensModel);

export const authentication = async (req: IRequest, res: Response, next: NextFunction) => {

    const accessToken = req.headers.authorization;

    if (!accessToken) throw new unauthorizedException("Please login first");

    const [prefix, token] = accessToken.split(" ");

    if (!token || prefix !== process.env.JWT_PREFIX) {
        throw new unauthorizedException("Invalid token");
    }

    const decodedData = verifyToken(token, process.env.JWT_ACCESS_SECRET as string);
    if (!decodedData?._id) {
        throw new unauthorizedException("Invalid payload");
    }

    const blackListedToken = await blackListedRepo.findOneDocument({
        tokenId: decodedData.jti
    });

    if (blackListedToken) {
        throw new unauthorizedException("Token is blacklisted");
    }

    const user = await userRepo.findOneDocument(
        {
            _id: decodedData._id
        },
        "-password"
    );

    if (!user) {
        throw new unauthorizedException("User not found");
    }
    if (user.status !== statusUserEnum.ACTIVE) {
        throw new unauthorizedException("Your account is blocked");
    }
    if (!user.isVerified) {
        throw new unauthorizedException("Please verify your account first");
    }

    req.loggedInUser = { user, tokenData: decodedData };

    next();
};