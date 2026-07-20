import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

@Injectable({ providedIn: 'root' })
export class GuideService {
  private api = inject(ApiService);

  getAll(params?: any): Observable<any> { return this.api.get('/guides', params); }
  getById(id: string): Observable<any> { return this.api.get(`/guides/${id}`); }
  search(params: any): Observable<any> { return this.api.get('/guides/search', params); }
  updateAvailability(id: string, availability: string): Observable<any> { return this.api.patch(`/guides/${id}/availability`, { availability }); }
  uploadCertificate(id: string, file: File): Observable<any> {
    const fd = new FormData();
    fd.append('certificate', file);
    return this.api.postForm(`/guides/${id}/certificate`, fd);
  }
}
