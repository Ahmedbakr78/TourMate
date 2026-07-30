import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ISuccessResponse } from '../models/response.model';
import { ILostItem } from '../models/lost-item.model';
import { LostItemStatusEnum } from '../models/enums';

@Injectable({ providedIn: 'root' })
export class LostItemService {

  private readonly baseUrl = `${environment.apiUrl}/lost_item`;

  constructor(private http: HttpClient) { }

  /** Image upload now works - the backend has multer middleware attached to this route. */
  createLostItem(payload: { tripId: string; title: string; description?: string }, image?: File): Observable<ISuccessResponse<ILostItem>> {
    const formData = new FormData();
    formData.append('tripId', payload.tripId);
    formData.append('title', payload.title);
    if (payload.description) formData.append('description', payload.description);
    if (image) formData.append('image', image);
    return this.http.post<ISuccessResponse<ILostItem>>(`${this.baseUrl}/create_lost_item`, formData);
  }

  updateLostItem(id: string, payload: Partial<{ title: string; description: string }>): Observable<ISuccessResponse<ILostItem>> {
    return this.http.patch<ISuccessResponse<ILostItem>>(`${this.baseUrl}/${id}/update`, payload);
  }

  updateLostItemStatus(id: string, status: LostItemStatusEnum): Observable<ISuccessResponse<ILostItem>> {
    return this.http.patch<ISuccessResponse<ILostItem>>(`${this.baseUrl}/${id}/status`, { status });
  }

  deleteLostItem(id: string): Observable<ISuccessResponse> {
    return this.http.delete<ISuccessResponse>(`${this.baseUrl}/${id}/delete`);
  }

  getLostItem(id: string): Observable<ISuccessResponse<ILostItem>> {
    return this.http.get<ISuccessResponse<ILostItem>>(`${this.baseUrl}/get/${id}`);
  }

  getTripLostItems(tripId: string): Observable<ISuccessResponse<ILostItem[]>> {
    return this.http.get<ISuccessResponse<ILostItem[]>>(`${this.baseUrl}/${tripId}/trip_lost_items`);
  }

  getMyLostItems(): Observable<ISuccessResponse<ILostItem[]>> {
    return this.http.get<ISuccessResponse<ILostItem[]>>(`${this.baseUrl}/my_lost_items`);
  }
}
