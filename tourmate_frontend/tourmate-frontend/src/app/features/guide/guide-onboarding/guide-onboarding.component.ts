import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { GuideService } from 'src/app/core/services/guide.service';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-guide-onboarding',
  template: `
    <div class="form-page">
      <mat-card>
        <h1>Become a guide</h1>
        <p class="hint">Your application will be reviewed by an admin before you can accept trips.</p>
        <form [formGroup]="form" (ngSubmit)="onSubmit()">
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Languages (comma separated)</mat-label>
            <input matInput formControlName="languages" placeholder="Arabic, English, French" required>
          </mat-form-field>
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Years of experience</mat-label>
            <input matInput type="number" formControlName="experience" required>
          </mat-form-field>

          <label class="file-label">Certificate (image/PDF)</label>
          <input type="file" (change)="onFileSelected($event)" accept="image/*,.pdf">

          <button mat-raised-button color="primary" type="submit" [disabled]="form.invalid || saving">
            {{ saving ? 'Submitting...' : 'Submit application' }}
          </button>
        </form>
      </mat-card>
    </div>
  `,
  styles: [`
    .form-page { max-width: 500px; margin: 1.5rem auto; padding: 0 1rem; }
    .full-width { width: 100%; margin-bottom: 0.5rem; }
    .hint { color: #666; font-size: 0.9rem; margin-bottom: 1rem; }
    .file-label { display: block; margin: 0.5rem 0 0.25rem; font-size: 0.85rem; color: #555; }
    input[type=file] { margin-bottom: 1rem; }
  `]
})
export class GuideOnboardingComponent {

  saving = false;
  certificate?: File;

  form = this.fb.group({
    languages: ['', Validators.required],
    experience: [0, [Validators.required, Validators.min(0)]]
  });

  constructor(
    private fb: FormBuilder,
    private guideService: GuideService,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) { }

  onFileSelected(event: Event): void {
    this.certificate = (event.target as HTMLInputElement).files?.[0];
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    const userId = this.authService.currentUser?._id;
    if (!userId) {
      this.snackBar.open('You must be logged in.', 'Close', { duration: 4000 });
      return;
    }

    this.saving = true;
    const raw = this.form.getRawValue();
    const languages = raw.languages!.split(',').map(l => l.trim()).filter(Boolean);

    this.guideService.createGuide({ userId, languages, experience: raw.experience! }, this.certificate).subscribe({
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
