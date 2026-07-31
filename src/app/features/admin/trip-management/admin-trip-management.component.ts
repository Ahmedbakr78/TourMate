import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TripService } from '../../../core/services/trip.service';
import { AdminService } from '../../../core/services/admin.service';
import { DriverService } from '../../../core/services/driver.service';
import { GuideService } from '../../../core/services/guide.service';
import { VehicleService } from '../../../core/services/vehicle.service';
import { ITrip } from '../../../core/models/trip.model';
import { IDriver } from '../../../core/models/driver.model';
import { IGuide } from '../../../core/models/guide.model';
import { IVehicle } from '../../../core/models/vehicle.model';
import { TripStatusEnum } from '../../../../../../shared/src/app/core/models/enums';

@Component({
  selector: 'app-admin-trip-management',
  template: `
    <div class="page-header"><h1>Trip Management</h1></div>

    <app-loading *ngIf="loading"></app-loading>

    <div class="trip-list" *ngIf="!loading">
      <mat-card *ngFor="let trip of trips" class="trip-card">
        <div class="row">
          <div>
            <h3>{{ trip.startDate | date:'mediumDate' }} &rarr; {{ trip.endDate | date:'mediumDate' }}</h3>
            <p>{{ trip.peopleCount }} people &middot; {{ trip.price }} EGP</p>
          </div>
          <mat-chip selected>{{ trip.status }}</mat-chip>
        </div>

        <div class="assign-row">
          <mat-form-field appearance="outline">
            <mat-label>Guide</mat-label>
            <mat-select [(ngModel)]="assignments[trip._id].guideId">
              <mat-option [value]="null">None</mat-option>
              <mat-option *ngFor="let g of guides" [value]="g._id">{{ g.languages.join(', ') }}</mat-option>
            </mat-select>
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>Driver</mat-label>
            <mat-select [(ngModel)]="assignments[trip._id].driverId">
              <mat-option [value]="null">None</mat-option>
              <mat-option *ngFor="let d of drivers" [value]="d._id">{{ d.licenseNumber }}</mat-option>
            </mat-select>
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>Vehicle</mat-label>
            <mat-select [(ngModel)]="assignments[trip._id].vehicleId">
              <mat-option [value]="null">None</mat-option>
              <mat-option *ngFor="let v of vehicles" [value]="v._id">{{ v.brand }} {{ v.vehicleModel }}</mat-option>
            </mat-select>
          </mat-form-field>
          <button mat-raised-button color="primary" (click)="assignResources(trip)">Assign</button>
        </div>

        <div class="status-row">
          <mat-form-field appearance="outline">
            <mat-label>Status</mat-label>
            <mat-select [value]="trip.status" (selectionChange)="updateStatus(trip, $event.value)">
              <mat-option *ngFor="let s of statuses" [value]="s">{{ s }}</mat-option>
            </mat-select>
          </mat-form-field>
          <mat-slide-toggle [checked]="trip.isPaid" (change)="confirmPayment(trip, $event.checked)">
            Payment confirmed
          </mat-slide-toggle>
        </div>
      </mat-card>
      <p *ngIf="trips.length === 0" class="empty">No trips found.</p>
    </div>
  `,
  styles: [`
    .page-header { padding: 1.5rem; }
    .trip-list { display: flex; flex-direction: column; gap: 1rem; padding: 0 1.5rem 1.5rem; }
    .row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem; }
    .assign-row, .status-row { display: flex; gap: 0.75rem; align-items: center; flex-wrap: wrap; }
    .assign-row mat-form-field, .status-row mat-form-field { width: 160px; }
    .empty { color: #888; }
  `]
})
export class AdminTripManagementComponent implements OnInit {

  trips: ITrip[] = [];
  guides: IGuide[] = [];
  drivers: IDriver[] = [];
  vehicles: IVehicle[] = [];
  loading = false;
  statuses = Object.values(TripStatusEnum);

  assignments: Record<string, { guideId: string | null; driverId: string | null; vehicleId: string | null }> = {};

  constructor(
    private tripService: TripService,
    private adminService: AdminService,
    private driverService: DriverService,
    private guideService: GuideService,
    private vehicleService: VehicleService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.loading = true;
    this.tripService.getTrips(1, 20).subscribe({
      next: res => {
        this.loading = false;
        this.trips = res.data?.docs ?? [];
        this.trips.forEach(t => {
          this.assignments[t._id] = {
            guideId: (t.guideId as any)?._id ?? (t.guideId as string) ?? null,
            driverId: (t.driverId as any)?._id ?? (t.driverId as string) ?? null,
            vehicleId: (t.vehicleId as any)?._id ?? (t.vehicleId as string) ?? null
          };
        });
      },
      error: err => {
        this.loading = false;
        this.snackBar.open(err?.error?.error?.message || 'Failed to load trips', 'Close', { duration: 4000 });
      }
    });

    this.guideService.getGuides(1, 50).subscribe(res => (this.guides = res.data?.docs ?? []));
    this.driverService.getDrivers(1, 50).subscribe({
      next: res => (this.drivers = (res.data as any)?.docs ?? (res.data as IDriver[]) ?? []),
      error: () => { }
    });
    this.vehicleService.getVehicles(1, 50).subscribe(res => (this.vehicles = res.data?.docs ?? []));
  }

  assignResources(trip: ITrip): void {
    const payload = this.assignments[trip._id];
    this.adminService.assignTripResources(trip._id, {
      guideId: payload.guideId ?? undefined,
      driverId: payload.driverId ?? undefined,
      vehicleId: payload.vehicleId ?? undefined
    }).subscribe({
      next: () => this.snackBar.open('Resources assigned', 'Close', { duration: 3000 }),
      error: err => this.snackBar.open(err?.error?.error?.message || 'Assignment failed', 'Close', { duration: 4000 })
    });
  }

  updateStatus(trip: ITrip, status: TripStatusEnum): void {
    this.adminService.updateTripStatus(trip._id, status).subscribe({
      next: () => {
        trip.status = status;
        this.snackBar.open(`Status updated to ${status}`, 'Close', { duration: 3000 });
      },
      error: err => this.snackBar.open(err?.error?.error?.message || 'Update failed', 'Close', { duration: 4000 })
    });
  }

  confirmPayment(trip: ITrip, isPaid: boolean): void {
    this.adminService.confirmTripPayment(trip._id, isPaid).subscribe({
      next: () => {
        trip.isPaid = isPaid;
        this.snackBar.open(`Payment marked as ${isPaid ? 'paid' : 'unpaid'}`, 'Close', { duration: 3000 });
      },
      error: err => this.snackBar.open(err?.error?.error?.message || 'Update failed', 'Close', { duration: 4000 })
    });
  }
}
