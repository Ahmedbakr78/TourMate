import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DriverService } from 'src/app/core/services/driver.service';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-driver-onboarding',
  template: `
    <div class="form-page">
      <mat-card>
        <h1>Become a driver</h1>
        <p class="hint">Your application will be reviewed by an admin before you can accept trips.</p>
        <form [formGroup]="form" (ngSubmit)="onSubmit()">
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>License number</mat-label>
            <input matInput formControlName="licenseNumber" required>
          </mat-form-field>

          <label class="field-label">Current location (optional)</label>
          <app-map
            mode="picker"
            [lat]="pickedLat"
            [lng]="pickedLng"
            height="260px"
            (locationSelected)="onLocationPicked($event)">
          </app-map>
          <p class="picked-coords" *ngIf="pickedLat != null && pickedLng != null">
            Selected: {{ pickedLat!.toFixed(5) }}, {{ pickedLng!.toFixed(5) }}
          </p>

          <button mat-raised-button color="primary" type="submit" [disabled]="form.invalid || saving">
            {{ saving ? 'Submitting...' : 'Submit application' }}
          </button>
        </form>
      </mat-card>
    </div>
  `,
  styles: [`
    .form-page { max-width: 520px; margin: 1.5rem auto; padding: 0 1rem; }
    .full-width { width: 100%; margin-bottom: 0.5rem; }
    .field-label { display: block; margin: 0.75rem 0 0.4rem; font-size: 0.85rem; color: #555; }
    .picked-coords { font-size: 0.8rem; color: var(--tm-primary-700); margin: 0.5rem 0 0; }
    .hint { color: #666; font-size: 0.9rem; margin-bottom: 1rem; }
    button[type=submit] { margin-top: 1.25rem; }
  `]
})
export class DriverOnboardingComponent {

  saving = false;
  pickedLat?: number;
  pickedLng?: number;

  form = this.fb.group({
    licenseNumber: ['', Validators.required]
  });

  constructor(
    private fb: FormBuilder,
    private driverService: DriverService,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) { }

  onLocationPicked(point: { lat: number; lng: number }): void {
    this.pickedLat = point.lat;
    this.pickedLng = point.lng;
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    const userId = this.authService.currentUser?._id;
    if (!userId) {
      this.snackBar.open('You must be logged in.', 'Close', { duration: 4000 });
      return;
    }

    this.saving = true;
    const currentLocation = (this.pickedLat != null && this.pickedLng != null)
      ? { type: 'Point' as const, coordinates: [this.pickedLng, this.pickedLat] as [number, number] }
      : undefined;

    this.driverService.createDriver({
      userId,
      licenseNumber: this.form.getRawValue().licenseNumber!,
      currentLocation
    }).subscribe({
      next: () => {
        this.saving = false;
        this.snackBar.open('Application submitted! Awaiting admin verification.', 'Close', { duration: 4000 });
        this.router.navigate(['/profile']);
      },
      error: err => {
        this.saving = false;
        this.snackBar.open(err?.error?.error?.message || 'Application failed', 'Close', { duration: 4000 });
      }
    });
  }
}
