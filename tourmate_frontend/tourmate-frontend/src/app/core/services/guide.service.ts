import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ISuccessResponse, IPaginateResult } from '../models/response.model';
import { IGuide } from '../models/guide.model';
import { IUser } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class GuideService {

  private readonly baseUrl = `${environment.apiUrl}/guide`;

  constructor(private http: HttpClient) { }

  createGuide(payload: { userId: string; languages: string[]; experience: number }, certificate?: File): Observable<ISuccessResponse<{ guide: IGuide; user: IUser }>> {
    const formData = new FormData();
    formData.append('userId', payload.userId);
    payload.languages.forEach(lang => formData.append('languages[]', lang));
    formData.append('experience', String(payload.experience));
    if (certificate) formData.append('certificate', certificate);
    return this.http.post<ISuccessResponse<{ guide: IGuide; user: IUser }>>(`${this.baseUrl}/create_guide`, formData);
  }

  /** Certificate re-upload now works: the backend attaches upload middleware on this route too. */
  updateGuide(id: string, payload: Partial<{ languages: string[]; experience: number; availability: boolean }>, certificate?: File): Observable<ISuccessResponse<IGuide>> {
    const formData = new FormData();
    if (payload.languages) payload.languages.forEach(lang => formData.append('languages[]', lang));
    if (payload.experience !== undefined) formData.append('experience', String(payload.experience));
    if (payload.availability !== undefined) formData.append('availability', String(payload.availability));
    if (certificate) formData.append('certificate', certificate);
    return this.http.patch<ISuccessResponse<IGuide>>(`${this.baseUrl}/update/${id}`, formData);
  }

  deleteGuide(id: string): Observable<ISuccessResponse> {
    return this.http.delete<ISuccessResponse>(`${this.baseUrl}/delete/${id}`);
  }

  getGuideById(id: string): Observable<ISuccessResponse<IGuide>> {
    return this.http.get<ISuccessResponse<IGuide>>(`${this.baseUrl}/get/${id}`);
  }

  getGuides(page = 1, limit = 10): Observable<ISuccessResponse<IPaginateResult<IGuide>>> {
    return this.http.get<ISuccessResponse<IPaginateResult<IGuide>>>(`${this.baseUrl}/all`, { params: { page, limit } });
  }

  /** Now backed by a working req.query read server-side, so these filters are applied for real. */
  searchGuides(filters: { language?: string; availability?: boolean; verificationStatus?: string; page?: number; limit?: number }): Observable<ISuccessResponse<IPaginateResult<IGuide>>> {
    const params: Record<string, string> = {};
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') params[key] = String(value);
    });
    return this.http.get<ISuccessResponse<IPaginateResult<IGuide>>>(`${this.baseUrl}/search`, { params });
  }

  /**
   * The backend has no "get my guide profile" endpoint, so we find it by matching the
   * populated userId against the current user's id. Fine at this app's scale; would need
   * a dedicated backend endpoint (e.g. GET /guide/me) if the guide list grows large.
   */
  findMyGuideProfile(userId: string): Observable<IGuide | undefined> {
    return this.getGuides(1, 100).pipe(
      map(res => {
        const list = res.data?.docs ?? [];
        return list.find(g => {
          const uid = typeof g.userId === 'string' ? g.userId : (g.userId as IUser)?._id;
          return uid === userId;
        });
      })
    );
  }
}
