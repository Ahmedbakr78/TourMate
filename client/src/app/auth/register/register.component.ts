import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ToastService } from '../../core/services/toast.service';
import { Role } from '../../core/models/user.model';
import { TranslationService } from '../../core/services/translation.service';
import { authStyles } from '../auth-styles';

@Component({
  selector: 'app-register',
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
        <h2 class="auth-title">{{ translation.t('ui.register') }}</h2>
        <p class="auth-subtitle">Join TourMate today</p>
        <form [formGroup]="form" (ngSubmit)="submit()">
          <div class="input-group">
            <label>{{ translation.t('ui.name') }}</label>
            <input class="tm-input" formControlName="name" placeholder="Your name" />
          </div>
          <div class="input-group">
            <label>{{ translation.t('ui.email') }}</label>
            <input class="tm-input" formControlName="email" placeholder="you@example.com" type="email" />
          </div>
          <div class="input-group">
            <label>{{ translation.t('auth.password') }}</label>
            <input class="tm-input" formControlName="password" placeholder="Min 6 characters" type="password" />
          </div>
          <div class="input-group">
            <label>{{ translation.t('ui.phone') }}</label>
            <input class="tm-input" formControlName="phone" placeholder="+20xxxxxxxxx" type="tel" />
          </div>
          <div class="input-group">
            <label>{{ translation.t('ui.role') }}</label>
            <select class="tm-input" formControlName="role">
              <option value="tourist">Tourist</option>
              <option value="driver">Driver</option>
              <option value="guide">Guide</option>
            </select>
          </div>
          <button class="tm-btn auth-btn" type="submit" [disabled]="form.invalid || submitting">
            @if (submitting) { <span class="btn-spinner"></span> Registering... } @else { {{ translation.t('ui.register') }} }
          </button>
        </form>
        <div class="auth-links"><a routerLink="/login">Already have an account? {{ translation.t('ui.login') }}</a></div>
        @if (error) { <div class="auth-error">{{ error }}</div> }
      </div>
    </div>
  `,
  styles: [authStyles],
})
export class RegisterComponent {
  auth = inject(AuthService);
  translation = inject(TranslationService);
  fb = inject(FormBuilder);
  router = inject(Router);
  toast = inject(ToastService);
  submitting = false;
  error = '';

  constructor() {
    if (this.auth.isAuthenticated()) {
      this.redirectHome();
    }
  }

  private redirectHome() {
    const role = this.auth.user?.role?.toLowerCase();
    const route = role === 'admin' ? '/app/admin/dashboard'
      : role === 'driver' ? '/app/driver'
      : role === 'guide' ? '/app/guide'
      : '/app/home';
    this.router.navigate([route]);
  }

  form = this.fb.nonNullable.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    phone: [''],
    role: ['tourist' as Role, Validators.required],
  });

  submit() {
    if (this.form.invalid) return;
    this.submitting = true;
    this.error = '';
    this.auth.register(this.form.getRawValue()).subscribe({
      next: () => {
        this.toast.success('Account created successfully!');
        this.redirectHome();
      },
      error: (e) => {
        this.submitting = false;
        this.error = e.error?.message || 'Registration failed';
        this.toast.error(this.error);
      },
    });
  }
}
