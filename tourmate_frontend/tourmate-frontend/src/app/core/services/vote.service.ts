import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ISuccessResponse } from '../models/response.model';
import { IVote } from '../models/vote.model';
import { VoteValueEnum } from '../models/enums';

@Injectable({ providedIn: 'root' })
export class VoteService {

  private readonly baseUrl = `${environment.apiUrl}/vote`;

  constructor(private http: HttpClient) { }

  /**
   * NOTE (backend behaviour): unlike the SRS description of pre-trip group voting,
   * the backend only allows voting once the trip's status is COMPLETED
   * (see tripStatusEnum.COMPLETED check in vote.service.ts), so this effectively
   * behaves as a post-trip place rating rather than itinerary planning.
   */
  createVote(payload: { tripId: string; placeId: string; voteValue: VoteValueEnum }): Observable<ISuccessResponse<IVote>> {
    return this.http.post<ISuccessResponse<IVote>>(`${this.baseUrl}/create_vote`, payload);
  }

  updateVote(id: string, voteValue: VoteValueEnum): Observable<ISuccessResponse<IVote>> {
    return this.http.patch<ISuccessResponse<IVote>>(`${this.baseUrl}/${id}/update`, { voteValue });
  }

  deleteVote(id: string): Observable<ISuccessResponse> {
    return this.http.delete<ISuccessResponse>(`${this.baseUrl}/${id}/delete`);
  }

  getPlaceVotes(tripId: string, placeId: string): Observable<ISuccessResponse<{ votes: IVote[]; likeCount: number; dislikeCount: number; score: number }>> {
    return this.http.get<ISuccessResponse<{ votes: IVote[]; likeCount: number; dislikeCount: number; score: number }>>(`${this.baseUrl}/${tripId}/place/${placeId}`);
  }

  getUserVotes(): Observable<ISuccessResponse<IVote[]>> {
    return this.http.get<ISuccessResponse<IVote[]>>(`${this.baseUrl}/user`);
  }
}
