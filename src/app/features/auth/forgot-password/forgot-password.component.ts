import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../../../../../shared/src/app/core/services/auth.service';

@Component({
  selector: 'app-forgot-password',
  template: `
    <div class="auth-page">
      <mat-card class="auth-card">
        <h1>Forgot password</h1>

        <form [formGroup]="form" (ngSubmit)="onSubmit()">
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Email</mat-label>
            <input matInput type="email" formControlName="email" required>
          </mat-form-field>

          <button mat-raised-button color="primary" class="full-width" type="submit" [disabled]="form.invalid || loading">
            {{ loading ? 'Sending...' : 'Send reset OTP' }}
          </button>
        </form>

        <div class="links">
          <a routerLink="/auth/reset-password">Already have an OTP? Reset password</a>
        </div>
      </mat-card>
    </div>
  `,
  styleUrls: ['../auth.shared.scss']
})
export class ForgotPasswordComponent {

  loading = false;

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]]
  });

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router, private snackBar: MatSnackBar) { }

  onSubmit(): void {
    if (this.form.invalid) return;
    this.loading = true;

    this.authService.forgotPassword(this.form.getRawValue() as { email: string }).subscribe({
      next: () => {
        this.loading = false;
        this.snackBar.open('Reset OTP sent. Check your email.', 'Close', { duration: 4000 });
        this.router.navigate(['/auth/reset-password'], { queryParams: { email: this.form.value.email } });
      },
      error: (err) => {
        this.loading = false;
        this.snackBar.open(err?.error?.error?.message || 'Request failed', 'Close', { duration: 4000 });
      }
    });
  }
}
