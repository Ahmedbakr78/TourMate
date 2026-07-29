import { GenderEnum, OtpTypesEnum, RoleEnum, StatusUserEnum } from './enums';

export interface IProfileImage {
  secure_url: string;
  public_id: string;
}

export interface IOtp {
  value: string;
  expiredAt: string;
  otpType: OtpTypesEnum;
}

export interface IUser {
  _id: string;
  name: string;
  email: string;
  phone: string;
  profileImage?: IProfileImage;
  gender: GenderEnum;
  role: RoleEnum;
  status: StatusUserEnum;
  otps?: IOtp[];
  isVerified: boolean;
  createdAt?: string;
  updatedAt?: string;
}
