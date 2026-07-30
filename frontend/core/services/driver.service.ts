import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ISuccessResponse } from '../models/response.model';
import { IDriver } from '../models/driver.model';
import { IGeoPoint } from '../models/location.model';
import { IUser } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class DriverService {

  private readonly baseUrl = `${environment.apiUrl}/driver`;

  constructor(private http: HttpClient) { }

  createDriver(payload: { userId: string; licenseNumber: string; currentLocation?: IGeoPoint }): Observable<ISuccessResponse<{ driver: IDriver }>> {
    return this.http.post<ISuccessResponse<{ driver: IDriver }>>(`${this.baseUrl}/create_driver`, payload);
  }

  updateDriver(id: string, payload: Partial<{ licenseNumber: string; availability: boolean; currentLocation: IGeoPoint; verificationStatus: string }>): Observable<ISuccessResponse<IDriver>> {
    return this.http.patch<ISuccessResponse<IDriver>>(`${this.baseUrl}/update/${id}`, payload);
  }

  deleteDriver(id: string): Observable<ISuccessResponse> {
    return this.http.delete<ISuccessResponse>(`${this.baseUrl}/delete/${id}`);
  }

  getDriverById(id: string): Observable<ISuccessResponse<IDriver>> {
    return this.http.get<ISuccessResponse<IDriver>>(`${this.baseUrl}/get/${id}`);
  }

  /**
   * Note: unlike guide/vehicle/place, GET /driver/all uses findDocuments() on the
   * backend rather than paginateModel(), so it returns a plain IDriver[] instead of
   * a { docs, totalDocs, ... } wrapper. Kept as-is since this is just a shape
   * difference, not a bug to fix.
   */
  getDrivers(page = 1, limit = 10): Observable<ISuccessResponse<IDriver[]>> {
    return this.http.get<ISuccessResponse<IDriver[]>>(`${this.baseUrl}/all`, { params: { page, limit } });
  }

  /** POST /driver/search already reads its filters from the body correctly. */
  searchDrivers(filters: { licenseNumber?: string; availability?: boolean; verificationStatus?: string }): Observable<ISuccessResponse<IDriver[]>> {
    return this.http.post<ISuccessResponse<IDriver[]>>(`${this.baseUrl}/search`, filters);
  }

  /**
   * The backend has no "get my driver profile" endpoint, so we find it by matching the
   * populated userId against the current user's id. Fine at this app's scale; would need
   * a dedicated backend endpoint (e.g. GET /driver/me) if the driver list grows large.
   */
  findMyDriverProfile(userId: string): Observable<IDriver | undefined> {
    return this.getDrivers(1, 100).pipe(
      map(res => {
        const list = res.data ?? [];
        return list.find(d => {
          const uid = typeof d.userId === 'string' ? d.userId : (d.userId as IUser)?._id;
          return uid === userId;
        });
      })
    );
  }
}
