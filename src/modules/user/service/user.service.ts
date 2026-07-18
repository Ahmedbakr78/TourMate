import { Request, Response } from "express";
import fs from "fs/promises";
import { IRequest, IUser } from "../../../common/index.js";
import { blackListedTokensModel, blackListedTokensRepository, userModel, userRepository } from "../../../db/index.js";
import { badRequestException, conflictException, deleteFileFromCloudinary, encrypt, pagination, successResponse, uploadFileToCloudinary, } from "../../../utils/index.js";


class userService {
    private userRepo: userRepository = new userRepository(userModel);
    private blacklistedTokenRepo: blackListedTokensRepository = new blackListedTokensRepository(blackListedTokensModel);

    getUserById = async (req: Request, res: Response) => {
        const { id } = req.params as { id: string };
        const user = await this.userRepo.findDocumentById(id);
        if (!user) throw new badRequestException("User not found");
        return res.json(successResponse("User fetched successfully", 200, user));
    }
    getCurrentUserId = async (req: IRequest, res: Response) => {
        const { id } = req.loggedInUser!.user;
        const user = await this.userRepo.findDocumentById(id);
        if (!user) throw new badRequestException("User not found");
        return res.json(successResponse("User fetched successfully", 200, user));
    }
    getUsers = async (req: IRequest, res: Response) => {
        const { page, limit } = req.query;
        const paginateResult = await this.userRepo.paginateModel(
            {},
            pagination({ page: Number(page), limit: Number(limit) })
        );

        return res.json(successResponse("Users fetched successfully", 200, paginateResult));
    };
    updateUser = async (req: IRequest, res: Response) => {
        const user = req.loggedInUser?.user;
        if (!user) throw new badRequestException("Unauthorized");
        const { name, phone, gender } = req.body;
        const updatedData: Partial<IUser> = {};
        if (name) updatedData.name = name;
        if (phone) {
            const encryptedPhone = encrypt(phone);
            const phoneExists = await this.userRepo.exists({
                phone: encryptedPhone,
                _id: { $ne: user._id }
            });
            if (phoneExists) throw new conflictException("Phone already exists");
            updatedData.phone = encrypt(phone);
        }
        if (gender) updatedData.gender = gender;

        if (!Object.keys(updatedData).length) {
            throw new badRequestException("No data provided to update")
        }
        const updatedUser = await this.userRepo.findDocumentByIdAndUpdate(
            user._id,
            { $set: updatedData },
            { new: true }
        );
        if (!updatedUser) throw new badRequestException("User not found or update failed");
        return res.json(successResponse("User updated successfully", 200, updatedUser));
    }
    uploadProfileImage = async (req: IRequest, res: Response) => {

        const user = req.loggedInUser?.user;
        if (!user) throw new badRequestException("Unauthorized");
        const imagePath = req.file?.path;

        if (!imagePath) throw new badRequestException("Profile image is required");

        const existingUser = await this.userRepo.findDocumentById(user._id);

        if (existingUser?.profileImage?.public_id) {
            await deleteFileFromCloudinary(existingUser.profileImage.public_id);
        }

        const uploadResult = await uploadFileToCloudinary(
            imagePath,
            {
                folder: "user_profile_images"
            }
        );

        await fs.unlink(imagePath);

        const updatedUser = await this.userRepo.findDocumentByIdAndUpdate(
            user._id,
            {
                profileImage: {
                    secure_url: uploadResult.secure_url,
                    public_id: uploadResult.public_id
                }
            },
            {
                new: true
            }
        );
        return res.json(successResponse("Profile image uploaded successfully", 200, updatedUser));
    };
    deleteProfileImage = async (req: IRequest, res: Response) => {

        const user = req.loggedInUser?.user;
        if (!user) throw new badRequestException("Unauthorized");

        const existingUser = await this.userRepo.findDocumentById(user._id);
        if (!existingUser?.profileImage?.public_id) throw new badRequestException("No profile image");

        await deleteFileFromCloudinary(existingUser.profileImage.public_id);

        existingUser.profileImage = undefined;
        await existingUser.save();

        return res.json(successResponse("Profile image deleted successfully"));
    }
    deleteAccount = async (req: IRequest, res: Response) => {

        const user = req.loggedInUser?.user;
        if (!user) throw new badRequestException("Unauthorized");
        const { jti, exp } = req.loggedInUser!.tokenData;

        await this.blacklistedTokenRepo.createNewDocument({
            tokenId: jti,
            expiresAt: new Date((exp as number) * 1000)
        })

        const existingUser = await this.userRepo.findDocumentById(user._id);
        if (!existingUser) throw new badRequestException("User not found");
        if (existingUser.profileImage?.public_id) {
            await deleteFileFromCloudinary(existingUser.profileImage.public_id);
        }

        const deletedUser = await this.userRepo.deleteById(user._id);
        if (!deletedUser) throw new badRequestException("User not found");
        return res.json(successResponse("Account deleted successfully", 200));
    }
}


export default new userService();