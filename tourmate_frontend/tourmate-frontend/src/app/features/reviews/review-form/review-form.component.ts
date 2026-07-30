import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ReviewService } from 'src/app/core/services/review.service';
import { TripService } from 'src/app/core/services/trip.service';
import { ITrip } from 'src/app/core/models/trip.model';

@Component({
  selector: 'app-review-form',
  templateUrl: './review-form.component.html',
  styleUrls: ['./review-form.component.scss']
})
export class ReviewFormComponent implements OnInit {

  isEdit = false;
  reviewId: string | null = null;
  loading = false;
  saving = false;

  trips: ITrip[] = [];
  hoverRating = 0;

  form = this.fb.group({
    tripId: ['', Validators.required],
    targetType: ['place', Validators.required],
    targetId: [''],
    rating: [0, [Validators.required, Validators.min(1), Validators.max(5)]],
    comment: ['']
  });

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private reviewService: ReviewService,
    private tripService: TripService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.reviewId = this.route.snapshot.paramMap.get('id');
    this.isEdit = !!this.reviewId;

    this.loadTrips();

    if (this.isEdit && this.reviewId) {
      this.loading = true;
      this.reviewService.getReviewById(this.reviewId).subscribe({
        next: res => {
          this.loading = false;
          const review = res.data;
          if (!review) return;
          const targetType = review.placeId ? 'place' : review.guideId ? 'guide' : review.driverId ? 'driver' : 'trip';
          this.form.patchValue({
            tripId: typeof review.tripId === 'string' ? review.tripId : review.tripId?._id,
            targetType,
            targetId: review.placeId ? (typeof review.placeId === 'string' ? review.placeId : review.placeId?._id)
                       : review.guideId ? (typeof review.guideId === 'string' ? review.guideId : review.guideId?._id)
                       : review.driverId ? (typeof review.driverId === 'string' ? review.driverId : review.driverId?._id)
                       : '',
            rating: review.rating,
            comment: review.comment
          });
        },
        error: err => {
          this.loading = false;
          this.snackBar.open(err?.error?.error?.message || 'Failed to load review', 'Close', { duration: 4000 });
        }
      });
    }
  }

  loadTrips(): void {
    this.tripService.getMyTrips(1, 50).subscribe({
      next: res => {
        this.trips = res.data?.docs ?? [];
      }
    });
  }

  setRating(value: number): void {
    this.form.get('rating')?.setValue(value);
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.snackBar.open('Please fill in all required fields.', 'Close', { duration: 3000 });
      return;
    }

    this.saving = true;
    const raw = this.form.value;

    const payload: {
      tripId: string;
      placeId?: string;
      guideId?: string;
      driverId?: string;
      rating: number;
      comment?: string;
    } = {
      tripId: raw.tripId!,
      rating: raw.rating!,
      comment: raw.comment || undefined
    };

    if (raw.targetType === 'place' && raw.targetId) payload.placeId = raw.targetId;
    if (raw.targetType === 'guide' && raw.targetId) payload.guideId = raw.targetId;
    if (raw.targetType === 'driver' && raw.targetId) payload.driverId = raw.targetId;

    if (this.isEdit && this.reviewId) {
      this.reviewService.updateReview(this.reviewId, {
        rating: raw.rating!,
        comment: raw.comment || undefined
      }).subscribe({
        next: () => {
          this.saving = false;
          this.snackBar.open('Review updated', 'Close', { duration: 3000 });
          this.router.navigate(['/reviews']);
        },
        error: err => {
          this.saving = false;
          this.snackBar.open(err?.error?.error?.message || 'Update failed', 'Close', { duration: 4000 });
        }
      });
    } else {
      this.reviewService.createReview(payload).subscribe({
        next: () => {
          this.saving = false;
          this.snackBar.open('Review created', 'Close', { duration: 3000 });
          this.router.navigate(['/reviews']);
        },
        error: err => {
          this.saving = false;
          this.snackBar.open(err?.error?.error?.message || 'Creation failed', 'Close', { duration: 4000 });
        }
      });
    }
  }
}
