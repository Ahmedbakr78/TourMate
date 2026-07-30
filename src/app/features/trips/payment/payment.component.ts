import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TripService } from '../../../core/services/trip.service';
import { ITrip } from '../../../core/models/trip.model';

type PaymentState = 'idle' | 'processing' | 'success' | 'failure';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']
})
export class PaymentComponent implements OnInit {

  tripId!: string;
  trip: ITrip | null = null;
  loading = false;
  state: PaymentState = 'idle';
  receipt: { transactionId: string; paidAt: string } | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private tripService: TripService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.tripId = this.route.snapshot.paramMap.get('id')!;
    this.loadTrip();
  }

  loadTrip(): void {
    this.loading = true;
    this.tripService.getTripById(this.tripId).subscribe({
      next: res => {
        this.loading = false;
        this.trip = res.data ?? null;
        if (this.trip?.isPaid) {
          this.state = 'success';
          this.receipt = {
            transactionId: `TXN${Date.now().toString(36).toUpperCase()}`,
            paidAt: new Date().toISOString()
          };
        }
      },
      error: err => {
        this.loading = false;
        this.snackBar.open(err?.error?.error?.message || 'Failed to load trip', 'Close', { duration: 4000 });
      }
    });
  }

  pay(): void {
    this.state = 'processing';
    setTimeout(() => {
      const success = Math.random() > 0.2;
      if (success) {
        this.state = 'success';
        this.receipt = {
          transactionId: `TXN${Date.now().toString(36).toUpperCase()}`,
          paidAt: new Date().toISOString()
        };
        this.snackBar.open('Payment successful!', 'Close', { duration: 3000 });
      } else {
        this.state = 'failure';
        this.snackBar.open('Payment failed. Please try again.', 'Close', { duration: 4000 });
      }
    }, 2500);
  }

  reset(): void {
    this.state = 'idle';
  }

  goToTrip(): void {
    this.router.navigate(['/trips', this.tripId]);
  }
}
