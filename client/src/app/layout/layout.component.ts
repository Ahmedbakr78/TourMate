import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../core/services/auth.service';
import { NotificationService } from '../core/services/notification.service';
import { TranslationService } from '../core/services/translation.service';
import { AppStore } from '../core/store/app.store';
import { IconComponent, IconName } from '../shared/icon.component';
import { BreadcrumbComponent } from '../shared/breadcrumb.component';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule, FormsModule, IconComponent, BreadcrumbComponent],
  template: `
    <div class="shell" [class.sidebar-collapsed]="!store.sidebarOpen()">
      <div class="mobile-header">
        <button class="hamburger" (click)="store.toggleSidebar()" aria-label="Toggle menu">
          <span></span><span></span><span></span>
        </button>
        <span class="mobile-brand">TourMate</span>
        <button class="lang-toggle" (click)="toggleLang()" title="Language">{{ translation.currentLang() === 'en' ? 'AR' : 'EN' }}</button>
      </div>

      <div class="topbar">
        <div class="global-search">
          <svg class="gs-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input class="gs-input" [(ngModel)]="searchQuery" (input)="runSearch()" (focus)="searchOpen = true" placeholder="Search trips, places, tools..." />
          @if (searchOpen && searchResults.length > 0) {
            <div class="gs-dropdown">
              @for (r of searchResults; track r.route) {
                  <a class="gs-item" [routerLink]="r.route" (click)="closeSearch()">
                    <span class="gs-item-icon"><app-icon [name]="r.icon" [size]="16" color="var(--tm-ink)"></app-icon></span>
                    <span class="gs-item-text">{{ translation.t(r.key) }}</span>
                  </a>
              }
            </div>
          }
        </div>
        <button class="topbar-lang" (click)="toggleLang()">{{ translation.currentLang() === 'en' ? 'العربية' : 'English' }}</button>
      </div>

      <div class="sidebar-overlay" [class.show]="store.sidebarOpen()" (click)="store.toggleSidebar()"></div>

      <aside class="sidebar" [class.open]="store.sidebarOpen()">
        <div class="brand">
          <div class="brand-glow"></div>
          <div class="brand-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
            </svg>
          </div>
          <div class="brand-text-wrap">
            <span class="brand-text">TourMate</span>
            <span class="brand-sub">Travel Platform</span>
          </div>
        </div>

        <nav>
          <div class="nav-section">
            <span class="nav-label">{{ translation.t('nav.main') }}</span>
            <a routerLink="/app/home" routerLinkActive="active" class="nav-home">
              <span class="nav-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg></span>
              <span class="nav-text">{{ translation.t('nav.home') }}</span>
            </a>
          </div>

          @if (auth.user?.role === 'admin') {
            <div class="nav-section">
              <span class="nav-label">{{ translation.t('nav.admin') }}</span>
              <a routerLink="/app/admin/dashboard" routerLinkActive="active">
                <span class="nav-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg></span>
                <span class="nav-text">{{ translation.t('nav.dashboard') }}</span>
              </a>
              <a routerLink="/app/admin/users" routerLinkActive="active">
                <span class="nav-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg></span>
                <span class="nav-text">{{ translation.t('nav.users') }}</span>
              </a>
              <a routerLink="/app/admin/guides" routerLinkActive="active">
                <span class="nav-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg></span>
                <span class="nav-text">{{ translation.t('nav.guides') }}</span>
              </a>
              <a routerLink="/app/admin/drivers" routerLinkActive="active">
                <span class="nav-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 17v-3a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v3"/><path d="M2 17v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2"/><circle cx="6" cy="15" r="1.5"/><circle cx="18" cy="15" r="1.5"/></svg></span>
                <span class="nav-text">{{ translation.t('nav.drivers') }}</span>
              </a>
              <a routerLink="/app/admin/trips" routerLinkActive="active">
                <span class="nav-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg></span>
                <span class="nav-text">{{ translation.t('nav.trip_monitoring') }}</span>
              </a>
            </div>
          }

          @if (auth.user?.role === 'tourist' || auth.user?.role === 'admin') {
            <div class="nav-section">
              <span class="nav-label">{{ translation.t('nav.trips') }}</span>
              <a routerLink="/app/trip/list" routerLinkActive="active">
                <span class="nav-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg></span>
                <span class="nav-text">{{ translation.t('nav.my_trips') }}</span>
              </a>
              <a routerLink="/app/trip/shared" routerLinkActive="active">
                <span class="nav-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg></span>
                <span class="nav-text">{{ translation.t('nav.shared_trips') }}</span>
              </a>
              <a routerLink="/app/trip/calendar" routerLinkActive="active">
                <span class="nav-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg></span>
                <span class="nav-text">{{ translation.t('nav.calendar') }}</span>
              </a>
              <a routerLink="/app/trip/new" routerLinkActive="active">
                <span class="nav-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg></span>
                <span class="nav-text">{{ translation.t('nav.new_trip') }}</span>
              </a>
            </div>
            <div class="nav-section">
              <span class="nav-label">{{ translation.t('nav.explore') }}</span>
              <a routerLink="/app/places" routerLinkActive="active">
                <span class="nav-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg></span>
                <span class="nav-text">{{ translation.t('nav.places') }}</span>
              </a>
              <a routerLink="/app/favorites" routerLinkActive="active">
                <span class="nav-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg></span>
                <span class="nav-text">{{ translation.t('ui.favorites') }}</span>
              </a>
              <a routerLink="/app/tools" routerLinkActive="active">
                <span class="nav-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg></span>
                <span class="nav-text">{{ translation.t('ui.tools') }}</span>
              </a>
              <a routerLink="/app/tips" routerLinkActive="active">
                <span class="nav-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18h6M10 22h4M12 2a7 7 0 0 0-4 12.7c.6.5 1 1.3 1 2.3h6c0-1 .4-1.8 1-2.3A7 7 0 0 0 12 2z"/></svg></span>
                <span class="nav-text">{{ translation.t('ui.tips') }}</span>
              </a>
              <a routerLink="/app/lost-items" routerLinkActive="active">
                <span class="nav-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg></span>
                <span class="nav-text">{{ translation.t('nav.lost_found') }}</span>
              </a>
            </div>
          }

          @if (auth.user?.role === 'driver') {
            <div class="nav-section">
              <span class="nav-label">{{ translation.t('nav.driver') }}</span>
              <a routerLink="/app/driver" routerLinkActive="active">
                <span class="nav-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 17v-3a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v3"/><path d="M2 17v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2"/><circle cx="6" cy="15" r="1.5"/><circle cx="18" cy="15" r="1.5"/></svg></span>
                <span class="nav-text">{{ translation.t('nav.dashboard') }}</span>
              </a>
            </div>
          }

          @if (auth.user?.role === 'guide') {
            <div class="nav-section">
              <span class="nav-label">{{ translation.t('nav.guide') }}</span>
              <a routerLink="/app/guide" routerLinkActive="active">
                <span class="nav-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg></span>
                <span class="nav-text">{{ translation.t('nav.dashboard') }}</span>
              </a>
            </div>
          }

          <div class="nav-section">
            <span class="nav-label">{{ translation.t('nav.general') }}</span>
            <a routerLink="/app/notifications" routerLinkActive="active" class="notif-link">
              <span class="nav-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg></span>
              <span class="nav-text">{{ translation.t('nav.notifications') }}</span>
              @if (unreadCount > 0) { <span class="nav-badge">{{ unreadCount > 99 ? '99+' : unreadCount }}</span> }
            </a>
            <a routerLink="/app/change-password" routerLinkActive="active">
              <span class="nav-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg></span>
              <span class="nav-text">{{ translation.t('auth.change_password') }}</span>
            </a>
          </div>
        </nav>

        <div class="user-section">
          <a class="user-card" routerLink="/app/profile" title="View profile">
            <div class="avatar-sm">{{ (auth.user?.name || '?')[0] }}</div>
            <div class="user-details">
              <span class="user-name">{{ auth.user?.name || 'User' }}</span>
              <span class="user-role">{{ auth.user?.role }}</span>
            </div>
            <svg class="user-chev" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18l6-6-6-6"/></svg>
          </a>
          <div class="user-actions">
            <button class="icon-btn bell-trigger" (click)="toggleBell()" [class.active]="bellOpen()" title="Notifications">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
              @if (unreadCount > 0) { <span class="bell-mini-badge">{{ unreadCount > 99 ? '99+' : unreadCount }}</span> }
            </button>
            @if (bellOpen()) {
              <div class="bell-dropdown">
                <div class="bell-head">
                  <span>{{ translation.t('ui.notifications') }}</span>
                  @if (unreadCount > 0) {
                    <button class="bell-markall" (click)="markAllRead()">{{ translation.t('ui.markAllRead') }}</button>
                  }
                </div>
                <div class="bell-list">
                  @for (n of bellItems; track n._id) {
                    <div class="bell-item" [class.unread]="!n.read" (click)="openNotif(n._id)">
                      <div class="bell-dot" [class.on]="!n.read"></div>
                      <div class="bell-body">
                        <span class="bell-title">{{ n.title }}</span>
                        <span class="bell-text">{{ n.message }}</span>
                      </div>
                    </div>
                  } @empty {
                    <div class="bell-empty">{{ translation.t('ui.noData') }}</div>
                  }
                </div>
                <a class="bell-footer" routerLink="/app/notifications" (click)="bellOpen.set(false)">{{ translation.t('ui.viewAll') }}</a>
              </div>
            }
            <span class="action-divider"></span>
            <button class="icon-btn" (click)="toggleLang()" title="Language">{{ translation.currentLang() === 'en' ? 'AR' : 'EN' }}</button>
            <a routerLink="/app/settings" class="icon-btn" title="Settings">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
            </a>
            <button class="icon-btn" title="Logout" (click)="logout()">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
            </button>
          </div>
        </div>
      </aside>
      <main class="content">
        <app-breadcrumb></app-breadcrumb>
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: [`
    :host { --nav-w: 248px; }

    .shell { display: flex; min-height: 100vh; }

    .mobile-header {
      display: none;
      align-items: center;
      justify-content: space-between;
      padding: 0.6rem 1rem;
      background: var(--tm-surface);
      border-bottom: 1px solid var(--glass-border);
      position: sticky;
      top: 0;
      z-index: 200;
    }
    .hamburger {
      display: flex;
      flex-direction: column;
      gap: 4px;
      background: none;
      border: none;
      cursor: pointer;
      padding: 4px;
    }
    .hamburger span {
      display: block;
      width: 20px;
      height: 2px;
      background: var(--tm-text);
      border-radius: 2px;
      transition: 0.2s;
    }
    .mobile-brand { font-weight: 700; font-size: 1rem; }
    .lang-toggle { background: none; border: 1px solid var(--glass-border); border-radius: 6px; padding: 0.25rem 0.5rem; font-size: 0.72rem; font-weight: 700; color: var(--tm-text); cursor: pointer; }

    .topbar {
      display: none;
      align-items: center;
      gap: 0.75rem;
      padding: 0.6rem 1rem;
      background: var(--tm-surface);
      border-bottom: 1px solid var(--glass-border);
      position: sticky;
      top: 0;
      z-index: 150;
    }
    .global-search { position: relative; flex: 1; }
    .gs-icon { position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: var(--tm-muted); pointer-events: none; }
    .gs-input {
      width: 100%; padding: 0.5rem 0.75rem 0.5rem 2.2rem; border-radius: 999px;
      border: 1px solid var(--glass-border); background: rgba(255,255,255,0.04); color: var(--tm-text); font-size: 0.85rem;
    }
    .gs-input:focus { outline: none; border-color: var(--tm-primary); }
    .gs-dropdown {
      position: absolute; top: calc(100% + 0.4rem); left: 0; right: 0;
      background: var(--tm-surface-raised); border: 1px solid var(--glass-border);
      border-radius: 10px; padding: 0.35rem; box-shadow: 0 12px 40px rgba(0,0,0,0.4); z-index: 200;
    }
    .gs-item { display: flex; align-items: center; gap: 0.5rem; padding: 0.5rem 0.6rem; border-radius: 8px; text-decoration: none; color: var(--tm-text); font-size: 0.85rem; transition: background 0.15s; }
    .gs-item:hover { background: var(--glass-hover); }
    .gs-item-icon { font-size: 1rem; }
    .topbar-lang { background: none; border: 1px solid var(--glass-border); border-radius: 999px; padding: 0.4rem 0.8rem; font-size: 0.75rem; font-weight: 600; color: var(--tm-text); cursor: pointer; white-space: nowrap; }

    .bell-btn {
      position: relative; width: 38px; height: 38px; border-radius: 10px; flex-shrink: 0;
      background: rgba(255,255,255,0.04); border: 1px solid var(--glass-border); color: var(--tm-muted);
      cursor: pointer; display: flex; align-items: center; justify-content: center; transition: 0.2s;
    }
    .bell-btn:hover, .bell-btn.active { color: var(--tm-text); background: rgba(255,255,255,0.08); border-color: var(--tm-primary); }
    .bell-badge {
      position: absolute; top: -4px; right: -4px; min-width: 17px; height: 17px; padding: 0 0.3rem;
      background: var(--tm-ink); color: #fff; font-size: 0.58rem; font-weight: 700;
      border-radius: 999px; display: flex; align-items: center; justify-content: center;
    }
    .bell-trigger { position: relative; }
    .bell-mini-badge {
      position: absolute; top: 0; right: 0; min-width: 13px; height: 13px; padding: 0 0.2rem;
      background: var(--tm-ink); color: #fff; font-size: 0.5rem; font-weight: 700;
      border-radius: 999px; display: flex; align-items: center; justify-content: center;
    }
    .bell-dropdown {
      position: absolute; bottom: calc(100% + 0.5rem); left: 0; width: 320px; max-width: min(320px, calc(100vw - 2rem));
      background: var(--tm-surface-raised); border: 1px solid var(--glass-border); border-radius: 12px; z-index: 300;
      box-shadow: 0 16px 48px rgba(0,0,0,0.5); overflow: hidden;
    }
    .bell-head { display: flex; justify-content: space-between; align-items: center; padding: 0.7rem 0.9rem; border-bottom: 1px solid var(--glass-border); font-weight: 700; font-size: 0.85rem; }
    .bell-markall { background: none; border: none; color: var(--tm-primary); font-size: 0.72rem; cursor: pointer; font-weight: 600; }
    .bell-list { max-height: 320px; overflow-y: auto; }
    .bell-item { display: flex; gap: 0.6rem; padding: 0.7rem 0.9rem; cursor: pointer; border-bottom: 1px solid rgba(255,255,255,0.03); transition: background 0.15s; }
    .bell-item:hover { background: var(--glass-hover); }
    .bell-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--tm-muted); opacity: 0.4; margin-top: 5px; flex-shrink: 0; }
    .bell-dot.on { background: var(--tm-primary); opacity: 1; box-shadow: 0 0 6px rgba(17,17,17,0.6); }
    .bell-body { display: flex; flex-direction: column; gap: 0.15rem; min-width: 0; }
    .bell-title { font-size: 0.82rem; font-weight: 600; color: var(--tm-text); }
    .bell-text { font-size: 0.76rem; color: var(--tm-muted); overflow: hidden; text-overflow: ellipsis; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; }
    .bell-empty { padding: 2rem; text-align: center; color: var(--tm-muted); font-size: 0.82rem; }
    .bell-footer { display: block; padding: 0.6rem; text-align: center; font-size: 0.78rem; color: var(--tm-primary); font-weight: 600; text-decoration: none; border-top: 1px solid var(--glass-border); }
    .bell-footer:hover { background: var(--glass-hover); }

    .sidebar-overlay {
      display: none;
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,0.5);
      backdrop-filter: blur(2px);
      z-index: 99;
    }

    .sidebar {
      width: var(--nav-w);
      background: var(--tm-surface);
      border-right: 1px solid var(--glass-border);
      display: flex;
      flex-direction: column;
      position: sticky;
      top: 0;
      height: 100vh;
      overflow: hidden;
      z-index: 100;
      flex-shrink: 0;
    }
    .sidebar::before {
      content: '';
      position: absolute;
      inset: 0;
      pointer-events: none;
      background:
        radial-gradient(ellipse 600px 300px at 50% -50%, rgba(17,17,17,0.06), transparent),
        radial-gradient(ellipse 400px 200px at 80% 100%, rgba(17,17,17,0.03), transparent);
    }

    .brand {
      display: flex;
      align-items: center;
      gap: 0.7rem;
      padding: 1.1rem 1rem 0.85rem;
      margin: 0 0.75rem;
      border-bottom: 1px solid var(--glass-border);
      position: relative;
    }
    .brand-glow {
      position: absolute;
      left: -1rem;
      top: -1rem;
      width: 80px;
      height: 80px;
      background: radial-gradient(circle, rgba(17,17,17,0.15), transparent 70%);
      pointer-events: none;
    }
    .brand-icon {
      width: 38px;
      height: 38px;
      border-radius: 11px;
      background: var(--tm-ink);
      display: flex;
      align-items: center;
      justify-content: center;
      color: #fff;
      flex-shrink: 0;
      box-shadow: 0 2px 14px rgba(17,17,17,0.18);
      position: relative;
      z-index: 1;
    }
    .brand-text-wrap {
      display: flex;
      flex-direction: column;
      position: relative;
      z-index: 1;
    }
    .brand-text {
      font-family: var(--tm-font);
      font-weight: 500;
      font-size: 1.35rem;
      color: var(--tm-ink);
      letter-spacing: 0.01em;
      line-height: 1.1;
    }
    .brand-sub {
      font-size: 0.58rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.34em;
      color: var(--tm-muted);
      opacity: 0.7;
      line-height: 1;
      padding-left: 0.05rem;
    }

    nav {
      display: flex;
      flex-direction: column;
      gap: 0.15rem;
      flex: 1;
      overflow-y: auto;
      padding: 0.35rem 0.65rem 0.5rem;
      scrollbar-width: thin;
      scrollbar-color: transparent transparent;
      position: relative;
      z-index: 1;
    }
    nav:hover { scrollbar-color: var(--glass-border) transparent; }
    nav::-webkit-scrollbar { width: 3px; }
    nav::-webkit-scrollbar-thumb { background: var(--glass-border); border-radius: 3px; visibility: hidden; }
    nav:hover::-webkit-scrollbar-thumb { visibility: visible; }

    .nav-section { margin-bottom: 0.1rem; }
    .nav-label {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.6rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.22em;
      color: var(--tm-muted);
      opacity: 0.7;
      padding: 0.6rem 0.75rem 0.35rem;
      user-select: none;
    }
    .nav-label::after {
      content: '';
      flex: 1;
      height: 1px;
      background: var(--tm-line);
    }

    nav a {
      display: flex;
      align-items: center;
      gap: 0.7rem;
      padding: 0.56rem 0.75rem;
      border-radius: 10px;
      color: var(--tm-text-secondary);
      text-decoration: none;
      font-size: 0.86rem;
      font-weight: 500;
      letter-spacing: 0.005em;
      transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
      position: relative;
      margin: 1px 0;
      cursor: pointer;
    }
    nav a::before {
      content: '';
      position: absolute;
      left: -0.65rem;
      top: 50%;
      transform: translateY(-50%) scaleY(0);
      width: 3px;
      height: 16px;
      border-radius: 0 3px 3px 0;
      background: var(--tm-ink);
      transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }
    nav a.active::before {
      transform: translateY(-50%) scaleY(1);
    }
    .nav-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 30px;
      height: 30px;
      border-radius: 8px;
      flex-shrink: 0;
      transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
    }
    nav a:not(.active):hover {
      background: var(--tm-line);
      color: var(--tm-ink);
    }
    nav a:not(.active):hover .nav-icon {
      background: #fff;
    }
    nav a:not(.active):hover .nav-text {
      color: var(--tm-ink);
    }
    nav a.active {
      background: var(--tm-ink);
      color: #fff;
    }
    nav a.active .nav-icon {
      background: rgba(255,255,255,0.12);
      color: #fff;
    }
    nav a.active .nav-text {
      color: #fff;
      font-weight: 600;
    }

    .notif-link { position: relative; }
    .nav-badge {
      margin-left: auto;
      background: var(--tm-ink);
      color: #fff;
      font-size: 0.58rem;
      font-weight: 700;
      padding: 0.1rem 0.38rem;
      border-radius: 999px;
      min-width: 17px;
      text-align: center;
      line-height: 1.4;
    }

    .user-section {
      border-top: 1px solid var(--tm-line);
      padding: 0.85rem 0.75rem 0.9rem;
      margin: 0 0.65rem 0.65rem;
      display: flex;
      flex-direction: column;
      gap: 0.7rem;
      position: relative;
      z-index: 1;
    }
    .user-card {
      display: flex;
      align-items: center;
      gap: 0.7rem;
      min-width: 0;
      padding: 0.25rem 0.35rem;
      border-radius: 12px;
      text-decoration: none;
      cursor: pointer;
      transition: background 0.2s;
    }
    .user-card:hover { background: var(--tm-line); }
    .avatar-sm {
      width: 42px;
      height: 42px;
      border-radius: 50%;
      background: var(--tm-ink);
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: var(--tm-font);
      font-weight: 600;
      font-size: 1.25rem;
      flex-shrink: 0;
      box-shadow: 0 2px 10px rgba(17,17,17,0.22);
      line-height: 1;
    }
    .user-details {
      display: flex;
      flex-direction: column;
      min-width: 0;
      flex: 1;
    }
    .user-name {
      font-size: 0.9rem;
      font-weight: 600;
      color: var(--tm-ink);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      line-height: 1.25;
    }
    .user-role {
      font-size: 0.6rem;
      text-transform: uppercase;
      letter-spacing: 0.18em;
      color: var(--tm-muted);
      line-height: 1.4;
    }
    .user-chev {
      color: var(--tm-muted);
      opacity: 0.6;
      flex-shrink: 0;
      transition: transform 0.2s;
    }
    .user-card:hover .user-chev { opacity: 1; transform: translateX(2px); }
    .user-actions {
      display: flex;
      align-items: center;
      gap: 0.15rem;
      padding: 0.15rem;
      border-top: 1px solid var(--tm-line);
      padding-top: 0.6rem;
      position: relative;
    }
    .action-divider {
      width: 1px;
      height: 18px;
      background: var(--tm-line);
      margin: 0 0.25rem;
      flex-shrink: 0;
    }
    .icon-btn {
      width: 34px;
      height: 34px;
      border-radius: 9px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: none;
      border: none;
      color: var(--tm-muted);
      cursor: pointer;
      transition: all 0.2s;
      text-decoration: none;
      font-size: 0.65rem;
      font-weight: 700;
      opacity: 0.85;
    }
    .icon-btn:hover {
      background: var(--tm-line);
      color: var(--tm-ink);
      opacity: 1;
    }

    .content {
      flex: 1;
      padding: 1.5rem 2rem;
      overflow-y: auto;
      height: 100vh;
      min-width: 0;
    }

    @media (max-width: 768px) {
      .mobile-header { display: flex; }
      .topbar { display: flex; }
      .sidebar {
        position: fixed;
        left: 0;
        top: 0;
        height: 100vh;
        z-index: 100;
        transform: translateX(-100%);
        transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        box-shadow: 4px 0 24px rgba(0,0,0,0.3);
      }
      .sidebar.open { transform: translateX(0); }
      .sidebar-overlay.show { display: block; }
      .content { padding: 1rem; }
      .shell { padding-top: 0; }
    }

    @media (max-width: 480px) {
      .content { padding: 0.75rem; }
    }
  `],
})
export class LayoutComponent implements OnInit {
  auth = inject(AuthService);
  translation = inject(TranslationService);
  store = inject(AppStore);
  private notifService = inject(NotificationService);
  private router = inject(Router);
  unreadCount = 0;
  bellOpen = signal(false);
  bellItems: any[] = [];

  searchQuery = '';
  searchOpen = false;
  searchResults: { label: string; key: string; route: string; icon: IconName }[] = [];

  private searchIndex = [
    { label: 'My Trips', key: 'ui.myTrips', route: '/app/trip/list', icon: 'trip' as IconName },
    { label: 'New Trip', key: 'ui.newTrip', route: '/app/trip/new', icon: 'plus' as IconName },
    { label: 'Shared Trips', key: 'ui.sharedTrips', route: '/app/trip/shared', icon: 'share' as IconName },
    { label: 'Trip Calendar', key: 'ui.calendar', route: '/app/trip/calendar', icon: 'calendar' as IconName },
    { label: 'Places', key: 'ui.places', route: '/app/places', icon: 'map' as IconName },
    { label: 'Favorites', key: 'ui.favorites', route: '/app/favorites', icon: 'heart' as IconName },
    { label: 'Travel Tools', key: 'ui.tools', route: '/app/tools', icon: 'wrench' as IconName },
    { label: 'Travel Tips', key: 'ui.tips', route: '/app/tips', icon: 'bulb' as IconName },
    { label: 'Lost & Found', key: 'ui.lostFound', route: '/app/lost-items', icon: 'search' as IconName },
    { label: 'Notifications', key: 'ui.notifications', route: '/app/notifications', icon: 'bell' as IconName },
    { label: 'Profile', key: 'ui.profile', route: '/app/profile', icon: 'user' as IconName },
    { label: 'Settings', key: 'ui.settings', route: '/app/settings', icon: 'gear' as IconName },
    { label: 'Account & Security', key: 'ui.settings', route: '/app/settings', icon: 'shield' as IconName },
  ];

  ngOnInit() {
    if (this.auth.isAuthenticated()) {
      this.refreshNotif();
    }
  }

  refreshNotif() {
    this.notifService.getUnreadCount().subscribe({
      next: (res) => this.unreadCount = res.data?.unreadCount || 0,
      error: () => {},
    });
  }

  toggleBell() {
    this.bellOpen.update(v => !v);
    if (this.bellOpen()) {
      this.notifService.getAll({ limit: 6, sort: '-createdAt' }).subscribe({
        next: (res) => { this.bellItems = res.data?.notifications || res.data || []; },
        error: () => { this.bellItems = []; },
      });
    }
  }

  openNotif(id: string) {
    this.notifService.markAsRead(id).subscribe({
      next: () => {
        const n = this.bellItems.find(x => x._id === id);
        if (n) n.read = true;
        this.refreshNotif();
      },
      error: () => {},
    });
  }

  markAllRead() {
    this.notifService.markAllAsRead().subscribe({
      next: () => { this.bellItems.forEach(n => n.read = true); this.refreshNotif(); },
      error: () => {},
    });
  }

  runSearch() {
    const q = this.searchQuery.trim().toLowerCase();
    if (!q) { this.searchResults = []; return; }
    this.searchResults = this.searchIndex.filter(s => s.label.toLowerCase().includes(q)).slice(0, 8);
  }

  closeSearch() {
    this.searchOpen = false;
    this.searchQuery = '';
    this.searchResults = [];
  }

  toggleLang() {
    const next = this.translation.currentLang() === 'en' ? 'ar' : 'en';
    this.translation.setLang(next);
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
