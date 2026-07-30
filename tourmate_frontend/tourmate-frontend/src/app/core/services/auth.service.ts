import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { RoleEnum } from '../models/enums';
import { ISuccessResponse } from '../models/response.model';
import { IUser } from '../models/user.model';
import { TokenStorageService } from './token-storage.service';
import { SocketService } from './socket.service';

interface ITokensPayload {
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
}

@Injectable({ providedIn: 'root' })
export class AuthService {

  private readonly baseUrl = `${environment.apiUrl}/auth`;
  private readonly userUrl = `${environment.apiUrl}/user`;

  private currentUserSubject = new BehaviorSubject<IUser | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private http: HttpClient,
    private tokenStorage: TokenStorageService,
    private socketService: SocketService
  ) { }

  // ----- Auth endpoints -----

  signUp(payload: { name: string; email: string; password: string; phone: string; gender: string }): Observable<ISuccessResponse<IUser>> {
    return this.http.post<ISuccessResponse<IUser>>(`${this.baseUrl}/signup`, payload);
  }

  confirmEmail(payload: { email: string; otp: string }): Observable<ISuccessResponse> {
    return this.http.post<ISuccessResponse>(`${this.baseUrl}/confirm_email`, payload);
  }

  sendOtpAgain(payload: { email: string }): Observable<ISuccessResponse> {
    return this.http.post<ISuccessResponse>(`${this.baseUrl}/send_otp_again`, payload);
  }

  signIn(payload: { email: string; password: string }): Observable<ISuccessResponse<ITokensPayload>> {
    return this.http.post<ISuccessResponse<ITokensPayload>>(`${this.baseUrl}/signin`, payload).pipe(
      tap(res => {
        if (res.data?.tokens) {
          this.tokenStorage.saveTokens(res.data.tokens.accessToken, res.data.tokens.refreshToken);
          this.fetchCurrentUser().subscribe();
        }
      })
    );
  }

  refreshToken(): Observable<ISuccessResponse<{ accessToken: string }>> {
    const refreshToken = this.tokenStorage.getRefreshToken();
    return this.http.post<ISuccessResponse<{ accessToken: string }>>(`${this.baseUrl}/refresh_token`, { refreshToken }).pipe(
      tap(res => {
        if (res.data?.accessToken) {
          this.tokenStorage.updateAccessToken(res.data.accessToken);
        }
      })
    );
  }

  logOut(): Observable<ISuccessResponse> {
    return this.http.post<ISuccessResponse>(`${this.baseUrl}/logout`, {}).pipe(
      tap(() => this.clearSession())
    );
  }

  /** Clears local session without calling the API (used when the refresh token itself is invalid). */
  clearSession(): void {
    this.tokenStorage.clear();
    this.currentUserSubject.next(null);
    this.socketService.disconnect();
  }

  forgotPassword(payload: { email: string }): Observable<ISuccessResponse> {
    return this.http.post<ISuccessResponse>(`${this.baseUrl}/forgot_password`, payload);
  }

  resetPassword(payload: { email: string; otp: string; newPassword: string }): Observable<ISuccessResponse> {
    return this.http.patch<ISuccessResponse>(`${this.baseUrl}/reset_password`, payload);
  }

  changePassword(payload: { oldPassword: string; newPassword: string }): Observable<ISuccessResponse> {
    return this.http.patch<ISuccessResponse>(`${this.baseUrl}/change_password`, payload);
  }

  // ----- Session helpers -----

  fetchCurrentUser(): Observable<ISuccessResponse<IUser>> {
    return this.http.get<ISuccessResponse<IUser>>(`${this.userUrl}/current_user_id`).pipe(
      tap(res => {
        if (res.data) {
          this.currentUserSubject.next(res.data);
          this.socketService.connect();
        }
      })
    );
  }

  get currentUser(): IUser | null {
    return this.currentUserSubject.value;
  }

  isLoggedIn(): boolean {
    return this.tokenStorage.hasToken();
  }

  hasRole(...roles: RoleEnum[]): boolean {
    const role = this.currentUser?.role;
    return !!role && roles.includes(role);
  }
}
