import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  template: `
    <div class="auth-wrap">
      <div class="tm-card auth-box">
        <h2>TourMate Login</h2>
        <form [formGroup]="form" (ngSubmit)="submit()">
          <input class="tm-input" formControlName="email" placeholder="Email" type="email" />
          <input class="tm-input" formControlName="password" placeholder="Password" type="password" />
          <button class="tm-btn" type="submit" [disabled]="form.invalid">Sign In</button>
        </form>
        <p class="links">
          <a routerLink="/register">Register</a> ·
          <a routerLink="/forgot">Forgot password?</a>
        </p>
        @if (error) { <p class="err">{{ error }}</p> }
      </div>
    </div>
  `,
  styles: [
    `
      .auth-wrap { min-height: 100vh; display: grid; place-items: center; }
      .auth-box { width: 340px; }
      .links { margin-top: 0.8rem; font-size: 0.9rem; }
      .err { color: var(--tm-danger); }
    `,
  ],
})
export class LoginComponent {
  auth = inject(AuthService);
  fb = inject(FormBuilder);
  router = inject(Router);
  error = '';

  form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  submit() {
    if (this.form.invalid) return;
    const { email, password } = this.form.getRawValue();
    this.auth.login(email, password).subscribe({
      next: () => this.router.navigate(['/app/admin/dashboard']),
      error: (e) => (this.error = e.error?.message || 'Login failed'),
    });
  }
}
