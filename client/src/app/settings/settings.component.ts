import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../core/services/auth.service';
import { ApiService } from '../core/services/api.service';
import { ToastService } from '../core/services/toast.service';
import { TranslationService } from '../core/services/translation.service';
import { LocalService } from '../core/services/local.service';
import { AppStore } from '../core/store/app.store';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  template: `
    <div class="page">
      <div class="page-header">
        <div>
          <h2 style="margin:0">{{ translation.t('ui.settings') }}</h2>
          <p class="muted" style="margin:0.2rem 0 0">Manage your preferences and security</p>
        </div>
      </div>

      <div class="settings-layout">
        <div class="settings-nav">
          <button class="settings-tab" [class.active]="activeTab === 'profile'" (click)="activeTab = 'profile'">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            {{ translation.t('ui.profile') }}
          </button>
          <button class="settings-tab" [class.active]="activeTab === 'security'" (click)="activeTab = 'security'">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            Security
          </button>
          <button class="settings-tab" [class.active]="activeTab === 'preferences'" (click)="activeTab = 'preferences'">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
            Preferences
          </button>
          <button class="settings-tab" [class.active]="activeTab === 'account'" (click)="activeTab = 'account'">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
            Account Info
          </button>
          <button class="settings-tab" [class.active]="activeTab === 'theme'" (click)="activeTab = 'theme'">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/></svg>
            Theme
          </button>
          <button class="settings-tab" [class.active]="activeTab === 'data'" (click)="activeTab = 'data'">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg>
            Data & Privacy
          </button>
          <button class="settings-tab" [class.active]="activeTab === 'documents'" (click)="activeTab = 'documents'">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
            Documents
          </button>
          <button class="settings-tab" [class.active]="activeTab === 'language'" (click)="activeTab = 'language'">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
             {{ translation.t('ui.language') }}
           </button>
           <button class="settings-tab" [class.active]="activeTab === 'accessibility'" (click)="activeTab = 'accessibility'">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M5 19l2-2M17 7l2-2"/></svg>
            Accessibility
          </button>
        </div>

        <div class="settings-content">
          @switch (activeTab) {
            @case ('profile') {
              <div class="settings-card">
                <h3>{{ translation.t('ui.profile') }}</h3>
                <p class="muted">Update your personal details</p>
                <form [formGroup]="profileForm" (ngSubmit)="updateProfile()">
                  <div class="form-row">
                    <label>{{ translation.t('ui.name') }}</label>
                    <input class="tm-input" formControlName="name" placeholder="Your name" />
                  </div>
                  <div class="form-row">
                    <label>{{ translation.t('ui.phone') }}</label>
                    <input class="tm-input" formControlName="phone" placeholder="Phone number" type="tel" />
                  </div>
                  <div class="form-row">
                    <label>Avatar</label>
                    <div class="avatar-controls">
                      <div class="avatar-preview">
                        @if (avatarUrl) {
                          <img [src]="avatarUrl" class="avatar-img" />
                        } @else {
                          <div class="avatar-placeholder">{{ (auth.user?.name || '?')[0] }}</div>
                        }
                      </div>
                      <div class="avatar-btns">
                        <label class="tm-btn tm-btn-sm">
                          {{ translation.t('ui.uploadImage') }}
                          <input type="file" (change)="uploadImage($event)" accept="image/*" hidden />
                        </label>
                        @if (avatarUrl) {
                          <button class="tm-btn tm-btn-sm tm-btn-danger" (click)="deleteImage()">{{ translation.t('ui.delete') }}</button>
                        }
                      </div>
                    </div>
                  </div>
                  <button class="tm-btn" type="submit" [disabled]="profileForm.invalid || profileSubmitting">
                    @if (profileSubmitting) { Saving... } @else { {{ translation.t('ui.save') }} }
                  </button>
                </form>
                @if (profileDone) { <div class="success-msg">Profile updated</div> }
                @if (profileError) { <div class="error-msg">{{ profileError }}</div> }
              </div>
            }
            @case ('security') {
              <div class="settings-card">
                <h3>{{ translation.t('ui.changePassword') }}</h3>
                <p class="muted">Update your account password</p>
                <form [formGroup]="passwordForm" (ngSubmit)="changePassword()">
                  <div class="form-row">
                    <label>{{ translation.t('auth.current_password') }}</label>
                    <input class="tm-input" formControlName="currentPassword" placeholder="Enter current password" type="password" />
                  </div>
                  <div class="form-row">
                    <label>{{ translation.t('auth.new_password') }}</label>
                    <input class="tm-input" formControlName="newPassword" placeholder="Min 6 characters" type="password" />
                  </div>
                  <button class="tm-btn" type="submit" [disabled]="passwordForm.invalid || passwordSubmitting">
                    @if (passwordSubmitting) { Changing... } @else { {{ translation.t('ui.changePassword') }} }
                  </button>
                </form>
                @if (passwordDone) { <div class="success-msg">Password changed!</div> }
                @if (passwordError) { <div class="error-msg">{{ passwordError }}</div> }
              </div>
            }
            @case ('preferences') {
              <div class="settings-card">
                <h3>Preferences</h3>
                <p class="muted">Customize your experience</p>
                <div class="pref-row">
                  <div class="pref-info">
                    <strong>Email Notifications</strong>
                    <span class="muted">Receive trip updates via email</span>
                  </div>
                  <label class="toggle">
                    <input type="checkbox" [checked]="prefs.emailNotifs" (change)="togglePref('emailNotifs')" />
                    <span class="toggle-slider"></span>
                  </label>
                </div>
                <div class="pref-row">
                  <div class="pref-info">
                    <strong>SMS Notifications</strong>
                    <span class="muted">Receive trip alerts via SMS</span>
                  </div>
                  <label class="toggle">
                    <input type="checkbox" [checked]="prefs.smsNotifs" (change)="togglePref('smsNotifs')" />
                    <span class="toggle-slider"></span>
                  </label>
                </div>
                <div class="pref-row">
                  <div class="pref-info">
                    <strong>Share Trip by Default</strong>
                    <span class="muted">Auto-share new trips</span>
                  </div>
                  <label class="toggle">
                    <input type="checkbox" [checked]="prefs.autoShare" (change)="togglePref('autoShare')" />
                    <span class="toggle-slider"></span>
                  </label>
                </div>
                <div class="pref-row">
                  <div class="pref-info">
                    <strong>Compact View</strong>
                    <span class="muted">Use compact card layout</span>
                  </div>
                  <label class="toggle">
                    <input type="checkbox" [checked]="prefs.compactView" (change)="togglePref('compactView')" />
                    <span class="toggle-slider"></span>
                  </label>
                </div>
                 <button class="tm-btn" (click)="savePrefs()">{{ translation.t('ui.save') }}</button>
                @if (prefsDone) { <div class="success-msg">Preferences saved</div> }
              </div>
            }
            @case ('account') {
              <div class="settings-card">
                <h3>Account Details</h3>
                <p class="muted">Your account information</p>
                <div class="info-rows">
                  <div class="info-row">
                    <span class="info-lbl">{{ translation.t('ui.email') }}</span>
                    <span class="info-val">{{ auth.user?.email }}</span>
                  </div>
                  <div class="info-row">
                    <span class="info-lbl">{{ translation.t('ui.role') }}</span>
                    <span class="info-val role-badge">{{ auth.user?.role }}</span>
                  </div>
                  <div class="info-row">
                    <span class="info-lbl">{{ translation.t('ui.status') }}</span>
                    <span class="info-val"><span class="status-dot" [class.active]="auth.user?.status === 'ACTIVE'"></span> {{ auth.user?.status }}</span>
                  </div>
                  <div class="info-row">
                    <span class="info-lbl">User ID</span>
                    <span class="info-val mono">{{ auth.user?._id }}</span>
                  </div>
                  <div class="info-row">
                    <span class="info-lbl">Joined</span>
                    <span class="info-val">N/A</span>
                  </div>
                </div>
              </div>
              <div class="settings-card danger-card">
                <h3>Danger Zone</h3>
                <p class="muted">Irreversible actions</p>
                <button class="tm-btn tm-btn-danger" (click)="deleteAccount()" [disabled]="deleteConfirm < 3">
                   @if (deleteConfirm === 0) {
                    {{ translation.t('ui.deleteAccount') }}
                  } @else {
                    {{ translation.t('ui.confirm') }} ({{ 3 - deleteConfirm }})
                  }
                </button>
                @if (deleteConfirm > 0 && deleteConfirm < 3) {
                  <p class="muted" style="margin-top:0.5rem">Tap {{ 3 - deleteConfirm }} more time{{ 3 - deleteConfirm !== 1 ? 's' : '' }} to confirm</p>
                }
              </div>
            }
            @case ('theme') {
              <div class="settings-card">
                <h3>Theme Customization</h3>
                <p class="muted">Choose your accent color</p>
                <div class="color-picker">
                  @for (c of accentColors; track c.name) {
                    <button class="color-swatch" [style.background]="c.color" [class.active]="selectedAccent === c.name" (click)="setAccent(c.name, c.color)" [title]="c.name">
                      @if (selectedAccent === c.name) {
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>
                      }
                    </button>
                  }
                </div>
                <div class="pref-row">
                  <div class="pref-info">
                    <strong>Dark Mode</strong>
                    <span class="muted">Toggle dark/light theme</span>
                  </div>
                  <label class="toggle">
                    <input type="checkbox" [checked]="prefs.darkMode" (change)="togglePref('darkMode'); applyTheme()" />
                    <span class="toggle-slider"></span>
                  </label>
                </div>
                <button class="tm-btn" (click)="savePrefs()">{{ translation.t('ui.save') }}</button>
                @if (themeDone) { <div class="success-msg">Theme updated</div> }
              </div>
            }
            @case ('data') {
              <div class="settings-card">
                <h3>Data & Privacy</h3>
                <p class="muted">Manage your data</p>
                <div class="data-actions">
                  <button class="tm-btn tm-btn-outline" (click)="exportAllData()">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                    Export All Data
                  </button>
                  <button class="tm-btn tm-btn-outline" (click)="clearLocalData()">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                    Clear Local Data
                  </button>
                </div>
                @if (dataDone) { <div class="success-msg">{{ dataMsg }}</div> }
              </div>
              <div class="settings-card">
                <h3>Sessions</h3>
                <p class="muted">Active sessions on your account</p>
                <div class="session-list">
                  <div class="session-item">
                    <div class="session-info">
                      <strong>Current Session</strong>
                      <span class="muted">{{ navigatorInfo }}</span>
                    </div>
                    <span class="session-badge">Active now</span>
                  </div>
                </div>
              </div>
            }
            @case ('documents') {
              <div class="settings-card">
                <h3>Travel Documents Checklist</h3>
                <p class="muted">Keep track of your travel documents</p>
                <div class="doc-list">
                  @for (doc of travelDocs; track $index) {
                    <div class="doc-item" [class.doc-checked]="doc.checked">
                      <label class="check-label">
                        <input type="checkbox" [checked]="doc.checked" (change)="toggleDoc($index)" />
                        <span class="check-box">
                          @if (doc.checked) {
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>
                          }
                        </span>
                        <span class="check-text">{{ doc.name }}</span>
                      </label>
                    </div>
                  }
                </div>
                 <button class="tm-btn tm-btn-sm" (click)="resetDocs()">Reset All</button>
                 @if (docsDone) { <div class="success-msg">Documents updated</div> }
               </div>
             }
             @case ('language') {
                <div class="settings-card">
                  <h3>{{ translation.t('ui.language') }}</h3>
                  <p class="muted">Choose your interface language</p>
                 <div class="lang-grid">
                   <button class="lang-card" [class.active]="translation.currentLang() === 'en'" (click)="setLang('en')">
                     <span class="lang-flag">EN</span>
                     <span class="lang-name">English</span>
                     @if (translation.currentLang() === 'en') {
                       <span class="lang-check"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg></span>
                     }
                   </button>
                   <button class="lang-card" [class.active]="translation.currentLang() === 'ar'" (click)="setLang('ar')">
                     <span class="lang-flag">AR</span>
                     <span class="lang-name">العربية</span>
                     @if (translation.currentLang() === 'ar') {
                       <span class="lang-check"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg></span>
                     }
                   </button>
                </div>
              </div>
            }
            @case ('accessibility') {
              <div class="settings-card">
                <h3>Accessibility</h3>
                <p class="muted">Personalize how the app looks and feels</p>
                <div class="pref-row">
                  <div class="pref-info">
                    <strong>Font Size</strong>
                    <span class="muted">Adjust text size</span>
                  </div>
                  <div class="seg-control">
                    <button class="seg-btn" [class.active]="store.fontSize() === 'sm'" (click)="store.setFontSize('sm')">S</button>
                    <button class="seg-btn" [class.active]="store.fontSize() === 'md'" (click)="store.setFontSize('md')">M</button>
                    <button class="seg-btn" [class.active]="store.fontSize() === 'lg'" (click)="store.setFontSize('lg')">L</button>
                  </div>
                </div>
                <div class="pref-row">
                  <div class="pref-info">
                    <strong>Layout Density</strong>
                    <span class="muted">Compact saves space</span>
                  </div>
                  <div class="seg-control">
                    <button class="seg-btn" [class.active]="store.density() === 'comfortable'" (click)="store.setDensity('comfortable')">Comfort</button>
                    <button class="seg-btn" [class.active]="store.density() === 'compact'" (click)="store.setDensity('compact')">Compact</button>
                  </div>
                </div>
                <div class="pref-row">
                  <div class="pref-info">
                    <strong>High Contrast</strong>
                    <span class="muted">Boost readability</span>
                  </div>
                  <label class="toggle">
                    <input type="checkbox" [checked]="store.highContrast()" (change)="store.toggleContrast()" />
                    <span class="toggle-slider"></span>
                  </label>
                </div>
                <div class="pref-row">
                  <div class="pref-info">
                    <strong>Reduce Motion</strong>
                    <span class="muted">Minimize animations</span>
                  </div>
                  <label class="toggle">
                    <input type="checkbox" [checked]="store.reduceMotion()" (change)="store.toggleMotion()" />
                    <span class="toggle-slider"></span>
                  </label>
                </div>
              </div>
              <div class="settings-card">
                <h3>Backup & Restore</h3>
                <p class="muted">Your data is stored locally — export it anywhere</p>
                <div class="data-actions">
                  <button class="tm-btn tm-btn-outline" (click)="exportBackup()">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                    Export Backup
                  </button>
                  <label class="tm-btn tm-btn-outline">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                    Import Backup
                    <input type="file" accept="application/json" (change)="importBackup($event)" hidden />
                  </label>
                </div>
                @if (backupMsg) { <div class="success-msg">{{ backupMsg }}</div> }
              </div>
            }
          }
        </div>
      </div>
    </div>
  `,
  styles: [`
    .page-header { margin-bottom: 1.5rem; }
    .settings-layout { display: grid; grid-template-columns: 200px 1fr; gap: 1rem; align-items: start; }
    .settings-nav { display: flex; flex-direction: column; gap: 0.25rem; background: var(--tm-surface); border: 1px solid var(--glass-border); border-radius: 12px; padding: 0.5rem; }
    .settings-tab {
      display: flex; align-items: center; gap: 0.5rem; width: 100%; text-align: left;
      padding: 0.6rem 0.75rem; border: none; border-radius: 8px;
      background: none; color: var(--tm-muted); font-size: 0.85rem; font-weight: 500;
      cursor: pointer; transition: all 0.15s;
    }
    .settings-tab:hover { background: var(--glass-hover); color: var(--tm-text); }
    .settings-tab.active { background: rgba(17,17,17,0.12); color: var(--tm-primary); }
    .settings-tab svg { flex-shrink: 0; }
    .settings-content { display: flex; flex-direction: column; gap: 1rem; }

    .settings-card { background: var(--tm-surface); border: 1px solid var(--glass-border); border-radius: 12px; padding: 1.5rem; }
    .settings-card h3 { margin: 0 0 0.25rem; font-size: 1rem; }
    .settings-card > p { margin: 0 0 1.25rem; }
    .form-row { margin-bottom: 0.75rem; }
    .form-row label { display: block; font-size: 0.78rem; font-weight: 600; color: var(--tm-muted); margin-bottom: 0.35rem; text-transform: uppercase; letter-spacing: 0.04em; }
    .form-row .tm-input { margin-bottom: 0; }

    .avatar-controls { display: flex; align-items: center; gap: 1rem; }
    .avatar-preview { width: 64px; height: 64px; border-radius: 50%; overflow: hidden; flex-shrink: 0; }
    .avatar-img { width: 100%; height: 100%; object-fit: cover; }
    .avatar-placeholder { width: 100%; height: 100%; background: var(--tm-primary); color: #fff; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; font-weight: 700; }
    .avatar-btns { display: flex; gap: 0.4rem; flex-wrap: wrap; }

    .color-picker { display: flex; gap: 0.5rem; margin-bottom: 1rem; flex-wrap: wrap; }
    .color-swatch { width: 36px; height: 36px; border-radius: 50%; border: 2px solid transparent; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.15s; }
    .color-swatch.active { border-color: var(--tm-text); transform: scale(1.15); }
    .color-swatch:hover { transform: scale(1.1); }

    .data-actions { display: flex; flex-direction: column; gap: 0.5rem; }
    .data-actions .tm-btn { justify-content: center; }

    .session-list { display: flex; flex-direction: column; gap: 0.4rem; }
    .session-item { display: flex; justify-content: space-between; align-items: center; padding: 0.75rem; border: 1px solid var(--glass-border); border-radius: 8px; }
    .session-info strong { display: block; font-size: 0.85rem; }
    .session-info span { font-size: 0.78rem; }
    .session-badge { font-size: 0.72rem; padding: 0.15rem 0.5rem; border-radius: 999px; background: rgba(34,197,94,0.12); color: #3f7a52; font-weight: 600; }

    .doc-list { display: flex; flex-direction: column; gap: 0.3rem; margin-bottom: 0.75rem; }
    .doc-item { padding: 0.5rem 0.75rem; border-radius: 8px; border: 1px solid var(--glass-border); }
    .doc-item.doc-checked { opacity: 0.5; }
    .doc-item .check-label { display: flex; align-items: center; gap: 0.5rem; cursor: pointer; }
    .doc-item .check-label input { display: none; }
    .doc-item .check-box { width: 20px; height: 20px; border-radius: 4px; border: 2px solid var(--tm-muted); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
    .doc-item.doc-checked .check-box { border-color: var(--tm-primary); background: var(--tm-primary); }
    .doc-item .check-box svg { color: #fff; }
    .doc-item .check-text { font-size: 0.88rem; }
    .doc-item.doc-checked .check-text { text-decoration: line-through; }

    .pref-row { display: flex; justify-content: space-between; align-items: center; padding: 0.75rem 0; border-bottom: 1px solid var(--glass-border); }
    .pref-row:last-child { border-bottom: none; }
    .pref-info strong { display: block; font-size: 0.88rem; }
    .pref-info span { font-size: 0.78rem; }

    .toggle { position: relative; display: inline-block; width: 40px; height: 22px; cursor: pointer; }
    .toggle input { opacity: 0; width: 0; height: 0; }
    .toggle-slider {
      position: absolute; inset: 0; background: var(--tm-muted); border-radius: 999px; transition: 0.2s;
    }
    .toggle-slider::before {
      content: ''; position: absolute; width: 18px; height: 18px; border-radius: 50%;
      background: #fff; top: 2px; left: 2px; transition: 0.2s;
    }
    .toggle input:checked + .toggle-slider { background: var(--tm-primary); }
    .toggle input:checked + .toggle-slider::before { transform: translateX(18px); }

    .info-rows { display: flex; flex-direction: column; gap: 0.75rem; }
    .info-row { display: flex; justify-content: space-between; align-items: center; }
    .info-lbl { font-size: 0.85rem; color: var(--tm-muted); }
    .info-val { font-size: 0.88rem; font-weight: 500; display: flex; align-items: center; gap: 0.4rem; }
    .info-val.mono { font-family: monospace; font-size: 0.8rem; }
    .role-badge { padding: 0.15rem 0.5rem; border-radius: 6px; background: rgba(17,17,17,0.12); color: var(--tm-ink); text-transform: capitalize; }
    .status-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--tm-muted); }
    .status-dot.active { background: #3f7a52; }

    .danger-card { border-color: rgba(239,68,68,0.2); }
    .danger-card h3 { color: #a33a32; }

    .success-msg { margin-top: 0.75rem; padding: 0.5rem; background: rgba(34,197,94,0.1); border: 1px solid rgba(34,197,94,0.2); border-radius: 8px; color: #3f7a52; font-size: 0.85rem; text-align: center; }
    .error-msg { margin-top: 0.75rem; padding: 0.5rem; background: rgba(239,68,68,0.1); border: 1px solid rgba(239,68,68,0.2); border-radius: 8px; color: #a33a32; font-size: 0.85rem; text-align: center; }

    .lang-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 0.75rem; }
    .lang-card {
      position: relative; display: flex; flex-direction: column; align-items: center; gap: 0.5rem;
      padding: 1.25rem 1rem; border: 1px solid var(--glass-border); border-radius: 12px;
      background: var(--tm-surface); color: var(--tm-text); cursor: pointer; transition: all 0.15s;
    }
    .lang-card:hover { background: var(--tm-surface-raised); transform: translateY(-2px); }
    .lang-card.active { border-color: var(--tm-primary); background: rgba(17,17,17,0.06); }
    .lang-flag { font-size: 1.3rem; font-weight: 800; }
    .lang-name { font-size: 0.85rem; }
    .lang-check { position: absolute; top: 0.5rem; right: 0.5rem; color: var(--tm-primary); }
    :host-context([dir="rtl"]) .lang-check { right: auto; left: 0.5rem; }
  `]
})
export class SettingsComponent implements OnInit {
  auth = inject(AuthService);
  api = inject(ApiService);
  fb = inject(FormBuilder);
  toast = inject(ToastService);
  translation = inject(TranslationService);
  local = inject(LocalService);
  store = inject(AppStore);

