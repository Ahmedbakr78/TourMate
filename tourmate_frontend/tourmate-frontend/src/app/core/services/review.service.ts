import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ISuccessResponse, IPaginateResult } from '../models/response.model';
import { IReview } from '../models/review.model';

@Injectable({ providedIn: 'root' })
export class ReviewService {

  private readonly baseUrl = `${environment.apiUrl}/review`;

  constructor(private http: HttpClient) { }

  createReview(payload: { tripId: string; placeId?: string; guideId?: string; driverId?: string; rating: number; comment?: string }): Observable<ISuccessResponse<IReview>> {
    return this.http.post<ISuccessResponse<IReview>>(`${this.baseUrl}/create_review`, payload);
  }

  getReviews(page = 1, limit = 10): Observable<ISuccessResponse<IPaginateResult<IReview>>> {
    return this.http.get<ISuccessResponse<IPaginateResult<IReview>>>(`${this.baseUrl}/all`, { params: { page, limit } });
  }

  getReviewById(id: string): Observable<ISuccessResponse<IReview>> {
    return this.http.get<ISuccessResponse<IReview>>(`${this.baseUrl}/get/${id}`);
  }

  updateReview(id: string, payload: Partial<{ rating: number; comment: string }>): Observable<ISuccessResponse<IReview>> {
    return this.http.patch<ISuccessResponse<IReview>>(`${this.baseUrl}/${id}/update`, payload);
  }

  deleteReview(id: string): Observable<ISuccessResponse> {
    return this.http.delete<ISuccessResponse>(`${this.baseUrl}/${id}/delete`);
  }

  getTripReviews(tripId: string): Observable<ISuccessResponse<IReview[]>> {
    return this.http.get<ISuccessResponse<IReview[]>>(`${this.baseUrl}/${tripId}/reviews`);
  }

  getPlaceReviews(placeId: string): Observable<ISuccessResponse<{ averageRating: number; reviewsCount: number; reviews: IReview[] }>> {
    return this.http.get<ISuccessResponse<{ averageRating: number; reviewsCount: number; reviews: IReview[] }>>(`${this.baseUrl}/${placeId}/place_reviews`);
  }
}
