import { Response } from "express";
import fs from "fs/promises";
import { IGuide, IRequest, roleEnum, statusUserEnum, verificationStatusEnum } from "../../../common/index.js";
import { guideModel, guideRepository, userModel, userRepository } from "../../../db/index.js";
import { badRequestException, conflictException, deleteFileFromCloudinary, pagination, successResponse, uploadFileToCloudinary } from "../../../utils/index.js";
import mongoose from "mongoose";

class guideService {

    private guideRepo = new guideRepository(guideModel);
    private userRepo = new userRepository(userModel);

    createGuide = async (req: IRequest, res: Response) => {

        const { userId, languages, experience } = req.body;
        const filePath = req.file?.path;

        if (!mongoose.isValidObjectId(userId)) throw new badRequestException("Invalid user id");

        const user = await this.userRepo.findDocumentById(userId);
        if (!user) throw new badRequestException("User not found");
        if (!user.isVerified) throw new badRequestException("User is not verified");
        if (user.status !== statusUserEnum.ACTIVE) throw new badRequestException("User is blocked");
        if (user.role !== roleEnum.TOURIST) throw new badRequestException("Only tourist can become a guide");

        const existingGuide = await this.guideRepo.findOneDocument({ userId });
        if (existingGuide) throw new conflictException("Guide already exists");

        if (!languages || !Array.isArray(languages) || !languages.length)
            throw new badRequestException("Languages are required");

        if (experience < 0) throw new badRequestException("Invalid experience");

        let certificate;
        if (filePath) {

            const uploadResult = await uploadFileToCloudinary(filePath, {
                folder: "guide_certificates"
            });

            await fs.unlink(filePath);
            certificate = {
                secure_url: uploadResult.secure_url,
                public_id: uploadResult.public_id
            };
        }

        await this.userRepo.findDocumentByIdAndUpdate(
            userId,
            {
                role: roleEnum.GUIDE
            }
        );

        const updatedUser = await this.userRepo.findDocumentById(userId);

        const guide = await this.guideRepo.createNewDocument({
            userId,
            languages,
            experience: experience || 0,
            certificate,
            rating: 0,
            availability: true,
            verificationStatus: verificationStatusEnum.PENDING
        } as Partial<IGuide>)

        return res.json(successResponse("Guide created successfully", 201, { guide, user: updatedUser }));
    };
    updateGuide = async (req: IRequest, res: Response) => {

        const { id } = req.params as { id: string };
        if (!mongoose.isValidObjectId(id)) throw new badRequestException("Invalid guide id");

        const guide = await this.guideRepo.findDocumentById(id);
        if (!guide) throw new badRequestException("Guide not found");

        const { languages, experience, availability } = req.body;
        const filePath = req.file?.path;
        const updatedData: Partial<IGuide> = {};

        if (languages) updatedData.languages = languages;

        if (experience !== undefined) {
            if (experience < 0)
                throw new badRequestException("Invalid experience");

            updatedData.experience = experience;
        }

        if (typeof availability === "boolean")
            updatedData.availability = availability;

        if (filePath) {
            if (guide.certificate?.public_id) {
                await deleteFileFromCloudinary(
                    guide.certificate.public_id
                );
            }
            const uploadResult = await uploadFileToCloudinary(
                filePath,
                {
                    folder: "guide_certificates"
                }
            );
            await fs.unlink(filePath);
            updatedData.certificate = {
                secure_url: uploadResult.secure_url,
                public_id: uploadResult.public_id
            };
        }

        if (!Object.keys(updatedData).length) throw new badRequestException("No data provided");
        const updatedGuide = await this.guideRepo.findDocumentByIdAndUpdate(
            id,
            { $set: updatedData },
            {
                new: true
            }
        );

        return res.json(successResponse("Guide updated successfully", 200, updatedGuide));
    };
    deleteGuide = async (req: IRequest, res: Response) => {

        const { id } = req.params as { id: string };
        if (!mongoose.isValidObjectId(id)) throw new badRequestException("Invalid guide id");

        const guide = await this.guideRepo.findDocumentById(id);

        if (!guide) throw new badRequestException("Guide not found");

        if (guide.certificate?.public_id) {
            await deleteFileFromCloudinary(
                guide.certificate.public_id
            );
        }

        await this.userRepo.findDocumentByIdAndUpdate(
            guide.userId,
            {
                role: roleEnum.TOURIST
            }
        );
        await this.guideRepo.deleteById(id);
        return res.json(successResponse("Guide deleted successfully"));
    };
    getGuideById = async (req: IRequest, res: Response) => {

        const { id } = req.params as { id: string };
        if (!mongoose.isValidObjectId(id)) throw new badRequestException("Invalid guide id");

        const guide = await this.guideRepo.findDocumentById(
            id,
            {},
            {
                populate: {
                    path: "userId",
                    select: "-password"
                }
            }
        );

        if (!guide) throw new badRequestException("Guide not found");
        return res.json(successResponse("Guide fetched successfully", 200, guide));
    };
    getGuides = async (req: IRequest, res: Response) => {

        const { page, limit } = req.query;
        const guides = await this.guideRepo.paginateModel(
            {},
            {
                ...pagination({
                    page: Number(page),
                    limit: Number(limit)
                }),
                populate: {
                    path: "userId",
                    select: "-password"
                },
                sort: {
                    createdAt: -1
                }
            }
        );
        return res.json(successResponse("Guides fetched successfully", 200, guides));
    };
    searchGuides = async (req: IRequest, res: Response) => {

        const { language, availability, verificationStatus, page, limit } = req.body;

        const filter: any = {};

        if (language) {
            filter.languages = {
                $regex: language,
                $options: "i"
            };
        }
        if (availability !== undefined) {
            filter.availability = availability === "true";
        }

        if (verificationStatus && !Object.values(verificationStatusEnum).includes(verificationStatus as verificationStatusEnum)) {
            throw new badRequestException("Invalid verification status");
        }
        if (verificationStatus) {
            filter.verificationStatus = verificationStatus;
        }

        const guides = await this.guideRepo.paginateModel(
            filter,
            {
                ...pagination({
                    page: Number(page),
                    limit: Number(limit)
                }),
                populate: {
                    path: "userId",
                    select: "-password"
                },
                sort: {
                    createdAt: -1
                }
            }
        );
        return res.json(successResponse("Guides fetched successfully", 200, guides));
    };
}

export default new guideService();