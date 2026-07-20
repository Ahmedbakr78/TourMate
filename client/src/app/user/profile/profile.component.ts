import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';
import { UserService } from '../../core/services/user.service';
import { ToastService } from '../../core/services/toast.service';
import { ModalComponent } from '../../shared/modal.component';
import { TranslationService } from '../../core/services/translation.service';
import { IconComponent } from '../../shared/icon.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, CommonModule, ModalComponent, IconComponent],
  template: `
    <div class="page">
      <div class="page-header">
        <div>
          <h2 style="margin:0">{{ translation.t('ui.profile') }}</h2>
          <p class="muted" style="margin:0.2rem 0 0">Manage your account</p>
        </div>
        <a routerLink="/app" class="tm-btn tm-btn-outline tm-btn-sm">{{ translation.t('ui.back') }}</a>
      </div>

      <div class="profile-layout">
        <div class="profile-card-main">
          <div class="avatar-section">
            <div class="avatar-wrap">
              @if (previewUrl || avatarUrl) {
                <img [src]="previewUrl || avatarUrl" class="avatar" />
              } @else {
                <div class="avatar placeholder">{{ (user?.name || '?')[0] }}</div>
              }
            </div>
            <div class="avatar-actions">
              <label class="tm-btn tm-btn-sm">
                <app-icon name="upload" [size]="14"></app-icon>
                {{ translation.t('ui.uploadImage') }}
                <input type="file" (change)="uploadImage($event)" accept="image/*" hidden />
              </label>
              @if (avatarUrl) {
                <button class="tm-btn tm-btn-sm tm-btn-danger" (click)="deleteImage()">
                  <app-icon name="trash" [size]="14"></app-icon>
                  {{ translation.t('ui.delete') }}
                </button>
              }
            </div>
          </div>

          <form [formGroup]="form" (ngSubmit)="submit()" class="profile-form">
            <div class="form-row">
              <label>{{ translation.t('ui.name') }}</label>
              <input class="tm-input" formControlName="name" placeholder="Your name" />
            </div>
            <div class="form-row">
              <label>{{ translation.t('ui.email') }}</label>
              <input class="tm-input" formControlName="email" type="email" placeholder="Email" />
            </div>
            <div class="form-row">
              <label>{{ translation.t('ui.phone') }}</label>
              <input class="tm-input" formControlName="phone" placeholder="Phone number" type="tel" />
            </div>
            <div class="form-row">
              <label>{{ translation.t('ui.role') }}</label>
              <input class="tm-input" [value]="user?.role" disabled style="opacity:0.5" />
            </div>
            <button class="tm-btn" type="submit" [disabled]="form.invalid || submitting">
              @if (submitting) { <span class="btn-spinner"></span> Saving... } @else { {{ translation.t('ui.save') }} }
            </button>
          </form>
          @if (done) { <div class="success-msg">Profile updated</div> }
          @if (error) { <div class="error-msg">{{ error }}</div> }

          <div class="danger-zone">
            <button class="tm-btn tm-btn-danger tm-btn-sm" (click)="deleteModalOpen = true">
              <app-icon name="trash" [size]="14"></app-icon> {{ translation.t('ui.deleteAccount') }}
            </button>
          </div>
        </div>

        <div class="profile-sidebar">
          <a routerLink="/app/change-password" class="sidebar-card">
            <app-icon name="lock" [size]="20"></app-icon>
            <div>
              <strong>{{ translation.t('ui.changePassword') }}</strong>
              <span>Update your password</span>
            </div>
          </a>
          <a routerLink="/app/notifications" class="sidebar-card">
            <app-icon name="bell" [size]="20"></app-icon>
            <div>
              <strong>{{ translation.t('ui.notifications') }}</strong>
              <span>View your alerts</span>
            </div>
          </a>
        </div>
      </div>
    </div>

    <app-modal [open]="deleteModalOpen" [title]="translation.t('ui.deleteAccount')" [confirmLabel]="translation.t('ui.deleteAccount')"
      [showFooter]="true" (close)="deleteModalOpen = false" (confirm)="confirmDelete()">
      <p>This will permanently delete your account and all associated data. This action cannot be undone.</p>
    </app-modal>
  `,
  styles: [`
    .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
    .profile-layout { display: grid; grid-template-columns: 1fr 240px; gap: 1rem; align-items: start; }
    .profile-card-main { background: var(--tm-surface); border: 1px solid var(--glass-border); border-radius: 12px; padding: 2rem; }
    .avatar-section { display: flex; flex-direction: column; align-items: center; gap: 0.75rem; margin-bottom: 1.5rem; }
    .avatar-wrap { width: 88px; height: 88px; border-radius: 50%; overflow: hidden; }
    .avatar { width: 100%; height: 100%; object-fit: cover; }
    .avatar.placeholder { background: var(--tm-primary); color: white; display: flex; align-items: center; justify-content: center; font-size: 2rem; font-weight: 700; }
    .avatar-actions { display: flex; gap: 0.5rem; }
    .profile-form { max-width: 400px; margin: 0 auto; }
    .form-row label { display: block; font-size: 0.78rem; font-weight: 600; color: var(--tm-muted); margin-bottom: 0.35rem; text-transform: uppercase; letter-spacing: 0.04em; }
    .btn-spinner { width: 16px; height: 16px; border: 2px solid rgba(255,255,255,0.3); border-top-color: #fff; border-radius: 50%; animation: spin 0.5s linear infinite; display: inline-block; vertical-align: middle; margin-right: 0.3rem; }
    @keyframes spin { to { transform: rotate(360deg); } }
    .success-msg { margin-top: 1rem; padding: 0.6rem; background: rgba(34,197,94,0.1); border: 1px solid rgba(34,197,94,0.2); border-radius: 8px; color: #3f7a52; font-size: 0.85rem; text-align: center; }
    .error-msg { margin-top: 1rem; padding: 0.6rem; background: rgba(239,68,68,0.1); border: 1px solid rgba(239,68,68,0.2); border-radius: 8px; color: #a33a32; font-size: 0.85rem; text-align: center; }
    .danger-zone { max-width: 400px; margin: 1.5rem auto 0; text-align: center; border-top: 1px solid var(--glass-border); padding-top: 1rem; }
    .profile-sidebar { display: flex; flex-direction: column; gap: 0.5rem; }
    .sidebar-card {
      display: flex; align-items: center; gap: 0.75rem;
      background: var(--tm-surface); border: 1px solid var(--glass-border); border-radius: 10px;
      padding: 1rem; text-decoration: none; color: inherit; transition: all 0.15s;
    }
    .sidebar-card:hover { background: var(--tm-surface-raised); }
    .sidebar-card app-icon { color: var(--tm-primary); flex-shrink: 0; }
    .sidebar-card strong { display: block; font-size: 0.88rem; }
    .sidebar-card span { display: block; font-size: 0.78rem; color: var(--tm-muted); }
  `],
})
export class ProfileComponent implements OnInit {
  auth = inject(AuthService);
  translation = inject(TranslationService);
  userService = inject(UserService);
  toast = inject(ToastService);
  router = inject(Router);
  fb = inject(FormBuilder);
  done = false;
  error = '';
  submitting = false;
  previewUrl: string | null = null;
  deleteModalOpen = false;

