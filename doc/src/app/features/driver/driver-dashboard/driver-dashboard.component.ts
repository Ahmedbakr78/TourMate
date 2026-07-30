import { Component, OnDestroy, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { environment } from '../../../../../../shared/src/environments/environment';
import { AuthService } from '../../../../../../shared/src/app/core/services/auth.service';
import { DriverService } from '../../../core/services/driver.service';
import { TripService } from '../../../core/services/trip.service';
import { IDriver } from '../../../core/models/driver.model';
import { ITrip } from '../../../core/models/trip.model';
import { IUser } from '../../../../../../shared/src/app/core/models/user.model';
import { TripStatusEnum } from '../../../../../../shared/src/app/core/models/enums';

@Component({
  selector: 'app-driver-dashboard',
  template: `
    <div class="dashboard-container">
      <app-loading *ngIf="loading"></app-loading>

      <ng-container *ngIf="!loading">
        <mat-card class="welcome-card">
          <div class="welcome-row">
            <div>
              <h1>Welcome, {{ driverName }}</h1>
              <p class="subtitle" *ngIf="driverProfile">License: {{ driverProfile.licenseNumber }}</p>
            </div>
            <div class="availability-row">
              <span class="status-label">{{ driverProfile?.availability ? 'Available' : 'Unavailable' }}</span>
              <mat-slide-toggle
                [checked]="driverProfile?.availability ?? false"
                (change)="toggleAvailability($event.checked)"
                color="primary">
              </mat-slide-toggle>
            </div>
          </div>
          <mat-chip *ngIf="driverProfile" [color]="driverProfile.verificationStatus === 'approved' ? 'primary' : 'warn'" selected>
            {{ driverProfile.verificationStatus }}
          </mat-chip>
        </mat-card>

        <div class="action-bar">
          <button mat-raised-button color="accent" (click)="updateLocation()" [disabled]="sendingLocation">
            <mat-icon>my_location</mat-icon>
            {{ sendingLocation ? 'Sending...' : 'Update Location' }}
          </button>
        </div>

        <h2>Assigned Trips</h2>

        <div class="trip-grid">
          <mat-card *ngFor="let trip of assignedTrips" class="trip-card" [ngClass]="trip.status">
            <div class="trip-header">
              <mat-chip [color]="statusColor(trip.status)" selected>{{ trip.status }}</mat-chip>
              <span class="trip-dates">{{ trip.startDate | date:'mediumDate' }} - {{ trip.endDate | date:'mediumDate' }}</span>
            </div>
            <p class="people-count">{{ trip.peopleCount }} traveler{{ trip.peopleCount !== 1 ? 's' : '' }}</p>
            <p *ngIf="trip.price" class="price">{{ trip.price | currency }}</p>
            <div class="trip-actions">
              <button mat-stroked-button color="primary" (click)="acceptTrip(trip)" [disabled]="trip.status !== 'pending'">
                <mat-icon>check</mat-icon> Accept
              </button>
              <button mat-stroked-button color="warn" (click)="rejectTrip(trip)" [disabled]="trip.status !== 'pending'">
                <mat-icon>close</mat-icon> Reject
              </button>
            </div>
          </mat-card>
          <p *ngIf="assignedTrips.length === 0" class="empty">No assigned trips.</p>
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
    .action-bar { display: flex; gap: 0.75rem; margin-bottom: 1.5rem; flex-wrap: wrap; }
    h2 { margin: 0 0 1rem; font-size: 1.3rem; }
    .trip-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 1rem; }
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
    .empty { color: #888; grid-column: 1 / -1; text-align: center; padding: 2rem; }
  `]
})
export class DriverDashboardComponent implements OnInit, OnDestroy {

  private readonly locUrl = `${environment.apiUrl}/location/update`;

  driverProfile?: IDriver;
  assignedTrips: ITrip[] = [];
  loading = false;
  sendingLocation = false;
  driverName = 'Driver';

  private pollSub?: Subscription;

  constructor(
    private authService: AuthService,
    private driverService: DriverService,
    private tripService: TripService,
    private http: HttpClient,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.loading = true;
    const user = this.authService.currentUser;
    if (user) {
      this.driverName = user.name;
      this.loadDriverProfile(user);
    }
    this.authService.currentUser$.subscribe(u => {
      if (u) {
        this.driverName = u.name;
        this.loadDriverProfile(u);
      }
    });
  }

  ngOnDestroy(): void {
    this.pollSub?.unsubscribe();
  }

  private loadDriverProfile(user: IUser): void {
    this.driverService.findMyDriverProfile(user._id).subscribe({
      next: profile => {
        if (profile) {
          this.driverProfile = profile;
          this.loadAssignedTrips(profile._id);
        }
        this.loading = false;
      },
      error: err => {
        this.loading = false;
        this.snackBar.open(err?.error?.error?.message || 'Failed to load driver profile', 'Close', { duration: 4000 });
      }
    });
  }

  private loadAssignedTrips(driverId: string): void {
    this.tripService.getTrips(1, 50).subscribe({
      next: res => {
        const trips = res.data?.docs ?? [];
        this.assignedTrips = trips.filter(t => {
          const id = typeof t.driverId === 'string' ? t.driverId : (t.driverId as any)?._id;
          return id === driverId;
        });
      },
      error: err => {
        this.snackBar.open(err?.error?.error?.message || 'Failed to load trips', 'Close', { duration: 4000 });
      }
    });
  }

  toggleAvailability(available: boolean): void {
    if (!this.driverProfile) return;
    this.driverService.updateDriver(this.driverProfile._id, { availability: available }).subscribe({
      next: () => {
        this.driverProfile!.availability = available;
        this.snackBar.open(`You are now ${available ? 'available' : 'unavailable'}`, 'Close', { duration: 3000 });
      },
      error: err => {
        this.snackBar.open(err?.error?.error?.message || 'Failed to update availability', 'Close', { duration: 4000 });
      }
    });
  }

  updateLocation(): void {
    if (!navigator.geolocation) {
      this.snackBar.open('Geolocation is not supported by your browser', 'Close', { duration: 4000 });
      return;
    }
    this.sendingLocation = true;
    navigator.geolocation.getCurrentPosition(
      pos => {
        const payload = {
          type: 'Point' as const,
          coordinates: [pos.coords.longitude, pos.coords.latitude] as [number, number]
        };
        this.http.post(this.locUrl, payload).subscribe({
          next: () => {
            this.sendingLocation = false;
            this.snackBar.open('Location updated', 'Close', { duration: 3000 });
          },
          error: err => {
            this.sendingLocation = false;
            this.snackBar.open(err?.error?.error?.message || 'Failed to send location', 'Close', { duration: 4000 });
          }
        });
      },
      err => {
        this.sendingLocation = false;
        this.snackBar.open('Could not retrieve location: ' + err.message, 'Close', { duration: 4000 });
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
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
