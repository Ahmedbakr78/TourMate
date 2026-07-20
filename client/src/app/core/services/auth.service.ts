import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map, tap } from 'rxjs';
import { ApiService } from './api.service';
import { AuthResponse, Role, User } from '../models/user.model';

const TOKEN_KEY = 'tm_token';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  constructor(private api: ApiService) {
    this.hydrate();
  }

  private normalizeRole(user: User): User {
    return { ...user, role: user.role?.toLowerCase() as Role };
  }

  private hydrate() {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        this.currentUserSubject.next(this.normalizeRole(payload as User));
      } catch {
        localStorage.removeItem(TOKEN_KEY);
      }
    }
  }

  login(email: string, password: string): Observable<AuthResponse> {
    return this.api.post<{ status: string; data: AuthResponse }>('/auth/login', { email, password }).pipe(
      tap((res) => this.setSession(res.data)),
      map((res) => res.data)
    );
  }

  register(payload: {
    name: string;
    email: string;
    password: string;
    role: Role;
  }): Observable<AuthResponse> {
    return this.api.post<{ status: string; data: AuthResponse }>('/auth/register', payload).pipe(
      tap((res) => this.setSession(res.data)),
      map((res) => res.data)
    );
  }

  forgotPassword(email: string): Observable<{ status: string }> {
    return this.api.post<{ status: string }>('/auth/forgot-password', { email });
  }

  verifyEmail(email: string, otp: string): Observable<any> {
    return this.api.post('/auth/verify-email', { email, otp });
  }

  resendVerification(email: string): Observable<any> {
    return this.api.post('/auth/resend-verification', { email });
  }

  changePassword(currentPassword: string, newPassword: string): Observable<any> {
    return this.api.patch('/auth/change-password', { currentPassword, newPassword });
  }

  private setSession(res: AuthResponse) {
    localStorage.setItem(TOKEN_KEY, res.token);
    this.currentUserSubject.next(this.normalizeRole(res.user));
  }

  get token(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  get user(): User | null {
    return this.currentUserSubject.value;
  }

  isAuthenticated(): boolean {
    return !!this.token;
  }

  hasRole(...roles: Role[]): boolean {
    const u = this.currentUserSubject.value;
    return (
      !!u && roles.map((r) => r.toUpperCase()).includes(u.role.toUpperCase())
    );
  }

  updateCurrentUser(data: Partial<User>) {
    const current = this.currentUserSubject.value;
    if (current) {
      this.currentUserSubject.next({ ...current, ...data });
    }
  }

  logout() {
    localStorage.removeItem(TOKEN_KEY);
    this.currentUserSubject.next(null);
  }
}