  activeTab: 'profile' | 'security' | 'preferences' | 'account' | 'theme' | 'data' | 'documents' | 'language' | 'accessibility' = 'profile';

  backupMsg = '';

  setLang(lang: 'en' | 'ar') {
    this.translation.setLang(lang);
    this.toast.success(lang === 'en' ? 'Language set to English' : 'تم تعيين اللغة العربية');
  }


  profileForm = this.fb.nonNullable.group({ name: [''], phone: [''] });
  profileSubmitting = false;
  profileDone = false;
  profileError = '';

  passwordForm = this.fb.nonNullable.group({ currentPassword: [''], newPassword: [''] });
  passwordSubmitting = false;
  passwordDone = false;
  passwordError = '';

  prefs = { emailNotifs: true, smsNotifs: false, autoShare: false, compactView: false, darkMode: true };
  prefsDone = false;

  accentColors = [
    { name: 'ink', color: 'var(--tm-ink)' },
    { name: 'graphite', color: '#444444' },
    { name: 'green', color: '#3f7a52' },
    { name: 'stone', color: '#8a8a8a' },
    { name: 'olive', color: '#9a7b3a' },
    { name: 'slate', color: '#5c5c5c' },
    { name: 'brick', color: '#a33a32' },
    { name: 'onyx', color: '#161616' },
  ];
  selectedAccent = 'blue';
  themeDone = false;

