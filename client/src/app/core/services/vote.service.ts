import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

@Injectable({ providedIn: 'root' })
export class VoteService {
  private api = inject(ApiService);

  create(data: any): Observable<any> { return this.api.post('/votes', data); }
  update(id: string, data: any): Observable<any> { return this.api.patch(`/votes/${id}`, data); }
  delete(id: string): Observable<any> { return this.api.delete(`/votes/${id}`); }
  getPlaceVotes(placeId: string): Observable<any> { return this.api.get(`/votes/place/${placeId}`); }
  getUserVotes(): Observable<any> { return this.api.get('/votes/user'); }
}
