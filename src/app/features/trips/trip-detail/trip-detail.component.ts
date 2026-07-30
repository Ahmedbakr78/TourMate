import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { TripService } from '../../../core/services/trip.service';
import { VoteService } from '../../../core/services/vote.service';
import { ReviewService } from '../../../core/services/review.service';
import { LostItemService } from '../../../core/services/lost-item.service';
import { ITrip } from '../../../core/models/trip.model';
import { IPlace } from '../../../core/models/place.model';
import { IReview } from '../../../core/models/review.model';
import { ILostItem } from '../../../core/models/lost-item.model';
import { TripStatusEnum, VoteValueEnum } from '../../../../../../shared/src/app/core/models/enums';
import { ConfirmDialogComponent } from '../../../../../../shared/src/app/shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-trip-detail',
  templateUrl: './trip-detail.component.html',
  styleUrls: ['./trip-detail.component.scss']
})
export class TripDetailComponent implements OnInit {

  tripId!: string;
  trip: ITrip | null = null;
  loading = false;
  tripStatusEnum = TripStatusEnum;
  voteValueEnum = VoteValueEnum;

  reviews: IReview[] = [];
  lostItems: ILostItem[] = [];

  reviewForm = this.fb.group({
    placeId: [null as string | null],
    rating: [5, [Validators.required, Validators.min(1), Validators.max(5)]],
    comment: ['']
  });

  lostItemForm = this.fb.group({
    title: ['', Validators.required],
    description: ['']
  });

  submittingReview = false;
  submittingLostItem = false;
  lostItemImage?: File;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private tripService: TripService,
    private voteService: VoteService,
    private reviewService: ReviewService,
    private lostItemService: LostItemService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.tripId = this.route.snapshot.paramMap.get('id')!;
    this.loadTrip();
    this.loadReviews();
    this.loadLostItems();
  }

  loadTrip(): void {
    this.loading = true;
    this.tripService.getTripById(this.tripId).subscribe({
      next: res => {
        this.loading = false;
        this.trip = res.data ?? null;
      },
      error: err => {
        this.loading = false;
        this.snackBar.open(err?.error?.error?.message || 'Failed to load trip', 'Close', { duration: 4000 });
      }
    });
  }

  loadReviews(): void {
    this.reviewService.getTripReviews(this.tripId).subscribe({
      next: res => (this.reviews = res.data ?? []),
      error: () => { }
    });
  }

  loadLostItems(): void {
    this.lostItemService.getTripLostItems(this.tripId).subscribe({
      next: res => (this.lostItems = res.data ?? []),
      error: () => { }
    });
  }

  get places(): IPlace[] {
    return (this.trip?.places as IPlace[]) ?? [];
  }

  cancelTrip(): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: { title: 'Cancel trip', message: 'Are you sure you want to cancel this trip?' }
    });
    dialogRef.afterClosed().subscribe(confirmed => {
      if (!confirmed) return;
      this.tripService.cancelTrip(this.tripId).subscribe({
        next: () => {
          this.snackBar.open('Trip cancelled', 'Close', { duration: 3000 });
          this.loadTrip();
        },
        error: err => this.snackBar.open(err?.error?.error?.message || 'Cancel failed', 'Close', { duration: 4000 })
      });
    });
  }

  joinTrip(): void {
    this.tripService.joinSharedTrip(this.tripId, 1).subscribe({
      next: () => {
        this.snackBar.open('Joined the shared trip!', 'Close', { duration: 3000 });
        this.loadTrip();
      },
      error: err => this.snackBar.open(err?.error?.error?.message || 'Could not join trip', 'Close', { duration: 4000 })
    });
  }

  /**
   * NOTE (backend behaviour): voting is only accepted once trip.status === COMPLETED,
   * so this button is only meaningful after the trip is marked complete by an admin/driver.
   */
  vote(placeId: string, value: VoteValueEnum): void {
    this.voteService.createVote({ tripId: this.tripId, placeId, voteValue: value }).subscribe({
      next: () => this.snackBar.open('Vote recorded', 'Close', { duration: 2500 }),
      error: err => this.snackBar.open(err?.error?.error?.message || 'Voting failed (trip may not be completed yet)', 'Close', { duration: 4000 })
    });
  }

  submitReview(): void {
    if (this.reviewForm.invalid) return;
    this.submittingReview = true;
    const raw = this.reviewForm.getRawValue();

    this.reviewService.createReview({
      tripId: this.tripId,
      placeId: raw.placeId ?? undefined,
      rating: raw.rating!,
      comment: raw.comment ?? undefined
    }).subscribe({
      next: () => {
        this.submittingReview = false;
        this.reviewForm.reset({ rating: 5, comment: '', placeId: null });
        this.snackBar.open('Review submitted', 'Close', { duration: 3000 });
        this.loadReviews();
      },
      error: err => {
        this.submittingReview = false;
        this.snackBar.open(err?.error?.error?.message || 'Review submission failed', 'Close', { duration: 4000 });
      }
    });
  }

  onLostItemImageSelected(event: Event): void {
    this.lostItemImage = (event.target as HTMLInputElement).files?.[0];
  }

  submitLostItem(): void {
    if (this.lostItemForm.invalid) return;
    this.submittingLostItem = true;
    const raw = this.lostItemForm.getRawValue();

    this.lostItemService.createLostItem({
      tripId: this.tripId,
      title: raw.title!,
      description: raw.description ?? undefined
    }, this.lostItemImage).subscribe({
      next: () => {
        this.submittingLostItem = false;
        this.lostItemForm.reset({ title: '', description: '' });
        this.lostItemImage = undefined;
        this.snackBar.open('Lost item reported', 'Close', { duration: 3000 });
        this.loadLostItems();
      },
      error: err => {
        this.submittingLostItem = false;
        this.snackBar.open(err?.error?.error?.message || 'Report failed', 'Close', { duration: 4000 });
      }
    });
  }
}
