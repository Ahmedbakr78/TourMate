import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ISuccessResponse, IPaginateResult } from '../models/response.model';
import { IPlace } from '../models/place.model';
import { IGeoPoint } from '../models/location.model';

@Injectable({ providedIn: 'root' })
export class PlaceService {

  private readonly baseUrl = `${environment.apiUrl}/place`;

  constructor(private http: HttpClient) { }

  createPlace(payload: { osmId: number; name: string; city: string; category: string; description?: string; coordinates: IGeoPoint; price?: number }): Observable<ISuccessResponse<IPlace>> {
    return this.http.post<ISuccessResponse<IPlace>>(`${this.baseUrl}/create_place`, payload);
  }

  getPlaceById(id: string): Observable<ISuccessResponse<IPlace>> {
    return this.http.get<ISuccessResponse<IPlace>>(`${this.baseUrl}/get/${id}`);
  }

  getPlaces(page = 1, limit = 10): Observable<ISuccessResponse<IPaginateResult<IPlace>>> {
    return this.http.get<ISuccessResponse<IPaginateResult<IPlace>>>(`${this.baseUrl}/all`, { params: { page, limit } });
  }

  updatePlace(id: string, payload: Partial<{ name: string; city: string; category: string; description: string; price: number; coordinates: IGeoPoint }>): Observable<ISuccessResponse<IPlace>> {
    return this.http.put<ISuccessResponse<IPlace>>(`${this.baseUrl}/update/${id}`, payload);
  }

  deletePlace(id: string): Observable<ISuccessResponse> {
    return this.http.delete<ISuccessResponse>(`${this.baseUrl}/places/${id}`);
  }

  /** Now backed by a working req.query read server-side, so these filters are applied for real. */
  searchPlaces(filters: { name?: string; city?: string; category?: string; price?: number; page?: number; limit?: number }): Observable<ISuccessResponse<IPaginateResult<IPlace>>> {
    return this.http.get<ISuccessResponse<IPaginateResult<IPlace>>>(`${this.baseUrl}/search`, { params: { ...filters } as any });
  }

  getNearbyPlaces(lng: number, lat: number, radius = 5000): Observable<ISuccessResponse<IPlace[]>> {
    return this.http.get<ISuccessResponse<IPlace[]>>(`${this.baseUrl}/nearby`, { params: { lng, lat, radius } });
  }
}
