import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

@Injectable({ providedIn: 'root' })
export class LostItemService {
  private api = inject(ApiService);

  getAll(params?: any): Observable<any> { return this.api.get('/lost-items', params); }
  getById(id: string): Observable<any> { return this.api.get(`/lost-items/${id}`); }
  create(data: any): Observable<any> { return this.api.post('/lost-items', data); }
  update(id: string, data: any): Observable<any> { return this.api.patch(`/lost-items/${id}`, data); }
  updateStatus(id: string, found: boolean): Observable<any> { return this.api.patch(`/lost-items/${id}/status`, { found }); }
  delete(id: string): Observable<any> { return this.api.delete(`/lost-items/${id}`); }
  getMy(): Observable<any> { return this.api.get('/lost-items/my'); }
  getTripItems(tripId: string): Observable<any> { return this.api.get(`/lost-items/trip/${tripId}`); }
  reportFound(id: string): Observable<any> { return this.api.patch(`/lost-items/${id}/report-found`, {}); }
  close(id: string): Observable<any> { return this.api.patch(`/lost-items/${id}/close`, {}); }
  reopen(id: string): Observable<any> { return this.api.patch(`/lost-items/${id}/reopen`, {}); }
}
