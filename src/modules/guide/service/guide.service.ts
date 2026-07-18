import { Response } from "express";
import fs from "fs/promises";
import {
    IGuide,
    IRequest,
    roleEnum,
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

        const user = await this.userRepo.findDocumentById(userId);

        if (!user)
            throw new badRequestException("User not found");

        const existingGuide = await this.guideRepo.findOneDocument({ userId });

        if (existingGuide)
            throw new conflictException("Guide already exists");

        await this.userRepo.findDocumentByIdAndUpdate(
            userId,
            {
                role: roleEnum.GUIDE
            }
        );

        const guide = await this.guideRepo.createNewDocument({
            userId,
            languages,
            experience: experience || 0,
            certificate,
            rating: 0,
            availability: true,
            verificationStatus: verificationStatusEnum.PENDING
        } as Partial<IGuide>);

        return res.json(
            successResponse(
                "Guide created successfully",
                201,
                guide
            )
        );
    };

    updateGuide = async (req: IRequest, res: Response) => {

        const { id } = req.params as { id: string };

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

        if (languages)
            updatedData.languages = languages;

        if (experience)
            updatedData.experience = experience;

        if (certificate)
            updatedData.certificate = certificate;

        if (typeof availability === "boolean")
            updatedData.availability = availability;

        if (verificationStatus)
            updatedData.verificationStatus = verificationStatus;

        if (!Object.keys(updatedData).length)
            throw new badRequestException("No data provided to update");

        const updatedGuide = await this.guideRepo.findDocumentByIdAndUpdate(
            id,
            { $set: updatedData },
            { new: true }
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

        const guide = await guideModel
            .findById(id)
            .populate("userId", "-password");

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

        const guides = await guideModel
            .find()
            .populate("userId", "-password")
            .skip(skip)
            .limit(currentLimit);

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
        } = req.query;

        const filter: any = {};

        if (language)
            filter.languages = language;

        if (availability !== undefined)
            filter.availability = availability === "true";

        if (verificationStatus)
            filter.verificationStatus = verificationStatus;

        const guides = await guideModel
            .find(filter)
            .populate("userId", "-password");

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

        if (typeof availability !== "boolean")
            throw new badRequestException("Invalid availability value");

        const guide = await this.guideRepo.findDocumentByIdAndUpdate(
            id,
            { availability },
            { new: true }
        );

        if (!guide)
            throw new badRequestException("Guide not found");

        return res.json(
            successResponse(
                "Guide updated successfully",
                200,
                guide
            )
        );
    };

    uploadCertificate = async (req: IRequest, res: Response) => {

        const { id } = req.params as { id: string };
        const filePath = req.file?.path;

        if (!filePath)
            throw new badRequestException("Certificate file is required");

        const guide = await this.guideRepo.findDocumentById(id);

        if (!guide)
            throw new badRequestException("Guide not found");

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
                certificate: uploadResult.secure_url
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

        const guide = await this.guideRepo.findDocumentById(id);

        if (!guide)
            throw new badRequestException("Guide not found");

        if (!guide.certificate)
            throw new badRequestException("No certificate to delete");

        await this.guideRepo.findDocumentByIdAndUpdate(
            id,
            {
                $unset: { certificate: 1 }
            },
            {
                new: true
            }
        );

        return res.json(
            successResponse(
                "Certificate deleted successfully",
                200
            )
        );
    };

}

export default new guideService();