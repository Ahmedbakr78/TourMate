import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

@Injectable({ providedIn: 'root' })
export class DriverService {
  private api = inject(ApiService);

  getAll(params?: any): Observable<any> { return this.api.get('/drivers', params); }
  getById(id: string): Observable<any> { return this.api.get(`/drivers/${id}`); }
  search(params: any): Observable<any> { return this.api.get('/drivers/search', params); }
  updateAvailability(id: string, availability: string): Observable<any> { return this.api.patch(`/drivers/${id}/availability`, { availability }); }
}
