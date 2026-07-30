import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ISuccessResponse, IPaginateResult } from '../models/response.model';
import { IUser } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class UserService {

  private readonly baseUrl = `${environment.apiUrl}/user`;

  constructor(private http: HttpClient) { }

  getCurrentUserId(): Observable<ISuccessResponse<IUser>> {
    return this.http.get<ISuccessResponse<IUser>>(`${this.baseUrl}/current_user_id`);
  }

  getUsers(page = 1, limit = 10): Observable<ISuccessResponse<IPaginateResult<IUser>>> {
    return this.http.get<ISuccessResponse<IPaginateResult<IUser>>>(`${this.baseUrl}/users`, {
      params: { page, limit }
    });
  }

  updateUser(payload: { name?: string; phone?: string; gender?: string }): Observable<ISuccessResponse<IUser>> {
    return this.http.put<ISuccessResponse<IUser>>(`${this.baseUrl}/update_user`, payload);
  }

  uploadProfileImage(file: File): Observable<ISuccessResponse<IUser>> {
    const formData = new FormData();
    formData.append('profile_image', file);
    return this.http.post<ISuccessResponse<IUser>>(`${this.baseUrl}/profile_image`, formData);
  }

  deleteProfileImage(): Observable<ISuccessResponse> {
    return this.http.delete<ISuccessResponse>(`${this.baseUrl}/delete_image`);
  }

  deleteAccount(): Observable<ISuccessResponse> {
    return this.http.delete<ISuccessResponse>(`${this.baseUrl}/delete_account`);
  }

  getUserById(id: string): Observable<ISuccessResponse<IUser>> {
    return this.http.get<ISuccessResponse<IUser>>(`${this.baseUrl}/${id}`);
  }
}
