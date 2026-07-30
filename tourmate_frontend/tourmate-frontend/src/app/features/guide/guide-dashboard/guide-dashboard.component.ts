import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from 'src/environments/environment';
import { AuthService } from 'src/app/core/services/auth.service';
import { GuideService } from 'src/app/core/services/guide.service';
import { TripService } from 'src/app/core/services/trip.service';
import { IGuide } from 'src/app/core/models/guide.model';
import { ITrip } from 'src/app/core/models/trip.model';
import { IUser } from 'src/app/core/models/user.model';
import { TripStatusEnum } from 'src/app/core/models/enums';

@Component({
  selector: 'app-guide-dashboard',
  template: `
    <div class="dashboard-container">
      <app-loading *ngIf="loading"></app-loading>

      <ng-container *ngIf="!loading">
        <mat-card class="welcome-card">
          <div class="welcome-row">
            <div>
              <h1>Welcome, {{ guideName }}</h1>
              <p class="subtitle" *ngIf="guideProfile">{{ guideProfile.languages.join(', ') }} &middot; {{ guideProfile.experience }} years exp.</p>
            </div>
            <div class="availability-row">
              <span class="status-label">{{ guideProfile?.availability ? 'Available' : 'Unavailable' }}</span>
              <mat-slide-toggle
                [checked]="guideProfile?.availability ?? false"
                (change)="toggleAvailability($event.checked)"
                color="primary">
              </mat-slide-toggle>
            </div>
          </div>
          <mat-chip *ngIf="guideProfile" [color]="guideProfile.verificationStatus === 'approved' ? 'primary' : 'warn'" selected>
            {{ guideProfile.verificationStatus }}
          </mat-chip>
        </mat-card>

        <h2>Upcoming Trips</h2>
        <div class="trip-grid">
          <mat-card *ngFor="let trip of upcomingTrips" class="trip-card" [ngClass]="trip.status">
            <div class="trip-header">
              <mat-chip [color]="statusColor(trip.status)" selected>{{ trip.status }}</mat-chip>
              <span class="trip-dates">{{ trip.startDate | date:'mediumDate' }} - {{ trip.endDate | date:'mediumDate' }}</span>
            </div>
            <p class="people-count">{{ trip.peopleCount }} traveler{{ trip.peopleCount !== 1 ? 's' : '' }}</p>
            <p *ngIf="trip.price" class="price">{{ trip.price | currency }}</p>
            <div class="trip-actions" *ngIf="trip.status === 'pending'">
              <button mat-stroked-button color="primary" (click)="acceptTrip(trip)">
                <mat-icon>check</mat-icon> Accept
              </button>
              <button mat-stroked-button color="warn" (click)="rejectTrip(trip)">
                <mat-icon>close</mat-icon> Reject
              </button>
            </div>
          </mat-card>
          <p *ngIf="upcomingTrips.length === 0" class="empty">No upcoming trips.</p>
        </div>

        <h2>Current Trip</h2>
        <div class="current-trip" *ngIf="currentTrip; else noCurrent">
          <mat-card class="trip-card ongoing">
            <div class="trip-header">
              <mat-chip color="primary" selected>ongoing</mat-chip>
              <span class="trip-dates">{{ currentTrip.startDate | date:'mediumDate' }} - {{ currentTrip.endDate | date:'mediumDate' }}</span>
            </div>
            <p class="people-count">{{ currentTrip.peopleCount }} traveler{{ currentTrip.peopleCount !== 1 ? 's' : '' }}</p>
          </mat-card>
        </div>
        <ng-template #noCurrent>
          <p class="empty">No active trip right now.</p>
        </ng-template>

        <h2>Trip History</h2>
        <div class="trip-grid">
          <mat-card *ngFor="let trip of tripHistory" class="trip-card completed">
            <div class="trip-header">
              <mat-chip selected>{{ trip.status }}</mat-chip>
              <span class="trip-dates">{{ trip.startDate | date:'mediumDate' }} - {{ trip.endDate | date:'mediumDate' }}</span>
            </div>
            <p class="people-count">{{ trip.peopleCount }} traveler{{ trip.peopleCount !== 1 ? 's' : '' }}</p>
            <p *ngIf="trip.price" class="price">{{ trip.price | currency }}</p>
          </mat-card>
          <p *ngIf="tripHistory.length === 0" class="empty">No past trips.</p>
        </div>
      </ng-container>
    </div>
  `,
  styles: [`
    .dashboard-container { max-width: 960px; margin: 0 auto; padding: 1.5rem; }
    .welcome-card { padding: 1.5rem; margin-bottom: 1.5rem; }
    .welcome-row { display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 1rem; }
    .welcome-row h1 { margin: 0; font-size: 1.6rem; }
    .subtitle { color: #888; margin: 0.25rem 0 0; font-size: 0.9rem; }
    .availability-row { display: flex; align-items: center; gap: 0.75rem; }
    .status-label { font-size: 0.85rem; color: #666; }
    h2 { margin: 1.5rem 0 1rem; font-size: 1.3rem; }
    .trip-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 1rem; }
    .current-trip { margin-bottom: 0.5rem; }
    .trip-card { padding: 1.25rem; }
    .trip-card.pending { border-left: 4px solid #ff9800; }
    .trip-card.confirmed { border-left: 4px solid #4caf50; }
    .trip-card.ongoing { border-left: 4px solid #2196f3; }
    .trip-card.completed { border-left: 4px solid #9e9e9e; }
    .trip-card.cancelled { border-left: 4px solid #f44336; }
    .trip-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem; flex-wrap: wrap; gap: 0.5rem; }
    .trip-dates { font-size: 0.82rem; color: #777; }
    .people-count { margin: 0 0 0.25rem; font-size: 0.9rem; }
    .price { font-size: 1.1rem; font-weight: 600; margin: 0 0 0.75rem; }
    .trip-actions { display: flex; gap: 0.5rem; margin-top: 0.75rem; }
    .empty { color: #888; text-align: center; padding: 2rem; }
  `]
})
export class GuideDashboardComponent implements OnInit {

