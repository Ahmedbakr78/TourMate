import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TripService } from '../../../core/services/trip.service';
import { ITrip } from '../../../core/models/trip.model';
import { TripStatusEnum } from '../../../../../../shared/src/app/core/models/enums';

@Component({
  selector: 'app-my-trips',
  templateUrl: './my-trips.component.html',
  styleUrls: ['./my-trips.component.scss']
})
export class MyTripsComponent implements OnInit {

  trips: ITrip[] = [];
  loading = false;
  page = 1;
  limit = 10;
  totalDocs = 0;
  tripStatusEnum = TripStatusEnum;

  constructor(private tripService: TripService, private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.loadTrips();
  }

  loadTrips(): void {
    this.loading = true;
    this.tripService.getMyTrips(this.page, this.limit).subscribe({
      next: res => {
        this.loading = false;
        this.trips = res.data?.docs ?? [];
        this.totalDocs = res.data?.totalDocs ?? 0;
      },
      error: err => {
        this.loading = false;
        this.snackBar.open(err?.error?.error?.message || 'Failed to load trips', 'Close', { duration: 4000 });
      }
    });
  }

  onPageChange(event: { pageIndex: number; pageSize: number }): void {
    this.page = event.pageIndex + 1;
    this.limit = event.pageSize;
    this.loadTrips();
  }

  statusColor(status: TripStatusEnum): string {
    switch (status) {
      case TripStatusEnum.COMPLETED: return 'primary';
      case TripStatusEnum.CANCELLED: return 'warn';
      case TripStatusEnum.ONGOING: return 'accent';
      default: return '';
    }
  }
}