  travelDocs = [
    { name: 'Passport', checked: false },
    { name: 'Visa', checked: false },
    { name: 'Travel Insurance', checked: false },
    { name: 'Flight Tickets', checked: false },
    { name: 'Hotel Reservations', checked: false },
    { name: 'Driver License', checked: false },
    { name: 'International Permit', checked: false },
    { name: 'Vaccination Certificate', checked: false },
    { name: 'Emergency Contacts', checked: false },
    { name: 'Copy of Passport', checked: false },
  ];
  docsDone = false;

  dataDone = false;
  dataMsg = '';
  deleteConfirm = 0;

  get navigatorInfo() {
    return `${navigator.platform || 'Unknown'} - ${navigator.userAgent?.substring(0, 50) || ''}`;
  }

  get avatarUrl() { return this.auth.user?.profileImage?.secure_url; }

  ngOnInit() {
    const saved = localStorage.getItem('tm_prefs');
    if (saved) { this.prefs = { ...this.prefs, ...JSON.parse(saved) }; }
    if (this.auth.user) {
      this.profileForm.patchValue({ name: this.auth.user.name, phone: this.auth.user.phone || '' });
    }
    const accent = localStorage.getItem('tm_accent');
    if (accent) {
      this.selectedAccent = accent;
      const found = this.accentColors.find(c => c.name === accent);
      if (found) {
        document.documentElement.style.setProperty('--tm-primary', found.color);
        document.documentElement.style.setProperty('--tm-primary-dark', found.color);
      }
    }
    const docs = localStorage.getItem('tm_travel_docs');
    if (docs) { try { this.travelDocs = JSON.parse(docs); } catch {} }
    this.applyTheme();
  }

