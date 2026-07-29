import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-forgot',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  template: `
    <div class="auth-wrap">
      <div class="tm-card auth-box">
        <h2>Reset Password</h2>
        <p>Enter your email and we'll send a reset link.</p>
        <form [formGroup]="form" (ngSubmit)="submit()">
          <input class="tm-input" formControlName="email" placeholder="Email" type="email" />
          <button class="tm-btn" type="submit" [disabled]="form.invalid">Send reset link</button>
        </form>
        <p class="links"><a routerLink="/login">Back to login</a></p>
        @if (done) { <p class="ok">If the email exists, a link was sent.</p> }
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
      .ok { color: var(--tm-success); }
    `,
  ],
})
export class ForgotComponent {
  auth = inject(AuthService);
  fb = inject(FormBuilder);
  router = inject(Router);
  done = false;
  error = '';

  form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
  });

  submit() {
    if (this.form.invalid) return;
    this.auth.forgotPassword(this.form.value.email!).subscribe({
      next: () => (this.done = true),
      error: (e) => (this.error = e.error?.message || 'Request failed'),
    });
  }
}
