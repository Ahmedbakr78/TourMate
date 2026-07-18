// import { Request, Response } from "express";
// import {
//     IGuide,
//     roleEnum,
//     verificationStatusEnum
// } from "../../../common/index.js";
// import {
//     guideModel,
//     guideRepository,
//     userModel,
//     userRepository
// } from "../../../db/index.js";
// import {
//     badRequestException,
//     conflictException,
//     successResponse
// } from "../../../utils/index.js";

// class guideService {

//     private guideRepo = new guideRepository(guideModel);
//     private userRepo = new userRepository(userModel);

//     createGuide = async (req: Request, res: Response) => {

//         const {
//             userId,
//             languages,
//             experience,
//             certificate
//         } = req.body;

//         const user = await this.userRepo.findDocumentById(userId);

//         if (!user)
//             throw new badRequestException("User not found");

//         const existingGuide = await this.guideRepo.findOneDocument({ userId });

//         if (existingGuide)
//             throw new conflictException("Guide already exists");

//         await this.userRepo.findDocumentByIdAndUpdate(
//             userId,
//             {
//                 role: roleEnum.GUIDE
//             }
//         );

//         const guide = await this.guideRepo.createNewDocument({
//             userId,
//             languages,
//             experience: experience || 0,
//             certificate,
//             rating: 0,
//             availability: true,
//             verificationStatus: verificationStatusEnum.PENDING
//         } as Partial<IGuide>);

//         return res.json(
//             successResponse(
//                 "Guide created successfully",
//                 201,
//                 guide
//             )
//         );
//     };
//     updateGuide = async (req: Request, res: Response) => {

//         const { id } = req.params as { id: string };

//         const {
//             languages,
//             experience,
//             certificate,
//             availability,
//             verificationStatus
//         } = req.body;

//         const guide = await this.guideRepo.findDocumentById(id);

//         if (!guide)
//             throw new badRequestException("Guide not found");

//         const updatedData: Partial<IGuide> = {};

//         if (languages)
//             updatedData.languages = languages;

//         if (experience)
//             updatedData.experience = experience;

//         if (certificate)
//             updatedData.certificate = certificate;

//         if (typeof availability === "boolean")
//             updatedData.availability = availability;

//         if (verificationStatus)
//             updatedData.verificationStatus = verificationStatus;

//         if (!Object.keys(updatedData).length)
//             throw new badRequestException("No data provided to update");

//         const updatedGuide = await this.guideRepo.findDocumentByIdAndUpdate(
//             id,
//             { $set: updatedData },
//             { new: true }
//         );

//         return res.json(
//             successResponse(
//                 "Guide updated successfully",
//                 200,
//                 updatedGuide
//             )
//         );
//     };

//     deleteGuide = async (req: Request, res: Response) => {

//         const { id } = req.params as { id: string };

//         const guide = await this.guideRepo.findDocumentById(id);

//         if (!guide)
//             throw new badRequestException("Guide not found");

//         await this.userRepo.findDocumentByIdAndUpdate(
//             guide.userId,
//             {
//                 role: roleEnum.TOURIST
//             }
//         );

//         await this.guideRepo.deleteById(id);

//         return res.json(
//             successResponse(
//                 "Guide deleted successfully",
//                 200
//             )
//         );
//     };

//     getGuideById = async (req: Request, res: Response) => {

//         const { id } = req.params as { id: string };

//         const guide = await this.guideRepo
//             .findDocumentById(id)
//             .populate("userId", "-password");

//         if (!guide)
//             throw new badRequestException("Guide not found");

//         return res.json(
//             successResponse(
//                 "Guide fetched successfully",
//                 200,
//                 guide
//             )
//         );
//     };

//     getGuides = async (req: Request, res: Response) => {

//         const { page, limit } = req.query;

//         const { skip, limit: currentLimit } = pagination({
//             page: Number(page),
//             limit: Number(limit)
//         });

//         const guides = await this.guideRepo
//             .find()
//             .populate("userId", "-password")
//             .skip(skip)
//             .limit(currentLimit);

//         return res.json(
//             successResponse(
//                 "Guides fetched successfully",
//                 200,
//                 guides
//             )
//         );
//     };

//     searchGuides = async (req: Request, res: Response) => {

//         const {
//             q,
//             language,
//             specialty,
//             lat,
//             lng,
//             radius = 5000
//         } = req.query;

//         const filter: any = {};

//         if (language)
//             filter.languages = language;

//         if (specialty)
//             filter.specialties = specialty;

//         let query = this.guideRepo.find(filter).populate("userId", "-password");

//         if (q)
//             query = query.where("bio").regex(new RegExp(q, "i"));

//         if (lat && lng) {
//             query = query.where("currentLocation").near({
//                 center: { type: "Point", coordinates: [Number(lng), Number(lat)] },
//                 maxDistance: Number(radius)
//             });
//         }

//         const guides = await query.limit(50);

//         return res.json(
//             successResponse(
//                 "Guides fetched successfully",
//                 200,
//                 guides
//             )
//         );
//     };

//     updateAvailability = async (req: Request, res: Response) => {

//         const { availability } = req.body;

//         if (typeof availability !== "boolean")
//             throw new badRequestException("Invalid availability value");

//         const guide = await this.guideRepo.findDocumentByIdAndUpdate(
//             req.params.id,
//             { availability, lastSeen: new Date() },
//             { new: true }
//         );

//         if (!guide)
//             throw new badRequestException("Guide not found");

//         return res.json(
//             successResponse(
//                 "Guide updated successfully",
//                 200,
//                 guide
//             )   
//         );
//     };
//     uploadCertificate = async (req: Request, res: Response) => {
//         if (!req.file)
//             throw new badRequestException("No file uploaded");
//         const guide = await this.guideRepo.findDocumentById(req.params.id);
//         if (!guide)
//             throw new badRequestException("Guide not found");
//         const url = publicUrl(req, req.file.filename);
//         guide.certificate = url;
//         await guide.save();
//         res.status(201).json(
//             successResponse(
//                 "Certificate uploaded successfully",
//                 201,
//                 guide.toSafeJSON()
//             )
//         );
//     };
//     deleteCertificate = async (req: Request, res: Response) => {
//         const { url } = req.body;
//         const guide = await this.guideRepo.findDocumentById(req.params.id);
//         if (!guide)
//             throw new badRequestException("Guide not found");
//         guide.certificate = null;
//         deleteFile(url);
//         await guide.save();
//         res.json(
//             successResponse(
//                 "Certificate deleted successfully",
//                 200
//             )
//         );
//     };

// }

// export default new guideService();