import { Response } from "express";
import fs from "fs/promises";
import {
    IGuide,
    IRequest,
    roleEnum,
    statusUserEnum,
    verificationStatusEnum
} from "../../../common/index.js";
import {
    guideModel,
    guideRepository,
    userModel,
    userRepository
} from "../../../db/index.js";
import {
    badRequestException,
    conflictException,
    deleteFileFromCloudinary,
    pagination,
    successResponse,
    uploadFileToCloudinary
} from "../../../utils/index.js";
import mongoose from "mongoose";

class guideService {

    private guideRepo = new guideRepository(guideModel);
    private userRepo = new userRepository(userModel);

    createGuide = async (req: IRequest, res: Response) => {

        const {
            userId,
            languages,
            experience,
            certificate
        } = req.body;

        if (!mongoose.isValidObjectId(userId))
            throw new badRequestException("Invalid user id");

        const user = await this.userRepo.findDocumentById(userId);

        if (!user)
            throw new badRequestException("User not found");

        if (!user.isVerified)
            throw new badRequestException("User is not verified");

        if (user.status !== statusUserEnum.ACTIVE)
            throw new badRequestException("User is blocked");

        if (user.role !== roleEnum.TOURIST)
            throw new badRequestException("Only tourist can become a guide");

        const existingGuide = await this.guideRepo.findOneDocument({ userId });

        if (existingGuide)
            throw new conflictException("Guide already exists");

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
        } as Partial<IGuide>);

        return res.status(201).json(
            successResponse(
                "Guide created successfully",
                201,
                {
                    guide,
                    user: updatedUser
                }
            )
        );
    };
    updateGuide = async (req: IRequest, res: Response) => {

        const { id } = req.params as { id: string };

        if (!mongoose.isValidObjectId(id))
            throw new badRequestException("Invalid guide id");

        const {
            languages,
            experience,
            certificate,
            availability,
            verificationStatus
        } = req.body;

        const guide = await this.guideRepo.findDocumentById(id);

        if (!guide)
            throw new badRequestException("Guide not found");

        const updatedData: Partial<IGuide> = {};

        if (languages !== undefined)
            updatedData.languages = languages;

        if (experience !== undefined)
            updatedData.experience = experience;

        if (certificate !== undefined)
            updatedData.certificate = certificate;

        if (typeof availability === "boolean")
            updatedData.availability = availability;

        if (verificationStatus !== undefined) {

            if (
                !Object.values(verificationStatusEnum).includes(
                    verificationStatus
                )
            ) {
                throw new badRequestException("Invalid verification status");
            }

            updatedData.verificationStatus = verificationStatus;
        }

        if (!Object.keys(updatedData).length)
            throw new badRequestException("No data provided to update");

        const updatedGuide = await this.guideRepo.findDocumentByIdAndUpdate(
            id,
            {
                $set: updatedData
            },
            {
                new: true
            }
        );

        return res.json(
            successResponse(
                "Guide updated successfully",
                200,
                updatedGuide
            )
        );
    };

    deleteGuide = async (req: IRequest, res: Response) => {

        const { id } = req.params as { id: string };

        if (!mongoose.isValidObjectId(id))
            throw new badRequestException("Invalid guide id");

        const guide = await this.guideRepo.findDocumentById(id);

        if (!guide)
            throw new badRequestException("Guide not found");

        await this.userRepo.findDocumentByIdAndUpdate(
            guide.userId,
            {
                role: roleEnum.TOURIST
            }
        );

        await this.guideRepo.deleteById(id);

        return res.json(
            successResponse(
                "Guide deleted successfully",
                200
            )
        );
    };

    getGuideById = async (req: IRequest, res: Response) => {

        const { id } = req.params as { id: string };

        if (!mongoose.isValidObjectId(id))
            throw new badRequestException("Invalid guide id");

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

        if (!guide)
            throw new badRequestException("Guide not found");

        return res.json(
            successResponse(
                "Guide fetched successfully",
                200,
                guide
            )
        );
    };

    getGuides = async (req: IRequest, res: Response) => {

        const { page, limit } = req.query;

        const { skip, limit: currentLimit } = pagination({
            page: Number(page),
            limit: Number(limit)
        });

        const guides = await this.guideRepo.findDocuments(
            {},
            {},
            {
                populate: {
                    path: "userId",
                    select: "-password"
                },
                skip,
                limit: currentLimit,
                sort: { createdAt: -1 }
            }
        );

        return res.json(
            successResponse(
                "Guides fetched successfully",
                200,
                guides
            )
        );
    };
    searchGuides = async (req: IRequest, res: Response) => {

        const {
            language,
            availability,
            verificationStatus
        } = req.body;

        const filter: any = {};

        if (language) {
            filter.languages = language;
        }

        if (availability !== undefined) {
            filter.availability = availability;
        }

        if (
            verificationStatus &&
            !Object.values(verificationStatusEnum).includes(
                verificationStatus
            )
        ) {
            throw new badRequestException("Invalid verification status");
        }

        if (verificationStatus) {
            filter.verificationStatus = verificationStatus;
        }

        const guides = await this.guideRepo.findDocuments(
            filter,
            {},
            {
                populate: {
                    path: "userId",
                    select: "-password"
                },
                sort: {
                    createdAt: -1
                }
            }
        );

        return res.json(
            successResponse(
                "Guides fetched successfully",
                200,
                guides
            )
        );
    };

    updateAvailability = async (req: IRequest, res: Response) => {

        const { id } = req.params as { id: string };
        const { availability } = req.body;

        if (!mongoose.isValidObjectId(id))
            throw new badRequestException("Invalid guide id");

        if (typeof availability !== "boolean")
            throw new badRequestException("Invalid availability value");

        const guide = await this.guideRepo.findDocumentById(id);

        if (!guide)
            throw new badRequestException("Guide not found");

        const updatedGuide = await this.guideRepo.findDocumentByIdAndUpdate(
            id,
            {
                availability
            },
            {
                new: true
            }
        );

        return res.json(
            successResponse(
                "Guide availability updated successfully",
                200,
                updatedGuide
            )
        );
    };

    uploadCertificate = async (req: IRequest, res: Response) => {

        const { id } = req.params as { id: string };

        if (!mongoose.isValidObjectId(id))
            throw new badRequestException("Invalid guide id");

        const filePath = req.file?.path;

        if (!filePath)
            throw new badRequestException("Certificate file is required");

        const guide = await this.guideRepo.findDocumentById(id);

        if (!guide)
            throw new badRequestException("Guide not found");

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

        const updatedGuide = await this.guideRepo.findDocumentByIdAndUpdate(
            id,
            {
                certificate: {
                    secure_url: uploadResult.secure_url,
                    public_id: uploadResult.public_id
                }
            },
            {
                new: true
            }
        );

        return res.status(201).json(
            successResponse(
                "Certificate uploaded successfully",
                201,
                updatedGuide
            )
        );
    };

    deleteCertificate = async (req: IRequest, res: Response) => {

        const { id } = req.params as { id: string };

        if (!mongoose.isValidObjectId(id))
            throw new badRequestException("Invalid guide id");

        const guide = await this.guideRepo.findDocumentById(id);

        if (!guide)
            throw new badRequestException("Guide not found");

        if (!guide.certificate)
            throw new badRequestException("No certificate found");

        await deleteFileFromCloudinary(
            guide.certificate.public_id
        );

        const updatedGuide = await this.guideRepo.findDocumentByIdAndUpdate(
            id,
            {
                $unset: {
                    certificate: 1
                }
            },
            {
                new: true
            }
        );

        return res.json(
            successResponse(
                "Certificate deleted successfully",
                200,
                updatedGuide
            )
        );
    };
}

export default new guideService();