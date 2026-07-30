import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TripService } from 'src/app/core/services/trip.service';
import { ITrip } from 'src/app/core/models/trip.model';
import { IUser } from 'src/app/core/models/user.model';
import { IVehicle } from 'src/app/core/models/vehicle.model';

@Component({
  selector: 'app-shared-trip',
  templateUrl: './shared-trip.component.html',
  styleUrls: ['./shared-trip.component.scss']
})
export class SharedTripComponent implements OnInit {

  trips: ITrip[] = [];
  loading = false;
  joining = false;
  joinedTripId: string | null = null;
  page = 1;
  limit = 10;
  totalDocs = 0;

  constructor(private tripService: TripService, private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.loadTrips();
  }

  loadTrips(): void {
    this.loading = true;
    this.tripService.getSharedTrips(this.page, this.limit).subscribe({
      next: res => {
        this.loading = false;
        this.trips = res.data?.docs ?? [];
        this.totalDocs = res.data?.totalDocs ?? 0;
      },
      error: err => {
        this.loading = false;
        this.snackBar.open(err?.error?.error?.message || 'Failed to load shared trips', 'Close', { duration: 4000 });
      }
    });
  }

  getTouristName(trip: ITrip): string {
    const tourist = trip.touristId as IUser;
    return tourist?.name ?? 'Unknown';
  }

  getCapacity(trip: ITrip): number {
    const vehicle = trip.vehicleId as IVehicle;
    return vehicle?.capacity ?? trip.peopleCount;
  }

  getPricePerPerson(trip: ITrip): number {
    return trip.peopleCount > 0 ? Math.round(trip.price / trip.peopleCount) : trip.price;
  }

  joinTrip(trip: ITrip, peopleCountInput: HTMLInputElement): void {
    const peopleCount = parseInt(peopleCountInput.value, 10) || 1;
    if (peopleCount < 1) {
      this.snackBar.open('People count must be at least 1', 'Close', { duration: 3000 });
      return;
    }
    const capacity = this.getCapacity(trip);
    if (trip.peopleCount + peopleCount > capacity) {
      this.snackBar.open(`Not enough capacity. Only ${capacity - trip.peopleCount} spot(s) available.`, 'Close', { duration: 4000 });
      return;
    }
    this.joining = true;
    this.joinedTripId = trip._id;
    this.tripService.joinSharedTrip(trip._id, peopleCount).subscribe({
      next: () => {
        this.joining = false;
        this.joinedTripId = null;
        this.snackBar.open('Successfully joined the trip!', 'Close', { duration: 3000 });
        this.loadTrips();
      },
      error: err => {
        this.joining = false;
        this.joinedTripId = null;
        this.snackBar.open(err?.error?.error?.message || 'Could not join trip', 'Close', { duration: 4000 });
      }
    });
  }

  onPageChange(event: { pageIndex: number; pageSize: number }): void {
    this.page = event.pageIndex + 1;
    this.limit = event.pageSize;
    this.loadTrips();
  }
}
