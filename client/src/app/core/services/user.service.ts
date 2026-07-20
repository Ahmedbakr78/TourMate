import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

@Injectable({ providedIn: 'root' })
export class UserService {
  private api = inject(ApiService);

  getProfile(): Observable<any> { return this.api.get('/users/me'); }
  updateProfile(data: any): Observable<any> { return this.api.patch('/users/me', data); }
  uploadImage(file: File): Observable<any> {
    const fd = new FormData();
    fd.append('image', file);
    return this.api.postForm('/users/profile-image', fd);
  }
  deleteImage(): Observable<any> { return this.api.delete('/users/profile-image'); }
  deleteAccount(): Observable<any> { return this.api.delete('/users/account'); }
}
