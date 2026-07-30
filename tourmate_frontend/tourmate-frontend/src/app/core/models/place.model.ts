import { IGeoPoint } from './location.model';

export interface IPlace {
  _id: string;
  osmId: number;
  name: string;
  city: string;
  category: string;
  description: string;
  coordinates: IGeoPoint;
  price?: number;
  averageRating: number;
  reviewsCount: number;
  createdAt?: string;
  updatedAt?: string;
}