  guideProfile?: IGuide;
  upcomingTrips: ITrip[] = [];
  currentTrip?: ITrip;
  tripHistory: ITrip[] = [];
  loading = false;
  guideName = 'Guide';

  constructor(
    private authService: AuthService,
    private guideService: GuideService,
    private tripService: TripService,
    private http: HttpClient,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.loading = true;
    const user = this.authService.currentUser;
    if (user) {
      this.guideName = user.name;
      this.loadGuideProfile(user);
    }
    this.authService.currentUser$.subscribe(u => {
      if (u) {
        this.guideName = u.name;
        this.loadGuideProfile(u);
      }
    });
  }

  private loadGuideProfile(user: IUser): void {
    this.guideService.findMyGuideProfile(user._id).subscribe({
      next: profile => {
        if (profile) {
          this.guideProfile = profile;
          this.loadTrips(profile._id);
        }
        this.loading = false;
      },
      error: err => {
        this.loading = false;
        this.snackBar.open(err?.error?.error?.message || 'Failed to load guide profile', 'Close', { duration: 4000 });
      }
    });
  }

  private loadTrips(guideId: string): void {
    this.tripService.getTrips(1, 50).subscribe({
      next: res => {
        const trips = res.data?.docs ?? [];
        const filtered = trips.filter(t => {
          const id = typeof t.guideId === 'string' ? t.guideId : (t.guideId as any)?._id;
          return id === guideId;
        });
        this.upcomingTrips = filtered.filter(t => t.status === TripStatusEnum.PENDING || t.status === TripStatusEnum.CONFIRMED);
        this.currentTrip = filtered.find(t => t.status === TripStatusEnum.ONGOING);
        this.tripHistory = filtered.filter(t => t.status === TripStatusEnum.COMPLETED || t.status === TripStatusEnum.CANCELLED);
      },
      error: err => {
        this.snackBar.open(err?.error?.error?.message || 'Failed to load trips', 'Close', { duration: 4000 });
      }
    });
  }

  toggleAvailability(available: boolean): void {
    if (!this.guideProfile) return;
    this.guideService.updateGuide(this.guideProfile._id, { availability: available }).subscribe({
      next: () => {
        this.guideProfile!.availability = available;
        this.snackBar.open(`You are now ${available ? 'available' : 'unavailable'}`, 'Close', { duration: 3000 });
      },
      error: err => {
        this.snackBar.open(err?.error?.error?.message || 'Failed to update availability', 'Close', { duration: 4000 });
      }
    });
  }

  acceptTrip(trip: ITrip): void {
    this.updateTripStatus(trip, TripStatusEnum.CONFIRMED);
  }

  rejectTrip(trip: ITrip): void {
    this.updateTripStatus(trip, TripStatusEnum.CANCELLED);
  }

  private updateTripStatus(trip: ITrip, status: TripStatusEnum): void {
    this.http.patch(`${environment.apiUrl}/trip/${trip._id}/status`, { status }).subscribe({
      next: () => {
        trip.status = status;
        this.snackBar.open(`Trip ${status === TripStatusEnum.CONFIRMED ? 'accepted' : 'rejected'}`, 'Close', { duration: 3000 });
        this.loadTrips(typeof this.guideProfile!._id === 'string' ? this.guideProfile!._id : '');
      },
      error: err => {
        this.snackBar.open(err?.error?.error?.message || 'Failed to update trip', 'Close', { duration: 4000 });
      }
    });
  }

  statusColor(status: TripStatusEnum): string {
    switch (status) {
      case TripStatusEnum.PENDING: return 'accent';
      case TripStatusEnum.CONFIRMED: return 'primary';
      case TripStatusEnum.ONGOING: return 'primary';
      case TripStatusEnum.COMPLETED: return '';
      case TripStatusEnum.CANCELLED: return 'warn';
      default: return '';
    }
  }
}
