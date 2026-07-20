import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { GuideService } from '../../core/services/guide.service';
import { ToastService } from '../../core/services/toast.service';
import { IconComponent } from '../../shared/icon.component';
import { TranslationService } from '../../core/services/translation.service';

@Component({
  selector: 'app-guide-profile',
  standalone: true,
  imports: [CommonModule, RouterLink, IconComponent],
  template: `
    <div class="page">
      <div class="page-header">
        <div>
          <h2 style="margin:0">{{ translation.t('guide.profile') }}</h2>
          <p class="muted" style="margin:0.2rem 0 0">Manage your guiding profile</p>
        </div>
        <label class="avail-toggle">
          <span>{{ translation.t('ui.available') }}</span>
          <span class="toggle">
            <input type="checkbox" [checked]="isAvailable()" (change)="toggleAvailability()" />
            <span class="toggle-slider"></span>
          </span>
        </label>
      </div>

      @if (loading) {
        <div class="tm-loader"></div>
      } @else if (error) {
        <div class="error-box">{{ error }}</div>
      } @else {
        <div class="profile-card">
          <div class="avatar-wrap">
            @if (avatarUrl) {
              <img [src]="avatarUrl" class="avatar" />
            } @else {
              <div class="avatar placeholder">{{ (guide?.name || user?.name || '?')[0] }}</div>
            }
          </div>
          <div class="profile-meta">
            <h3 style="margin:0">{{ guide?.name || user?.name }}</h3>
            <span class="meta-line">{{ guide?.email || user?.email }}</span>
            <span class="meta-line">{{ guide?.phone || user?.phone }}</span>
          </div>
        </div>

        <div class="info-grid">
          <div class="info-card">
            <app-icon name="globe" [size]="18"></app-icon>
            <div>
              <strong>{{ translation.t('ui.languages') }}</strong>
              <span>{{ languagesText }}</span>
            </div>
          </div>
          <div class="info-card">
            <app-icon name="clock" [size]="18"></app-icon>
            <div>
              <strong>{{ translation.t('ui.experience') }}</strong>
              <span>{{ experienceText }}</span>
            </div>
          </div>
        </div>

        <div class="cert-section">
          <div class="section-head">
            <h3 style="margin:0">{{ translation.t('ui.certificate') }}</h3>
          </div>
          <div class="cert-card">
            @if (certificateUrl) {
              <div class="cert-preview">
                <app-icon name="doc" [size]="28"></app-icon>
                <a [href]="certificateUrl" target="_blank" rel="noopener" class="cert-link">
                  <app-icon name="eye" [size]="14"></app-icon> {{ translation.t('guide.view_certificate') }}
                </a>
              </div>
            } @else {
              <div class="cert-empty">
                <app-icon name="doc" [size]="28"></app-icon>
                <span>{{ translation.t('guide.no_certificate') }}</span>
              </div>
            }
            <label class="tm-btn tm-btn-sm">
              <app-icon name="upload" [size]="14"></app-icon>
              {{ certificateUrl ? translation.t('ui.replace') : translation.t('ui.upload') }} {{ translation.t('ui.certificate') }}
              <input type="file" accept="image/*,application/pdf" hidden (change)="uploadCertificate($event)" [disabled]="uploading" />
            </label>
            @if (uploading) { <span class="cert-status">{{ translation.t('ui.uploading') }}</span> }
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; flex-wrap: wrap; gap: 0.5rem; }

    .avail-toggle { display: flex; align-items: center; gap: 0.5rem; font-size: 0.85rem; font-weight: 600; }
    .toggle { position: relative; display: inline-block; width: 40px; height: 22px; cursor: pointer; }
    .toggle input { opacity: 0; width: 0; height: 0; }
    .toggle-slider { position: absolute; inset: 0; background: var(--tm-muted); border-radius: 999px; transition: 0.2s; }
    .toggle-slider::before { content: ''; position: absolute; width: 18px; height: 18px; border-radius: 50%; background: #fff; top: 2px; left: 2px; transition: 0.2s; }
    .toggle input:checked + .toggle-slider { background: var(--tm-success); }
    .toggle input:checked + .toggle-slider::before { transform: translateX(18px); }

    .error-box { padding: 1rem; background: rgba(239,68,68,0.1); border: 1px solid rgba(239,68,68,0.2); border-radius: 10px; color: #a33a32; }

    .profile-card { display: flex; align-items: center; gap: 1rem; background: var(--tm-surface); border: 1px solid var(--glass-border); border-radius: 12px; padding: 1.25rem; margin-bottom: 1.5rem; }
    .avatar-wrap { width: 72px; height: 72px; border-radius: 50%; overflow: hidden; flex-shrink: 0; }
    .avatar { width: 100%; height: 100%; object-fit: cover; }
    .avatar.placeholder { background: var(--tm-primary); color: #fff; display: flex; align-items: center; justify-content: center; font-size: 1.6rem; font-weight: 700; }
    .profile-meta h3 { font-size: 1.1rem; }
    .meta-line { display: block; font-size: 0.85rem; color: var(--tm-muted); margin-top: 0.2rem; }

    .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1.5rem; }
    .info-card { display: flex; align-items: flex-start; gap: 0.75rem; background: var(--tm-surface); border: 1px solid var(--glass-border); border-radius: 12px; padding: 1rem; }
    .info-card app-icon { color: var(--tm-primary); margin-top: 0.1rem; flex-shrink: 0; }
    .info-card strong { display: block; font-size: 0.78rem; text-transform: uppercase; letter-spacing: 0.04em; color: var(--tm-muted); }
    .info-card span { display: block; font-size: 0.92rem; margin-top: 0.2rem; }

    .section-head { margin-bottom: 0.75rem; }
    .cert-card { display: flex; align-items: center; justify-content: space-between; gap: 1rem; background: var(--tm-surface); border: 1px solid var(--glass-border); border-radius: 12px; padding: 1.25rem; flex-wrap: wrap; }
    .cert-preview, .cert-empty { display: flex; align-items: center; gap: 0.6rem; color: var(--tm-muted); }
    .cert-empty app-icon { opacity: 0.5; }
    .cert-link { display: inline-flex; align-items: center; gap: 0.3rem; color: var(--tm-primary); text-decoration: none; font-weight: 600; font-size: 0.85rem; }
    .cert-status { font-size: 0.82rem; color: var(--tm-muted); }
  `],
})
export class GuideProfileComponent implements OnInit {
  private auth = inject(AuthService);
  translation = inject(TranslationService);
  private guideService = inject(GuideService);
  private toast = inject(ToastService);

