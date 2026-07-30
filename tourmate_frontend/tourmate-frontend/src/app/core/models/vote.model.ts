import { VoteValueEnum } from './enums';
import { IPlace } from './place.model';
import { ITrip } from './trip.model';
import { IUser } from './user.model';

export interface IVote {
  _id: string;
  tripId: string | ITrip;
  placeId: string | IPlace;
  userId: string | IUser;
  voteValue: VoteValueEnum;
  createdAt?: string;
  updatedAt?: string;
}