  updateProfile() {
    if (this.profileForm.invalid || this.profileSubmitting) return;
    this.profileSubmitting = true; this.profileError = '';
    this.api.patch('/auth/profile', this.profileForm.getRawValue()).subscribe({
      next: () => { this.profileDone = true; this.profileSubmitting = false; setTimeout(() => this.profileDone = false, 3000); },
      error: (e) => { this.profileSubmitting = false; this.profileError = e.error?.message || 'Update failed'; },
    });
  }

  changePassword() {
    if (this.passwordForm.invalid || this.passwordSubmitting) return;
    this.passwordSubmitting = true; this.passwordError = '';
    const { currentPassword, newPassword } = this.passwordForm.getRawValue();
    this.auth.changePassword(currentPassword, newPassword).subscribe({
      next: () => { this.passwordDone = true; this.passwordSubmitting = false; this.passwordForm.reset(); },
      error: (e) => { this.passwordSubmitting = false; this.passwordError = e.error?.message || 'Failed'; },
    });
  }

  togglePref(key: keyof typeof this.prefs) { this.prefs[key] = !this.prefs[key]; }

  savePrefs() {
    localStorage.setItem('tm_prefs', JSON.stringify(this.prefs));
    this.prefsDone = true;
    setTimeout(() => this.prefsDone = false, 2000);
  }

