import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ISuccessResponse } from '../models/response.model';
import { INotification } from '../models/notification.model';

@Injectable({ providedIn: 'root' })
export class NotificationService {

  private readonly baseUrl = `${environment.apiUrl}/notifications`;

  constructor(private http: HttpClient) { }

  getNotifications(page = 1, limit = 10): Observable<ISuccessResponse<{ unreadCount: number; notifications: INotification[] }>> {
    return this.http.get<ISuccessResponse<{ unreadCount: number; notifications: INotification[] }>>(`${this.baseUrl}/notifications`, { params: { page, limit } });
  }

  getNotificationById(id: string): Observable<ISuccessResponse<INotification>> {
    return this.http.get<ISuccessResponse<INotification>>(`${this.baseUrl}/get/${id}`);
  }

  markAsRead(id: string): Observable<ISuccessResponse<INotification>> {
    return this.http.patch<ISuccessResponse<INotification>>(`${this.baseUrl}/${id}/mark-as-read`, {});
  }

  markAllAsRead(): Observable<ISuccessResponse> {
    return this.http.patch<ISuccessResponse>(`${this.baseUrl}/mark-all-as-read`, {});
  }

  deleteNotification(id: string): Observable<ISuccessResponse> {
    return this.http.delete<ISuccessResponse>(`${this.baseUrl}/${id}/delete`);
  }
}
