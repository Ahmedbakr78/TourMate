import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { TranslationService } from '../../core/services/translation.service';
import { authStyles } from '../auth-styles';

@Component({
  selector: 'app-verify-email',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  template: `
    <div class="auth-wrap">
      <div class="auth-bg-shapes">
        <div class="shape s1"></div><div class="shape s2"></div><div class="shape s3"></div>
      </div>
      <div class="auth-card">
        <div class="auth-brand">
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
          <span>TourMate</span>
        </div>
        <h2 class="auth-title">{{ translation.t('ui.verifyEmail') }}</h2>
        <p class="auth-subtitle">Enter the OTP sent to your email</p>
        <form [formGroup]="form" (ngSubmit)="submit()">
          <div class="input-group">
            <label>{{ translation.t('ui.email') }}</label>
            <input class="tm-input" formControlName="email" placeholder="you@example.com" type="email" />
          </div>
          <div class="input-group">
            <label>OTP Code</label>
            <input class="tm-input" formControlName="otp" placeholder="Enter OTP" type="text" />
          </div>
          <button class="tm-btn auth-btn" type="submit" [disabled]="form.invalid || submitting">
            @if (submitting) { <span class="btn-spinner"></span> Verifying... } @else { {{ translation.t('ui.verifyEmail') }} }
          </button>
        </form>
        <div class="auth-links">
          <a routerLink="/login">{{ translation.t('ui.login') }}</a>
          <button class="link-btn" (click)="resend()">{{ translation.t('auth.resend_code') }}</button>
        </div>
        @if (done) { <div class="auth-success">Email verified! Redirecting...</div> }
        @if (error) { <div class="auth-error">{{ error }}</div> }
      </div>
    </div>
  `,
  styles: [authStyles, `.link-btn { background: none; border: none; color: var(--tm-primary); cursor: pointer; font-size: 0.85rem; padding: 0; }`],
})
export class VerifyEmailComponent {
  auth = inject(AuthService);
  translation = inject(TranslationService);
  fb = inject(FormBuilder);
  router = inject(Router);
  done = false;
  error = '';
  submitting = false;

  form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    otp: ['', [Validators.required, Validators.minLength(6)]],
  });

  submit() {
    if (this.form.invalid || this.submitting) return;
    this.submitting = true;
    this.error = '';
    const { email, otp } = this.form.getRawValue();
    this.auth.verifyEmail(email, otp).subscribe({
      next: () => {
        this.done = true;
        this.submitting = false;
        setTimeout(() => this.router.navigate(['/login']), 1500);
      },
      error: (e) => { this.submitting = false; this.error = e.error?.message || 'Verification failed'; },
    });
  }

  resend() {
    const email = this.form.value.email;
    if (!email) { this.error = 'Enter your email first'; return; }
    this.auth.resendVerification(email).subscribe({
      next: () => (this.error = ''),
      error: (e) => (this.error = e.error?.message || 'Failed to resend'),
    });
  }
}