  setAccent(name: string, color: string) {
    this.selectedAccent = name;
    document.documentElement.style.setProperty('--tm-primary', color);
    document.documentElement.style.setProperty('--tm-primary-dark', color);
    localStorage.setItem('tm_accent', name);
    this.themeDone = true;
    setTimeout(() => this.themeDone = false, 2000);
  }

  applyTheme() {
    document.documentElement.style.setProperty('--tm-bg', this.prefs.darkMode ? '#0a0a0a' : '#f4f4f2');
    document.documentElement.style.setProperty('--tm-text', this.prefs.darkMode ? '#f4f4f2' : '#0f0f0f');
    document.documentElement.style.setProperty('--tm-surface', this.prefs.darkMode ? '#161616' : '#ffffff');
    document.documentElement.style.setProperty('--tm-surface-raised', this.prefs.darkMode ? '#1e1e1e' : '#ffffff');
    document.documentElement.style.setProperty('--tm-muted', this.prefs.darkMode ? '#8a8a8a' : '#6b6b6b');
    this.savePrefs();
  }

  exportAllData() {
    const data: Record<string, any> = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        try { data[key] = JSON.parse(localStorage.getItem(key) || ''); }
        catch { data[key] = localStorage.getItem(key); }
      }
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'tourmate-data-export.json'; a.click();
    URL.revokeObjectURL(url);
    this.dataMsg = 'Data exported successfully';
    this.dataDone = true;
    setTimeout(() => this.dataDone = false, 3000);
  }

  clearLocalData() {
    const keysToKeep = ['tm_token', 'tm_prefs', 'tm_accent'];
    for (let i = localStorage.length - 1; i >= 0; i--) {
      const key = localStorage.key(i);
      if (key && !keysToKeep.includes(key)) localStorage.removeItem(key);
    }
    this.dataMsg = 'Local data cleared (kept login & preferences)';
    this.dataDone = true;
    setTimeout(() => this.dataDone = false, 3000);
  }

  toggleDoc(idx: number) {
    this.travelDocs[idx].checked = !this.travelDocs[idx].checked;
    localStorage.setItem('tm_travel_docs', JSON.stringify(this.travelDocs));
    this.docsDone = true;
    setTimeout(() => this.docsDone = false, 1500);
  }

  resetDocs() {
    this.travelDocs.forEach(d => d.checked = false);
    localStorage.setItem('tm_travel_docs', JSON.stringify(this.travelDocs));
  }

  deleteAccount() {
    this.deleteConfirm++;
    if (this.deleteConfirm >= 3) {
      this.api.delete('/auth/account').subscribe({
        next: () => { this.toast.success('Account deleted'); this.auth.logout(); },
        error: (e) => this.toast.error(e.error?.message || 'Failed'),
      });
    }
  }

  uploadImage(event: any) {
    const file = event.target.files?.[0];
    if (!file) return;
    const fd = new FormData();
    fd.append('image', file);
    this.api.post('/users/profile-image', fd).subscribe({
      next: () => { window.location.reload(); },
      error: (e) => this.profileError = e.error?.message || 'Upload failed',
    });
  }

  deleteImage() {
    this.api.delete('/users/profile-image').subscribe({
      next: () => { window.location.reload(); },
      error: (e) => this.profileError = e.error?.message || 'Delete failed',
    });
  }

  exportBackup() {
    const json = this.local.exportAll();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'tourmate-backup.json'; a.click();
    URL.revokeObjectURL(url);
    this.backupMsg = 'Backup exported successfully';
    setTimeout(() => this.backupMsg = '', 3000);
  }

  importBackup(event: any) {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const ok = this.local.importAll(reader.result as string);
      this.backupMsg = ok ? 'Backup restored!' : 'Invalid backup file';
      setTimeout(() => this.backupMsg = '', 3000);
      if (ok) window.location.reload();
    };
    reader.readAsText(file);
  }
}
