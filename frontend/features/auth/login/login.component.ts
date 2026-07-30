import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-login',
  template: `
    <div class="auth-page">
      <mat-card class="auth-card">
        <h1>Login to TourMate</h1>
        <form [formGroup]="form" (ngSubmit)="onSubmit()">
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Email</mat-label>
            <input matInput type="email" formControlName="email" required>
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Password</mat-label>
            <input matInput type="password" formControlName="password" required>
          </mat-form-field>

          <button mat-raised-button color="primary" class="full-width" type="submit" [disabled]="form.invalid || loading">
            {{ loading ? 'Signing in...' : 'Login' }}
          </button>
        </form>

        <div class="links">
          <a routerLink="/auth/forgot-password">Forgot password?</a>
          <a routerLink="/auth/signup">Create an account</a>
        </div>
      </mat-card>
    </div>
  `,
  styleUrls: ['../auth.shared.scss']
})
export class LoginComponent {

  loading = false;

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) { }

  onSubmit(): void {
    if (this.form.invalid) return;
    this.loading = true;

    this.authService.signIn(this.form.getRawValue() as { email: string; password: string }).subscribe({
      next: () => {
        this.loading = false;
        const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') || '/';
        this.router.navigateByUrl(returnUrl);
      },
      error: (err) => {
        this.loading = false;
        this.snackBar.open(err?.error?.error?.message || 'Login failed', 'Close', { duration: 4000 });
      }
    });
  }
}
