import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ApiService {
  readonly baseUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) {}

  private toParams(params?: any): HttpParams | undefined {
    if (!params) return undefined;
    let httpParams = new HttpParams();
    for (const key of Object.keys(params)) {
      if (params[key] !== undefined && params[key] !== null) {
        httpParams = httpParams.set(key, String(params[key]));
      }
    }
    return httpParams;
  }

  get<T>(path: string, params?: any): Observable<T> {
    return this.http.get<T>(`${this.baseUrl}${path}`, { params: this.toParams(params) });
  }

  post<T>(path: string, body: unknown): Observable<T> {
    return this.http.post<T>(`${this.baseUrl}${path}`, body);
  }

  postForm<T>(path: string, formData: FormData): Observable<T> {
    return this.http.post<T>(`${this.baseUrl}${path}`, formData);
  }

  patch<T>(path: string, body: unknown): Observable<T> {
    return this.http.patch<T>(`${this.baseUrl}${path}`, body);
  }

  delete<T>(path: string): Observable<T> {
    return this.http.delete<T>(`${this.baseUrl}${path}`);
  }
}
