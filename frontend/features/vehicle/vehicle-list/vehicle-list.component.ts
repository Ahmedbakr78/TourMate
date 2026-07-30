import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { VehicleService } from 'src/app/core/services/vehicle.service';
import { DriverService } from 'src/app/core/services/driver.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { IVehicle } from 'src/app/core/models/vehicle.model';
import { ConfirmDialogComponent } from 'src/app/shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-vehicle-list',
  template: `
    <div class="page-header">
      <h1>My Vehicles</h1>
      <a mat-raised-button color="primary" routerLink="/vehicles/new">Add vehicle</a>
    </div>

    <app-loading *ngIf="loading"></app-loading>

    <p class="empty" *ngIf="!loading && !myDriverId">
      No driver profile found for your account yet.
      <a routerLink="/drivers/become-a-driver">Become a driver</a> to add vehicles.
    </p>

    <div class="grid" *ngIf="!loading && myDriverId">
      <mat-card *ngFor="let v of vehicles" class="vehicle-card">
        <img *ngIf="v.carImages?.[0]?.secure_url" [src]="v.carImages[0].secure_url" class="vehicle-img">
        <h3>{{ v.brand }} {{ v.vehicleModel }}</h3>
        <p>Plate: {{ v.plateNumber }} &middot; {{ v.capacity }} seats</p>
        <button mat-button color="warn" (click)="deleteVehicle(v._id)">Delete</button>
      </mat-card>
      <p *ngIf="vehicles.length === 0" class="empty">You haven't added any vehicles yet.</p>
    </div>
  `,
  styles: [`
    .page-header { display: flex; justify-content: space-between; align-items: center; padding: 1.5rem; }
    .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 1rem; padding: 0 1.5rem 1.5rem; }
    .vehicle-img { width: 100%; height: 140px; object-fit: cover; border-radius: 4px; margin-bottom: 0.5rem; }
    .empty { color: #888; padding: 0 1.5rem 1.5rem; }
  `]
})
export class VehicleListComponent implements OnInit {

  vehicles: IVehicle[] = [];
  loading = false;
  myDriverId: string | null = null;

  constructor(
    private vehicleService: VehicleService,
    private driverService: DriverService,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.loadMyVehicles();
  }

  loadMyVehicles(): void {
    const userId = this.authService.currentUser?._id;
    if (!userId) return;

    this.loading = true;
    this.driverService.findMyDriverProfile(userId).subscribe({
      next: driver => {
        if (!driver) {
          this.loading = false;
          this.myDriverId = null;
          return;
        }
        this.myDriverId = driver._id;
        this.vehicleService.getDriverVehicles(driver._id).subscribe({
          next: res => {
            this.loading = false;
            this.vehicles = res.data ?? [];
          },
          error: err => {
            this.loading = false;
            this.snackBar.open(err?.error?.error?.message || 'Failed to load vehicles', 'Close', { duration: 4000 });
          }
        });
      },
      error: () => (this.loading = false)
    });
  }

  deleteVehicle(id: string): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: { title: 'Delete vehicle', message: 'Are you sure you want to delete this vehicle?' }
    });
    dialogRef.afterClosed().subscribe(confirmed => {
      if (!confirmed) return;
      this.vehicleService.deleteVehicle(id).subscribe({
        next: () => {
          this.snackBar.open('Vehicle deleted', 'Close', { duration: 3000 });
          this.loadMyVehicles();
        },
        error: err => this.snackBar.open(err?.error?.error?.message || 'Delete failed', 'Close', { duration: 4000 })
      });
    });
  }
}
