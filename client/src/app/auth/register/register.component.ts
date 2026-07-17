import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { Role } from '../../core/models/user.model';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  template: `
    <div class="auth-wrap">
      <div class="tm-card auth-box">
        <h2>Create Account</h2>
        <form [formGroup]="form" (ngSubmit)="submit()">
          <input class="tm-input" formControlName="name" placeholder="Full name" />
          <input class="tm-input" formControlName="email" placeholder="Email" type="email" />
          <input class="tm-input" formControlName="password" placeholder="Password" type="password" />
          <select class="tm-input" formControlName="role">
            <option value="tourist">Tourist</option>
            <option value="driver">Driver</option>
            <option value="guide">Guide</option>
          </select>
          <button class="tm-btn" type="submit" [disabled]="form.invalid">Register</button>
        </form>
        <p class="links"><a routerLink="/login">Back to login</a></p>
        @if (error) { <p class="err">{{ error }}</p> }
      </div>
    </div>
  `,
  styles: [
    `
      .auth-wrap { min-height: 100vh; display: grid; place-items: center; }
      .auth-box { width: 360px; }
      .links { margin-top: 0.8rem; font-size: 0.9rem; }
      .err { color: var(--tm-danger); }
    `,
  ],
})
export class RegisterComponent {
  auth = inject(AuthService);
  fb = inject(FormBuilder);
  router = inject(Router);
  error = '';

  form = this.fb.nonNullable.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    role: ['tourist' as Role, Validators.required],
  });

  submit() {
    if (this.form.invalid) return;
    this.auth.register(this.form.getRawValue()).subscribe({
      next: () => this.router.navigate(['/app/admin/dashboard']),
      error: (e) => (this.error = e.error?.message || 'Registration failed'),
    });
  }
}
