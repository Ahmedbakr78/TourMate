import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-confirm-email',
  template: `
    <div class="auth-page">
      <mat-card class="auth-card">
        <h1>Confirm your email</h1>
        <form [formGroup]="form" (ngSubmit)="onSubmit()">
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Email</mat-label>
            <input matInput type="email" formControlName="email" required>
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>OTP code</mat-label>
            <input matInput formControlName="otp" required>
          </mat-form-field>

          <button mat-raised-button color="primary" class="full-width" type="submit" [disabled]="form.invalid || loading">
            {{ loading ? 'Confirming...' : 'Confirm email' }}
          </button>
        </form>

        <div class="links">
          <button mat-button (click)="resendOtp()" [disabled]="resending">Resend OTP</button>
        </div>
      </mat-card>
    </div>
  `,
  styleUrls: ['../auth.shared.scss']
})
export class ConfirmEmailComponent implements OnInit {

  loading = false;
  resending = false;

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    otp: ['', Validators.required]
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

    this.authService.confirmEmail(this.form.getRawValue() as { email: string; otp: string }).subscribe({
      next: () => {
        this.loading = false;
        this.snackBar.open('Email confirmed! You can now log in.', 'Close', { duration: 4000 });
        this.router.navigate(['/auth/login']);
      },
      error: (err) => {
        this.loading = false;
        this.snackBar.open(err?.error?.error?.message || 'Confirmation failed', 'Close', { duration: 4000 });
      }
    });
  }

  resendOtp(): void {
    const email = this.form.value.email;
    if (!email) {
      this.snackBar.open('Enter your email first', 'Close', { duration: 3000 });
      return;
    }
    this.resending = true;
    this.authService.sendOtpAgain({ email }).subscribe({
      next: () => {
        this.resending = false;
        this.snackBar.open('A new OTP has been sent to your email.', 'Close', { duration: 4000 });
      },
      error: (err) => {
        this.resending = false;
        this.snackBar.open(err?.error?.error?.message || 'Could not resend OTP', 'Close', { duration: 4000 });
      }
    });
  }
}
