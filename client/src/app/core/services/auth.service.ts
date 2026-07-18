import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { ApiService } from './api.service';
import { AuthResponse, Role, User } from '../models/user.model';

const TOKEN_KEY = 'tm_token';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  constructor(private api: ApiService, private http: HttpClient) {
    this.hydrate();
  }

  private hydrate() {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        this.currentUserSubject.next(payload as User);
      } catch {
        localStorage.removeItem(TOKEN_KEY);
      }
    }
  }

  login(email: string, password: string): Observable<AuthResponse> {
    return this.api.post<AuthResponse>('/auth/login', { email, password }).pipe(
      tap((res) => this.setSession(res))
    );
  }

  register(payload: {
    name: string;
    email: string;
    password: string;
    role: Role;
  }): Observable<AuthResponse> {
    return this.api.post<AuthResponse>('/auth/register', payload).pipe(
      tap((res) => this.setSession(res))
    );
  }

  forgotPassword(email: string): Observable<{ status: string }> {
    return this.api.post<{ status: string }>('/auth/forgot', { email });
  }

  private setSession(res: AuthResponse) {
    localStorage.setItem(TOKEN_KEY, res.token);
    this.currentUserSubject.next(res.user);
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

  logout() {
    localStorage.removeItem(TOKEN_KEY);
    this.currentUserSubject.next(null);
  }
}
