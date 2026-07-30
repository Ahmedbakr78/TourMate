import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { VehicleService } from '../../../core/services/vehicle.service';

@Component({
  selector: 'app-vehicle-form',
  template: `
    <div class="form-page">
      <mat-card>
        <h1>Add a vehicle</h1>
        <form [formGroup]="form" (ngSubmit)="onSubmit()">
          <div class="row">
            <mat-form-field appearance="outline">
              <mat-label>Brand</mat-label>
              <input matInput formControlName="brand" required>
            </mat-form-field>
            <mat-form-field appearance="outline">
              <mat-label>Model</mat-label>
              <input matInput formControlName="vehicleModel" required>
            </mat-form-field>
          </div>
          <div class="row">
            <mat-form-field appearance="outline">
              <mat-label>Capacity (seats)</mat-label>
              <input matInput type="number" formControlName="capacity" required>
            </mat-form-field>
            <mat-form-field appearance="outline">
              <mat-label>Plate number</mat-label>
              <input matInput formControlName="plateNumber" required>
            </mat-form-field>
          </div>

          <label class="file-label">Vehicle photo</label>
          <input type="file" accept="image/*" (change)="onFileSelected($event)">

          <button mat-raised-button color="primary" type="submit" [disabled]="form.invalid || saving">
            {{ saving ? 'Saving...' : 'Add vehicle' }}
          </button>
        </form>
      </mat-card>
    </div>
  `,
  styles: [`
    .form-page { max-width: 500px; margin: 1.5rem auto; padding: 0 1rem; }
    .row { display: flex; gap: 1rem; }
    .row mat-form-field { flex: 1; }
    .file-label { display: block; margin: 0.5rem 0 0.25rem; font-size: 0.85rem; color: #555; }
    input[type=file] { margin-bottom: 1rem; }
  `]
})
export class VehicleFormComponent {

  saving = false;
  image?: File;

  form = this.fb.group({
    brand: ['', Validators.required],
    vehicleModel: ['', Validators.required],
    capacity: [4, [Validators.required, Validators.min(1)]],
    plateNumber: ['', Validators.required]
  });

  constructor(private fb: FormBuilder, private vehicleService: VehicleService, private router: Router, private snackBar: MatSnackBar) { }

  onFileSelected(event: Event): void {
    this.image = (event.target as HTMLInputElement).files?.[0];
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    this.saving = true;

    this.vehicleService.createVehicle(this.form.getRawValue() as any, this.image).subscribe({
      next: () => {
        this.saving = false;
        this.snackBar.open('Vehicle added', 'Close', { duration: 3000 });
        this.router.navigate(['/vehicles']);
      },
      error: err => {
        this.saving = false;
        this.snackBar.open(err?.error?.error?.message || 'Failed to add vehicle', 'Close', { duration: 4000 });
      }
    });
  }
}
