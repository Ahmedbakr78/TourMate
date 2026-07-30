import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-reset-password',
  template: `
    <div class="auth-page">
      <mat-card class="auth-card">
        <h1>Reset password</h1>
        <form [formGroup]="form" (ngSubmit)="onSubmit()">
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Email</mat-label>
            <input matInput type="email" formControlName="email" required>
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>OTP code</mat-label>
            <input matInput formControlName="otp" required>
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>New password</mat-label>
            <input matInput type="password" formControlName="newPassword" required>
          </mat-form-field>

          <button mat-raised-button color="primary" class="full-width" type="submit" [disabled]="form.invalid || loading">
            {{ loading ? 'Resetting...' : 'Reset password' }}
          </button>
        </form>
      </mat-card>
    </div>
  `,
  styleUrls: ['../auth.shared.scss']
})
export class ResetPasswordComponent implements OnInit {

  loading = false;

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    otp: ['', Validators.required],
    newPassword: ['', [Validators.required, Validators.minLength(6)]]
  });

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    const email = this.route.snapshot.queryParamMap.get('email');
    if (email) this.form.patchValue({ email });
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    this.loading = true;

    this.authService.resetPassword(this.form.getRawValue() as any).subscribe({
      next: () => {
        this.loading = false;
        this.snackBar.open('Password reset! Please log in.', 'Close', { duration: 4000 });
        this.router.navigate(['/auth/login']);
      },
      error: (err) => {
        this.loading = false;
        this.snackBar.open(err?.error?.error?.message || 'Reset failed', 'Close', { duration: 4000 });
      }
    });
  }
}
