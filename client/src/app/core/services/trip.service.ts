import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

export interface Trip {
  _id?: string;
  touristId: any;
  places: any[];
  guideId?: any;
  driverId?: any;
  vehicleId?: any;
  startDate: string;
  endDate: string;
  peopleCount: number;
  price: number;
  status: 'DRAFT' | 'PENDING' | 'CONFIRMED' | 'ONGOING' | 'COMPLETED' | 'CANCELLED';
  startLocation?: any;
  endLocation?: any;
  routeGeoJSON?: any;
  distanceMeters?: number;
  durationSeconds?: number;
  fare?: number;
  isShared?: boolean;
  startTime?: string;
  endTime?: string;
  createdAt?: string;
}

@Injectable({ providedIn: 'root' })
export class TripService {
  private api = inject(ApiService);

  getAll(params?: any): Observable<any> { return this.api.get('/trips', params); }
  getMyTrips(): Observable<any> { return this.api.get('/trips/my'); }
  getSharedTrips(): Observable<any> { return this.api.get('/trips/shared'); }
  getById(id: string): Observable<any> { return this.api.get(`/trips/${id}`); }
  create(data: Partial<Trip>): Observable<any> { return this.api.post('/trips', data); }
  update(id: string, data: Partial<Trip>): Observable<any> { return this.api.patch(`/trips/${id}`, data); }
  delete(id: string): Observable<any> { return this.api.delete(`/trips/${id}`); }
  assignGuide(id: string, guideId: string): Observable<any> { return this.api.patch(`/trips/${id}/assign-guide`, { guideId }); }
  assignDriver(id: string, driverId: string): Observable<any> { return this.api.patch(`/trips/${id}/assign-driver`, { driverId }); }
  assignVehicle(id: string, vehicleId: string): Observable<any> { return this.api.patch(`/trips/${id}/assign-vehicle`, { vehicleId }); }
  startTrip(id: string): Observable<any> { return this.api.patch(`/trips/${id}/start`, {}); }
  completeTrip(id: string): Observable<any> { return this.api.patch(`/trips/${id}/complete`, {}); }
  cancelTrip(id: string): Observable<any> { return this.api.patch(`/trips/${id}/cancel`, {}); }
  shareTrip(id: string, isShared: boolean): Observable<any> { return this.api.patch(`/trips/${id}/share`, { isShared }); }
  duplicateTrip(id: string): Observable<any> { return this.api.post(`/trips/${id}/duplicate`, {}); }
  calculatePrice(data: any): Observable<any> { return this.api.post('/trips/calculate-price', data); }
  getRoute(id: string): Observable<any> { return this.api.get(`/trips/${id}/route`); }
}
