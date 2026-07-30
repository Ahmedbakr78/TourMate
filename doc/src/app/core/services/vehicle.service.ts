import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../shared/src/environments/environment';
import { ISuccessResponse, IPaginateResult } from '../models/response.model';
import { IVehicle } from '../models/vehicle.model';

@Injectable({ providedIn: 'root' })
export class VehicleService {

  private readonly baseUrl = `${environment.apiUrl}/vehicle`;

  constructor(private http: HttpClient) { }

  /**
   * Single image per vehicle by design (route uses multer's `.single("image")`).
   * The backend used to crash reading req.files here; it's now fixed to read req.file,
   * so this works correctly - just one photo at a time.
   */
  createVehicle(payload: { brand: string; vehicleModel: string; capacity: number; plateNumber: string }, image?: File): Observable<ISuccessResponse<IVehicle>> {
    const formData = new FormData();
    formData.append('brand', payload.brand);
    formData.append('vehicleModel', payload.vehicleModel);
    formData.append('capacity', String(payload.capacity));
    formData.append('plateNumber', payload.plateNumber);
    if (image) formData.append('image', image);
    return this.http.post<ISuccessResponse<IVehicle>>(`${this.baseUrl}/create_vehicle`, formData);
  }

  updateVehicle(id: string, payload: Partial<{ brand: string; vehicleModel: string; capacity: number; plateNumber: string }>, image?: File): Observable<ISuccessResponse<IVehicle>> {
    const formData = new FormData();
    Object.entries(payload).forEach(([key, value]) => {
      if (value !== undefined) formData.append(key, String(value));
    });
    if (image) formData.append('image', image);
    return this.http.patch<ISuccessResponse<IVehicle>>(`${this.baseUrl}/update/${id}`, formData);
  }

  getVehicleById(id: string): Observable<ISuccessResponse<IVehicle>> {
    return this.http.get<ISuccessResponse<IVehicle>>(`${this.baseUrl}/get/${id}`);
  }

  getVehicles(page = 1, limit = 10): Observable<ISuccessResponse<IPaginateResult<IVehicle>>> {
    return this.http.get<ISuccessResponse<IPaginateResult<IVehicle>>>(`${this.baseUrl}/all`, { params: { page, limit } });
  }

  /** Now backed by a working req.query read server-side, so these filters are applied for real. */
  searchVehicles(filters: { brand?: string; plateNumber?: string; page?: number; limit?: number }): Observable<ISuccessResponse<IPaginateResult<IVehicle>>> {
    return this.http.get<ISuccessResponse<IPaginateResult<IVehicle>>>(`${this.baseUrl}/search`, { params: { ...filters } as any });
  }

  deleteVehicle(id: string): Observable<ISuccessResponse> {
    return this.http.delete<ISuccessResponse>(`${this.baseUrl}/delete/${id}`);
  }

  getDriverVehicles(driverId: string): Observable<ISuccessResponse<IVehicle[]>> {
    return this.http.get<ISuccessResponse<IVehicle[]>>(`${this.baseUrl}/driver/${driverId}`);
  }
}
