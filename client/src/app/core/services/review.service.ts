import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

@Injectable({ providedIn: 'root' })
export class ReviewService {
  private api = inject(ApiService);

  getAll(params?: any): Observable<any> { return this.api.get('/reviews', params); }
  getById(id: string): Observable<any> { return this.api.get(`/reviews/${id}`); }
  create(data: any): Observable<any> { return this.api.post('/reviews', data); }
  update(id: string, data: any): Observable<any> { return this.api.patch(`/reviews/${id}`, data); }
  delete(id: string): Observable<any> { return this.api.delete(`/reviews/${id}`); }
  getTripReviews(tripId: string): Observable<any> { return this.api.get(`/reviews/trip/${tripId}`); }
  getGuideReviews(guideId: string): Observable<any> { return this.api.get(`/reviews/guide/${guideId}`); }
  getDriverReviews(driverId: string): Observable<any> { return this.api.get(`/reviews/driver/${driverId}`); }
  getPlaceReviews(placeId: string): Observable<any> { return this.api.get(`/reviews/place/${placeId}`); }
  getMyReviews(): Observable<any> { return this.api.get('/reviews/my'); }
}
