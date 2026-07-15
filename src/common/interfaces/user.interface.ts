import { Document, Types } from "mongoose";
import { genderEnum, lostItemStatusEnum, otpTypesEnum, roleEnum, statusUserEnum, tripStatusEnum, verificationStatusEnum, voteValueEnum } from "../enums/user.enum.js";


interface IOtp {
    value: string;
    expiredAt: number;
    otpType: otpTypesEnum;
}

interface IProfileImage {
    secure_url: string;
    public_id: string;
}

interface IUser extends Document<Types.ObjectId> {
    name: string;
    email: string;
    password: string;
    phone: string;
    profileImage?: IProfileImage;
    gender: genderEnum;
    role: roleEnum;
    status: statusUserEnum;
    otps: IOtp[];
    isVerified: boolean;
}
interface ILocation {
    type: "Point";
    coordinates: [number, number];
}

interface IDriver extends Document<Types.ObjectId> {
    userId: Types.ObjectId;
    licenseNumber: string;
    rating: number;
    availability: boolean;
    currentLocation: ILocation;
    verificationStatus: verificationStatusEnum;
}

interface IGuide extends Document<Types.ObjectId> {
    userId: Types.ObjectId;
    languages: string[];
    experience: number;
    certificate: string;
    rating: number;
    availability: boolean;
    verificationStatus: verificationStatusEnum;
}

interface IImage {
    secure_url: string;
    public_id: string;
}

interface IVehicle extends Document<Types.ObjectId> {
    driverId: Types.ObjectId;
    brand: string;
    vehicleModel: string;
    capacity: number;
    plateNumber: string;
    carImages: IImage[];
}
interface IPlace extends Document<Types.ObjectId> {
    osmId: number;
    name: string;
    city: string;
    category: string;
    description: string;
    coordinates: ILocation;
}
interface ITrip extends Document<Types.ObjectId> {
    touristId: Types.ObjectId;
    places: Types.ObjectId[];
    guideId?: Types.ObjectId;
    driverId?: Types.ObjectId;
    vehicleId?: Types.ObjectId;
    startDate: Date;
    endDate: Date;
    peopleCount: number;
    price: number;
    status: tripStatusEnum;
    routePath: number[][];
    sharedTripId?: Types.ObjectId;
    isPaid: boolean;
}

interface IReview extends Document<Types.ObjectId> {
    tripId: Types.ObjectId;
    touristId: Types.ObjectId;
    driverId?: Types.ObjectId;
    guideId?: Types.ObjectId;
    placeId?: Types.ObjectId;
    rating: number;
    comment: string;
}

interface IVote extends Document<Types.ObjectId> {
    tripId: Types.ObjectId;
    placeId: Types.ObjectId;
    userId: Types.ObjectId;
    voteValue: voteValueEnum;
}

interface ILostItem extends Document<Types.ObjectId> {
    tripId: Types.ObjectId;
    userId: Types.ObjectId;
    title: string;
    description: string;
    image?: IImage;
    status: lostItemStatusEnum;
}

interface INotification extends Document<Types.ObjectId> {
    senderId?: Types.ObjectId
    receiverId: Types.ObjectId;
    title: string;
    message: string;
    isRead: boolean;
}

interface IBlackListedTokens extends Document<Types.ObjectId> {
    tokenId: string,
    expiresAt: Date
}

export type {
    IUser, IDriver, IGuide, IVehicle, IPlace, ITrip,
    IReview, IVote, ILostItem, INotification, IBlackListedTokens
}