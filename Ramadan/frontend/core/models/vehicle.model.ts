import { IDriver } from './driver.model';

export interface ICarImage {
  secure_url: string;
  public_id: string;
}

export interface IVehicle {
  _id: string;
  driverId: string | IDriver;
  brand: string;
  vehicleModel: string;
  capacity: number;
  plateNumber: string;
  carImages: ICarImage[];
  createdAt?: string;
  updatedAt?: string;
}
