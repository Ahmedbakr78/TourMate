import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { TranslationService } from '../../core/services/translation.service';
import { authStyles } from '../auth-styles';

@Component({
  selector: 'app-change-password',
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
        <h2 class="auth-title">{{ translation.t('ui.changePassword') }}</h2>
        <p class="auth-subtitle">Update your account password</p>
        <form [formGroup]="form" (ngSubmit)="submit()">
          <div class="input-group">
            <label>{{ translation.t('auth.current_password') }}</label>
            <input class="tm-input" formControlName="currentPassword" placeholder="Enter current password" type="password" />
          </div>
          <div class="input-group">
            <label>{{ translation.t('auth.new_password') }}</label>
            <input class="tm-input" formControlName="newPassword" placeholder="Min 6 characters" type="password" />
          </div>
          <button class="tm-btn auth-btn" type="submit" [disabled]="form.invalid || submitting">
            @if (submitting) { <span class="btn-spinner"></span> Changing... } @else { {{ translation.t('ui.changePassword') }} }
          </button>
        </form>
        <div class="auth-links"><a routerLink="/app/home">{{ translation.t('ui.back') }}</a></div>
        @if (done) { <div class="auth-success">Password changed!</div> }
        @if (error) { <div class="auth-error">{{ error }}</div> }
      </div>
    </div>
  `,
  styles: [authStyles],
})
export class ChangePasswordComponent {
  auth = inject(AuthService);
  translation = inject(TranslationService);
  fb = inject(FormBuilder);
  router = inject(Router);
  done = false;
  error = '';
  submitting = false;

  form = this.fb.nonNullable.group({
    currentPassword: ['', Validators.required],
    newPassword: ['', [Validators.required, Validators.minLength(6)]],
  });

  constructor() {
    if (!this.auth.isAuthenticated()) {
      this.router.navigate(['/login']);
    }
  }

  submit() {
    if (this.form.invalid || this.submitting) return;
    this.submitting = true;
    this.error = '';
    const { currentPassword, newPassword } = this.form.getRawValue();
    this.auth.changePassword(currentPassword, newPassword).subscribe({
      next: () => { this.done = true; this.submitting = false; },
      error: (e) => { this.submitting = false; this.error = e.error?.message || 'Failed to change password'; },
    });
  }
}
