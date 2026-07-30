import { LostItemStatusEnum } from './enums';
import { ITrip } from './trip.model';
import { IUser } from '../../../../../shared/src/app/core/models/user.model';

export interface ILostItemImage {
  secure_url: string;
  public_id: string;
}

export interface ILostItem {
  _id: string;
  tripId: string | ITrip;
  userId: string | IUser;
  title: string;
  description: string;
  image?: ILostItemImage;
  status: LostItemStatusEnum;
  createdAt?: string;
  updatedAt?: string;
}
