import { VerificationStatusEnum } from './enums';
import { IGeoPoint } from './location.model';
import { IUser } from './user.model';

export interface IDriver {
  _id: string;
  userId: string | IUser;
  licenseNumber: string;
  rating: number;
  availability: boolean;
  currentLocation?: IGeoPoint;
  verificationStatus: VerificationStatusEnum;
  createdAt?: string;
  updatedAt?: string;
}
