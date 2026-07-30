import { VerificationStatusEnum } from './enums';
import { IUser } from '../../../../../shared/src/app/core/models/user.model';

export interface ICertificate {
  secure_url: string;
  public_id: string;
}

export interface IGuide {
  _id: string;
  userId: string | IUser;
  languages: string[];
  experience: number;
  certificate?: ICertificate;
  rating: number;
  availability: boolean;
  verificationStatus: VerificationStatusEnum;
  createdAt?: string;
  updatedAt?: string;
}
