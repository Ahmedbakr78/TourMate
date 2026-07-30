import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { PlaceService } from 'src/app/core/services/place.service';
import { ReviewService } from 'src/app/core/services/review.service';
import { IPlace } from 'src/app/core/models/place.model';
import { IReview } from 'src/app/core/models/review.model';
import { AuthService } from 'src/app/core/services/auth.service';
import { RoleEnum } from 'src/app/core/models/enums';
import { ConfirmDialogComponent } from 'src/app/shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-place-detail',
  templateUrl: './place-detail.component.html',
  styleUrls: ['./place-detail.component.scss']
})
export class PlaceDetailComponent implements OnInit {

  place: IPlace | null = null;
  reviews: IReview[] = [];
  loading = false;
  roleEnum = RoleEnum;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private placeService: PlaceService,
    private reviewService: ReviewService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    public authService: AuthService
  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.loading = true;
    this.placeService.getPlaceById(id).subscribe({
      next: res => {
        this.loading = false;
        this.place = res.data ?? null;
      },
      error: err => {
        this.loading = false;
        this.snackBar.open(err?.error?.error?.message || 'Failed to load place', 'Close', { duration: 4000 });
      }
    });

    this.reviewService.getPlaceReviews(id).subscribe({
      next: res => (this.reviews = res.data?.reviews ?? []),
      error: () => { /* not critical to the page */ }
    });
  }

  deletePlace(): void {
    if (!this.place) return;
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: { title: 'Delete place', message: `Delete "${this.place.name}"? This cannot be undone.` }
    });

    dialogRef.afterClosed().subscribe(confirmed => {
      if (!confirmed || !this.place) return;
      this.placeService.deletePlace(this.place._id).subscribe({
        next: () => {
          this.snackBar.open('Place deleted', 'Close', { duration: 3000 });
          this.router.navigate(['/places']);
        },
        error: err => this.snackBar.open(err?.error?.error?.message || 'Delete failed', 'Close', { duration: 4000 })
      });
    });
  }
}
