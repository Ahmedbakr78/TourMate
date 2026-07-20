import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

export interface Place {
  _id?: string;
  osmId: number;
  name: string;
  city: string;
  category: string;
  description?: string;
  coordinates?: { type: string; coordinates: number[] };
}

@Injectable({ providedIn: 'root' })
export class PlaceService {
  private api = inject(ApiService);

  getAll(params?: any): Observable<any> { return this.api.get('/places', params); }
  getById(id: string): Observable<any> { return this.api.get(`/places/${id}`); }
  search(params: any): Observable<any> { return this.api.get('/places/search', params); }
  filter(params: any): Observable<any> { return this.api.get('/places/filter', params); }
  getNearby(params: any): Observable<any> { return this.api.get('/places/nearby', params); }
  getPopular(limit?: number): Observable<any> { return this.api.get('/places/popular', { limit }); }
  save(data: Partial<Place>): Observable<any> { return this.api.post('/places/save', data); }
}
