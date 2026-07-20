import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

@Injectable({ providedIn: 'root' })
export class AdminService {
  private api = inject(ApiService);

  getUsers(params?: any): Observable<any> { return this.api.get('/admin/users', params); }
  getUserById(id: string): Observable<any> { return this.api.get(`/admin/users/${id}`); }
  blockUser(id: string): Observable<any> { return this.api.patch(`/admin/users/${id}/block`, {}); }
  unblockUser(id: string): Observable<any> { return this.api.patch(`/admin/users/${id}/unblock`, {}); }
  deleteUser(id: string): Observable<any> { return this.api.delete(`/admin/users/${id}`); }
  deleteTrip(id: string): Observable<any> { return this.api.delete(`/admin/trips/${id}`); }
  approveGuide(id: string): Observable<any> { return this.api.patch(`/admin/guides/${id}/approve`, {}); }
  rejectGuide(id: string): Observable<any> { return this.api.patch(`/admin/guides/${id}/reject`, {}); }
  approveDriver(id: string): Observable<any> { return this.api.patch(`/admin/drivers/${id}/approve`, {}); }
  rejectDriver(id: string): Observable<any> { return this.api.patch(`/admin/drivers/${id}/reject`, {}); }
  getStats(): Observable<any> { return this.api.get('/admin/stats'); }
  getReports(): Observable<any> { return this.api.get('/admin/reports'); }
  getPendingGuides(): Observable<any> { return this.api.get('/admin/guides/pending'); }
  getPendingDrivers(): Observable<any> { return this.api.get('/admin/drivers/pending'); }
}
