import { IDriver } from './driver.model';
import { IGuide } from './guide.model';
import { IPlace } from './place.model';
import { ITrip } from './trip.model';
import { IUser } from './user.model';

export interface IReview {
  _id: string;
  tripId: string | ITrip;
  touristId: string | IUser;
  driverId?: string | IDriver;
  guideId?: string | IGuide;
  placeId?: string | IPlace;
  rating: number;
  comment: string;
  createdAt?: string;
  updatedAt?: string;
}
