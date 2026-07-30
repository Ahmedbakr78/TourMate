import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ReviewService } from 'src/app/core/services/review.service';
import { IReview } from 'src/app/core/models/review.model';

type ReviewType = 'trip' | 'place' | 'guide' | 'driver';

@Component({
  selector: 'app-review-list',
  templateUrl: './review-list.component.html',
  styleUrls: ['./review-list.component.scss']
})
export class ReviewListComponent implements OnInit {

  reviews: IReview[] = [];
  filteredReviews: IReview[] = [];
  loading = false;
  page = 1;
  limit = 10;
  totalDocs = 0;

  activeFilter: ReviewType | 'all' = 'all';
  reviewTypes: { label: string; value: ReviewType | 'all' }[] = [
    { label: 'All', value: 'all' },
    { label: 'Trip', value: 'trip' },
    { label: 'Place', value: 'place' },
    { label: 'Guide', value: 'guide' },
    { label: 'Driver', value: 'driver' }
  ];

  displayedColumns = ['reviewer', 'type', 'rating', 'comment', 'date', 'actions'];

  constructor(
    private reviewService: ReviewService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.loadReviews();
  }

  loadReviews(): void {
    this.loading = true;
    this.reviewService.getReviews(this.page, this.limit).subscribe({
      next: res => {
        this.loading = false;
        this.reviews = res.data?.docs ?? [];
        this.totalDocs = res.data?.totalDocs ?? 0;
        this.applyFilter();
      },
      error: err => {
        this.loading = false;
        this.snackBar.open(err?.error?.error?.message || 'Failed to load reviews', 'Close', { duration: 4000 });
      }
    });
  }

  onPageChange(event: { pageIndex: number; pageSize: number }): void {
    this.page = event.pageIndex + 1;
    this.limit = event.pageSize;
    this.loadReviews();
  }

  setFilter(type: ReviewType | 'all'): void {
    this.activeFilter = type;
    this.applyFilter();
  }

  applyFilter(): void {
    if (this.activeFilter === 'all') {
      this.filteredReviews = this.reviews;
    } else {
      this.filteredReviews = this.reviews.filter(r => this.getReviewType(r) === this.activeFilter);
    }
  }

  getReviewType(review: IReview): ReviewType {
    if (review.placeId) return 'place';
    if (review.guideId) return 'guide';
    if (review.driverId) return 'driver';
    return 'trip';
  }

  getReviewerName(review: IReview): string {
    if (review.touristId && typeof review.touristId === 'object') {
      return review.touristId.name;
    }
    return review.touristId?.toString() ?? 'Unknown';
  }

  stars(rating: number): string[] {
    return Array(5).fill(0).map((_, i) => i < rating ? '★' : '☆');
  }

  viewDetail(review: IReview): void {
  }
}
