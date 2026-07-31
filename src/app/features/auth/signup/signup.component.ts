import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../../../../../shared/src/app/core/services/auth.service';
import { GenderEnum } from '../../../../../../shared/src/app/core/models/enums';

@Component({
  selector: 'app-signup',
  template: `
    <div class="auth-page">
      <mat-card class="auth-card">
        <h1>Create your TourMate account</h1>
        <form [formGroup]="form" (ngSubmit)="onSubmit()">
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Full name</mat-label>
            <input matInput formControlName="name" required>
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Email</mat-label>
            <input matInput type="email" formControlName="email" required>
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Phone</mat-label>
            <input matInput formControlName="phone" required>
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Gender</mat-label>
            <mat-select formControlName="gender" required>
              <mat-option [value]="genderEnum.MALE">Male</mat-option>
              <mat-option [value]="genderEnum.FEMALE">Female</mat-option>
            </mat-select>
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Password</mat-label>
            <input matInput type="password" formControlName="password" required>
          </mat-form-field>

          <button mat-raised-button color="primary" class="full-width" type="submit" [disabled]="form.invalid || loading">
            {{ loading ? 'Creating account...' : 'Sign up' }}
          </button>
        </form>

        <div class="links">
          <a routerLink="/auth/login">Already have an account? Login</a>
        </div>
      </mat-card>
    </div>
  `,
  styleUrls: ['../auth.shared.scss']
})
export class SignupComponent {

  loading = false;
  genderEnum = GenderEnum;

  form = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', Validators.required],
    gender: [GenderEnum.MALE, Validators.required],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) { }

  onSubmit(): void {
    if (this.form.invalid) return;
    this.loading = true;

    this.authService.signUp(this.form.getRawValue() as any).subscribe({
      next: () => {
        this.loading = false;
        this.snackBar.open('Account created! Please check your email for the confirmation OTP.', 'Close', { duration: 5000 });
        this.router.navigate(['/auth/confirm-email'], { queryParams: { email: this.form.value.email } });
      },
      error: (err) => {
        this.loading = false;
        this.snackBar.open(err?.error?.error?.message || 'Sign up failed', 'Close', { duration: 4000 });
      }
    });
  }
}
