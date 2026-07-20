import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

@Injectable({ providedIn: 'root' })
export class VehicleService {
  private api = inject(ApiService);

  getAll(params?: any): Observable<any> { return this.api.get('/vehicles', params); }
  getByDriver(driverId: string): Observable<any> { return this.api.get(`/vehicles/driver/${driverId}`); }
  getById(id: string): Observable<any> { return this.api.get(`/vehicles/${id}`); }
  create(data: any): Observable<any> { return this.api.post('/vehicles', data); }
  update(id: string, data: any): Observable<any> { return this.api.patch(`/vehicles/${id}`, data); }
  delete(id: string): Observable<any> { return this.api.delete(`/vehicles/${id}`); }
  uploadImage(id: string, file: File): Observable<any> {
    const fd = new FormData();
    fd.append('image', file);
    return this.api.postForm(`/vehicles/${id}/image`, fd);
  }
  deleteImage(id: string): Observable<any> { return this.api.delete(`/vehicles/${id}/image`); }
}
