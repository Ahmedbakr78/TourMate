import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DriverService } from 'src/app/core/services/driver.service';
import { VehicleService } from 'src/app/core/services/vehicle.service';
import { IDriver } from 'src/app/core/models/driver.model';
import { IVehicle } from 'src/app/core/models/vehicle.model';

@Component({
  selector: 'app-driver-list',
  template: `
    <div class="page-header">
      <h1>Drivers</h1>
      <a mat-raised-button color="primary" routerLink="/drivers/become-a-driver">Become a driver</a>
    </div>

    <app-loading *ngIf="loading"></app-loading>

    <div class="grid" *ngIf="!loading">
      <mat-card *ngFor="let driver of drivers" class="driver-card">
        <h3>License: {{ driver.licenseNumber }}</h3>
        <p>Rating: {{ driver.rating || 'N/A' }} &middot; {{ driver.availability ? 'Available' : 'Unavailable' }}</p>
        <mat-chip [color]="driver.verificationStatus === 'approved' ? 'primary' : 'warn'" selected>
          {{ driver.verificationStatus }}
        </mat-chip>
        <button mat-button (click)="loadVehicles(driver._id)">View vehicles</button>
        <div class="vehicles" *ngIf="vehiclesByDriver[driver._id]">
          <p *ngFor="let v of vehiclesByDriver[driver._id]">{{ v.brand }} {{ v.vehicleModel }} ({{ v.capacity }} seats)</p>
          <p *ngIf="vehiclesByDriver[driver._id]?.length === 0" class="empty">No vehicles listed.</p>
        </div>
      </mat-card>
      <p *ngIf="drivers.length === 0" class="empty">No drivers found.</p>
    </div>
  `,
  styles: [`
    .page-header { display: flex; justify-content: space-between; align-items: center; padding: 1.5rem; }
    .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 1rem; padding: 0 1.5rem 1.5rem; }
    .vehicles { margin-top: 0.5rem; font-size: 0.85rem; color: #555; }
    .empty { color: #888; }
  `]
})
export class DriverListComponent implements OnInit {

  drivers: IDriver[] = [];
  loading = false;
  vehiclesByDriver: Record<string, IVehicle[]> = {};

  constructor(
    private driverService: DriverService,
    private vehicleService: VehicleService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.loading = true;
    this.driverService.getDrivers(1, 20).subscribe({
      next: res => {
        this.loading = false;
        this.drivers = (res.data as any)?.docs ?? (res.data as IDriver[]) ?? [];
      },
      error: err => {
        this.loading = false;
        this.snackBar.open(err?.error?.error?.message || 'Failed to load drivers', 'Close', { duration: 4000 });
      }
    });
  }

  loadVehicles(driverId: string): void {
    this.vehicleService.getDriverVehicles(driverId).subscribe({
      next: res => (this.vehiclesByDriver[driverId] = res.data ?? []),
      error: () => (this.vehiclesByDriver[driverId] = [])
    });
  }
}