  guideId = '';
  guide: any = null;
  loading = true;
  error = '';
  isAvailable = signal(false);
  uploading = false;

  get user() { return this.auth.user; }
  get avatarUrl() { return this.guide?.profileImage?.secure_url || this.user?.profileImage?.secure_url; }
  get certificateUrl(): string | null {
    return this.guide?.certificate?.secure_url || this.guide?.certificateUrl || null;
  }
  get languagesText(): string {
    const langs = this.guide?.languages;
    if (Array.isArray(langs) && langs.length) return langs.join(', ');
    if (typeof langs === 'string' && langs) return langs;
    return 'Not specified';
  }
  get experienceText(): string {
    const exp = this.guide?.experience;
    if (exp === 0 || exp) return `${exp} year(s)`;
    return 'Not specified';
  }

  ngOnInit() {
    this.guideId = this.auth.user?._id || '';
    this.loadGuide();
  }

  loadGuide() {
    this.loading = true; this.error = '';
    this.guideService.getById(this.guideId).subscribe({
      next: (res) => {
        this.guide = res.data || res;
        this.isAvailable.set(this.guide?.availability === 'available');
        this.loading = false;
      },
      error: (e) => {
        this.loading = false;
        this.error = e.error?.message || 'Failed to load profile';
        this.guide = this.user;
      },
    });
  }

  toggleAvailability() {
    this.isAvailable.update(v => !v);
    this.guideService.updateAvailability(this.guideId, this.isAvailable() ? 'available' : 'offline').subscribe({
      next: () => this.toast.success(this.isAvailable() ? 'You are now available' : 'You are now unavailable'),
      error: () => this.toast.error('Failed to update availability'),
    });
  }

  uploadCertificate(event: any) {
    const file = event.target.files?.[0];
    if (!file) return;
    this.uploading = true;
    this.guideService.uploadCertificate(this.guideId, file).subscribe({
      next: (res) => {
        this.uploading = false;
        this.guide = res.data || res;
        this.toast.success('Certificate uploaded');
      },
      error: (e) => {
        this.uploading = false;
        this.toast.error(e.error?.message || 'Upload failed');
      },
    });
  }
}
