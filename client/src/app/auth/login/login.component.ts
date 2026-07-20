import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { NgClass } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';
import { TranslationService } from '../../core/services/translation.service';
import { authStyles } from '../auth-styles';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, NgClass],
  template: `
    <div class="auth-wrap">
      <div class="auth-bg-shapes">
        <div class="shape s1"></div><div class="shape s2"></div><div class="shape s3"></div>
      </div>
      <div class="auth-card">
        <div class="auth-brand">
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
          </svg>
          <span>TourMate</span>
        </div>
        <h2 class="auth-title">Welcome back</h2>
        <p class="auth-subtitle">Sign in to your account</p>
        <form [formGroup]="form" (ngSubmit)="submit()" autocomplete="off">
          <div class="input-group">
            <label for="email">{{ translation.t('ui.email') }}</label>
            <input id="email" class="tm-input" formControlName="email" placeholder="you@example.com" type="email" autocomplete="off" />
          </div>
          <div class="input-group">
            <label for="password">{{ translation.t('auth.password') }}</label>
            <div class="pw-wrap">
              <input id="password" class="tm-input" formControlName="password" placeholder="Enter your password" [type]="showPw ? 'text' : 'password'" autocomplete="current-password" />
              <button type="button" class="pw-toggle" (click)="showPw = !showPw">
                @if (showPw) {
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                } @else {
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                }
              </button>
            </div>
          </div>
          <button class="tm-btn tm-btn-primary auth-btn" type="submit" [disabled]="form.invalid || submitting">
            @if (submitting) {
              <span class="btn-spinner"></span> Signing in...
            } @else {
              {{ translation.t('ui.login') }}
            }
          </button>
        </form>
        <div class="auth-links">
          <a routerLink="/register">{{ translation.t('ui.register') }}</a>
          <a routerLink="/forgot">{{ translation.t('ui.forgotPassword') }}</a>
        </div>
        @if (error) { <div class="auth-error">{{ error }}</div> }
      </div>
    </div>
  `,
  styles: [authStyles],
})
export class LoginComponent {
  auth = inject(AuthService);
  translation = inject(TranslationService);
  fb = inject(FormBuilder);
  router = inject(Router);
  error = '';
  submitting = false;
  showPw = false;

  constructor() {
    if (this.auth.isAuthenticated()) {
      const role = this.auth.user?.role?.toLowerCase();
      const route = role === 'admin' ? '/app/admin/dashboard'
        : role === 'driver' ? '/app/driver'
        : role === 'guide' ? '/app/guide'
        : '/app/home';
      this.router.navigate([route]);
    }
  }

  form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  submit() {
    if (this.form.invalid || this.submitting) return;
    this.submitting = true;
    this.error = '';
    const { email, password } = this.form.getRawValue();
    this.auth.login(email, password).subscribe({
      next: () => {
        this.submitting = false;
        const role = this.auth.user?.role?.toLowerCase();
        const route = role === 'admin' ? '/app/admin/dashboard'
          : role === 'driver' ? '/app/driver'
          : role === 'guide' ? '/app/guide'
          : '/app/home';
        this.router.navigate([route]);
      },
      error: (e) => {
        this.submitting = false;
        this.error = e.error?.message || 'Login failed';
      },
    });
  }
}
