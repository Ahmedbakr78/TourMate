import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private api = inject(ApiService);

  getAll(params?: any): Observable<any> { return this.api.get('/notifications', params); }
  getById(id: string): Observable<any> { return this.api.get(`/notifications/${id}`); }
  create(data: any): Observable<any> { return this.api.post('/notifications', data); }
  markAsRead(id: string): Observable<any> { return this.api.patch(`/notifications/${id}/read`, {}); }
  markAllAsRead(): Observable<any> { return this.api.patch('/notifications/read-all', {}); }
  delete(id: string): Observable<any> { return this.api.delete(`/notifications/${id}`); }
  deleteAll(): Observable<any> { return this.api.delete('/notifications'); }
  getUnreadCount(): Observable<any> { return this.api.get('/notifications/unread-count'); }
}