  form = this.fb.nonNullable.group({
    name: [''],
    email: [''],
    phone: [''],
  });

  get user() { return this.auth.user; }
  get avatarUrl() { return this.user?.profileImage?.secure_url; }

  ngOnInit() {
    this.loadProfile();
  }

  loadProfile() {
    this.userService.getProfile().subscribe({
      next: (res: any) => {
        const u = res.data || res;
        if (u) this.auth.updateCurrentUser(u);
        this.patchForm();
      },
      error: () => this.patchForm(),
    });
  }

  private patchForm() {
    this.form.patchValue({
      name: this.user?.name || '',
      email: this.user?.email || '',
      phone: this.user?.phone || '',
    });
  }

  submit() {
    if (this.form.invalid || this.submitting) return;
    this.submitting = true;
    this.error = '';
    this.userService.updateProfile(this.form.getRawValue()).subscribe({
      next: (res: any) => {
        const u = res.data || res;
        if (u) this.auth.updateCurrentUser(u);
        this.done = true;
        this.submitting = false;
        setTimeout(() => this.done = false, 3000);
      },
      error: (e) => { this.submitting = false; this.error = e.error?.message || 'Update failed'; },
    });
  }

  uploadImage(event: any) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (this.previewUrl) URL.revokeObjectURL(this.previewUrl);
    this.previewUrl = URL.createObjectURL(file);
    this.userService.uploadImage(file).subscribe({
      next: (res: any) => {
        const u = res.data || res;
        if (u) this.auth.updateCurrentUser(u);
        this.previewUrl = null;
        this.toast.success('Photo updated');
      },
      error: (e) => { this.previewUrl = null; this.error = e.error?.message || 'Upload failed'; },
    });
  }

  deleteImage() {
    this.userService.deleteImage().subscribe({
      next: () => {
        this.auth.updateCurrentUser({ profileImage: undefined } as any);
        this.toast.success('Photo removed');
      },
      error: (e) => this.error = e.error?.message || 'Delete failed',
    });
  }

  confirmDelete() {
    this.deleteModalOpen = false;
    this.userService.deleteAccount().subscribe({
      next: () => {
        this.auth.logout();
        this.toast.success('Account deleted');
        this.router.navigateByUrl('/login');
      },
      error: (e) => this.toast.error(e.error?.message || 'Failed to delete account'),
    });
  }
}
