import { Injectable } from '@angular/core';
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, filter, switchMap, take, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { TokenStorageService } from '../services/token-storage.service';
import { AuthService } from '../services/auth.service';

// Endpoints that must NOT get an Authorization header attached, or that must not
// trigger a refresh-and-retry loop on failure (they're part of the auth flow itself).
const PUBLIC_AUTH_PATHS = ['/auth/signup', '/auth/signin', '/auth/refresh_token', '/auth/confirm_email', '/auth/send_otp_again'];

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  private isRefreshing = false;
  private refreshTokenSubject = new BehaviorSubject<string | null>(null);

  constructor(
    private tokenStorage: TokenStorageService,
    private authService: AuthService,
    private router: Router
  ) { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {

    const isPublicAuthPath = PUBLIC_AUTH_PATHS.some(path => request.url.includes(path));
    const token = this.tokenStorage.getAccessToken();

    let authRequest = request;
    if (token && !isPublicAuthPath) {
      authRequest = this.addToken(request, token);
    }

    return next.handle(authRequest).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401 && !isPublicAuthPath) {
          return this.handle401Error(request, next);
        }
        return throwError(() => error);
      })
    );
  }

  private addToken(request: HttpRequest<unknown>, token: string): HttpRequest<unknown> {
    return request.clone({
      setHeaders: { Authorization: `${environment.jwtPrefix} ${token}` }
    });
  }

  private handle401Error(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {

    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);

      const refreshToken = this.tokenStorage.getRefreshToken();
      if (!refreshToken) {
        this.isRefreshing = false;
        this.authService.clearSession();
        this.router.navigate(['/auth/login']);
        return throwError(() => new Error('No refresh token available'));
      }

      return this.authService.refreshToken().pipe(
        switchMap(res => {
          this.isRefreshing = false;
          const newAccessToken = res.data?.accessToken as string;
          this.refreshTokenSubject.next(newAccessToken);
          return next.handle(this.addToken(request, newAccessToken));
        }),
        catchError(err => {
          this.isRefreshing = false;
          this.authService.clearSession();
          this.router.navigate(['/auth/login']);
          return throwError(() => err);
        })
      );
    }

    return this.refreshTokenSubject.pipe(
      filter(token => token !== null),
      take(1),
      switchMap(token => next.handle(this.addToken(request, token as string)))
    );
  }
}
