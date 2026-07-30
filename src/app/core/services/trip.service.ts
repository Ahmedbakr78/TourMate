import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../shared/src/environments/environment';
import { ISuccessResponse, IPaginateResult } from '../models/response.model';
import { ICreateTripPayload, ITrip } from '../models/trip.model';

@Injectable({ providedIn: 'root' })
export class TripService {

  private readonly baseUrl = `${environment.apiUrl}/trip`;

  constructor(private http: HttpClient) { }

  createTrip(payload: ICreateTripPayload): Observable<ISuccessResponse<ITrip>> {
    return this.http.post<ISuccessResponse<ITrip>>(`${this.baseUrl}/create_trip`, payload);
  }

  getTripById(id: string): Observable<ISuccessResponse<ITrip>> {
    return this.http.get<ISuccessResponse<ITrip>>(`${this.baseUrl}/get/${id}`);
  }

  getTrips(page = 1, limit = 10): Observable<ISuccessResponse<IPaginateResult<ITrip>>> {
    return this.http.get<ISuccessResponse<IPaginateResult<ITrip>>>(`${this.baseUrl}/all`, { params: { page, limit } });
  }

  getMyTrips(page = 1, limit = 10): Observable<ISuccessResponse<IPaginateResult<ITrip>>> {
    return this.http.get<ISuccessResponse<IPaginateResult<ITrip>>>(`${this.baseUrl}/my_trips`, { params: { page, limit } });
  }

  updateTrip(id: string, payload: Partial<{ places: string[]; startDate: string; endDate: string; peopleCount: number }>): Observable<ISuccessResponse<ITrip>> {
    return this.http.patch<ISuccessResponse<ITrip>>(`${this.baseUrl}/${id}/update`, payload);
  }

  cancelTrip(id: string): Observable<ISuccessResponse> {
    return this.http.patch<ISuccessResponse>(`${this.baseUrl}/${id}/cancel`, {});
  }

  getSharedTrips(page = 1, limit = 10): Observable<ISuccessResponse<IPaginateResult<ITrip>>> {
    return this.http.get<ISuccessResponse<IPaginateResult<ITrip>>>(`${this.baseUrl}/shared`, { params: { page, limit } });
  }

  joinSharedTrip(id: string, peopleCount = 1): Observable<ISuccessResponse<ITrip>> {
    return this.http.patch<ISuccessResponse<ITrip>>(`${this.baseUrl}/${id}/join`, { peopleCount });
  }
}
