import { TripStatusEnum } from './enums';
import { IDriver } from './driver.model';
import { IGuide } from './guide.model';
import { IPlace } from './place.model';
import { IUser } from './user.model';
import { IVehicle } from './vehicle.model';

export interface ITrip {
  _id: string;
  touristId: string | IUser;
  places: string[] | IPlace[];
  guideId?: string | IGuide;
  driverId?: string | IDriver;
  vehicleId?: string | IVehicle;
  startDate: string;
  endDate: string;
  peopleCount: number;
  price: number;
  status: TripStatusEnum;
  routePath: number[][];
  sharedTripId?: string;
  isPaid: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface ICreateTripPayload {
  places: string[];
  startDate: string;
  endDate: string;
  peopleCount: number;
  guideId?: string;
  driverId?: string;
  vehicleId?: string;
}
