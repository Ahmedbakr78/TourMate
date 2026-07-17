import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

export interface DriverLocation {
  driverId: string;
  type: 'Point';
  coordinates: [number, number];
  heading: number | null;
  speed: number | null;
  tripId: string | null;
  updatedAt: string;
}

@Injectable({ providedIn: 'root' })
export class TrackingService {
  constructor(private api: ApiService) {}

  // Driver pushes location (polling source — NO WebSockets)
  pushLocation(driverId: string, lng: number, lat: number, meta?: { heading?: number; speed?: number; tripId?: string }): Observable<{ status: string; data: DriverLocation }> {
    return this.api.post(`/tracking/driver/${driverId}/location`, { lng, lat, ...meta });
  }

  // Clients poll a single driver's location
  pollDriver(driverId: string): Observable<{ status: string; data: DriverLocation }> {
    return this.api.get(`/tracking/driver/${driverId}`);
  }

  // Clients poll all active trip locations
  pollActiveTrips(): Observable<{ status: string; data: DriverLocation[] }> {
    return this.api.get('/tracking/active-trips');
  }
}
