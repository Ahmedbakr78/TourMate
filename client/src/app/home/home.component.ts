import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../core/services/auth.service';
import { TripService, Trip } from '../core/services/trip.service';
import { ToastService } from '../core/services/toast.service';
import { TranslationService } from '../core/services/translation.service';
import { IconComponent } from '../shared/icon.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, IconComponent],
  template: `
    <div class="page">
      @if (auth.user?.role === 'tourist') {
        <div class="welcome-section">
          <div class="welcome-text">
            <h1>Welcome back, {{ auth.user?.name }}</h1>
            <p class="muted">Here's your travel overview</p>
          </div>
          <a routerLink="/app/trip/new" class="tm-btn">
            <app-icon name="plus" [size]="18"></app-icon>
            {{ translation.t('ui.newTrip') }}
          </a>
        </div>

        @if (loading) {
          <div class="tm-loader"></div>
        } @else {
          <div class="stats-grid">
            <div class="stat-card">
              <div class="stat-icon blue"><app-icon name="trip" [size]="22"></app-icon></div>
              <span class="stat-num">{{ totalTrips }}</span>
              <span class="stat-label">Total Trips</span>
            </div>
            <div class="stat-card">
              <div class="stat-icon green"><app-icon name="calendar" [size]="22"></app-icon></div>
              <span class="stat-num">{{ upcomingTrips }}</span>
              <span class="stat-label">Upcoming</span>
            </div>
            <div class="stat-card">
              <div class="stat-icon purple"><app-icon name="check" [size]="22"></app-icon></div>
              <span class="stat-num">{{ completedCount }}</span>
              <span class="stat-label">{{ translation.t('ui.completed') }}</span>
            </div>
            <div class="stat-card">
              <div class="stat-icon orange"><app-icon name="map" [size]="22"></app-icon></div>
              <span class="stat-num">{{ totalPlaces }}</span>
              <span class="stat-label">Places Visited</span>
            </div>
          </div>

          <div class="section">
            <div class="section-header">
              <h3>Quick Actions</h3>
            </div>
            <div class="quick-actions">
              <a routerLink="/app/trip/new" class="action-card">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
                <span>Create Trip</span>
                <small>Plan a new adventure</small>
              </a>
              <a routerLink="/app/trip/list" class="action-card">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
                <span>{{ translation.t('ui.myTrips') }}</span>
                <small>View all your trips</small>
              </a>
              <a routerLink="/app/trip/calendar" class="action-card">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                <span>{{ translation.t('ui.calendar') }}</span>
                <small>View trips by date</small>
              </a>
              <a routerLink="/app/places" class="action-card">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                <span>{{ translation.t('ui.places') }}</span>
                <small>Discover destinations</small>
              </a>
              <a routerLink="/app/lost-items" class="action-card">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                <span>{{ translation.t('ui.lostFound') }}</span>
                <small>Report lost items</small>
              </a>
              <a routerLink="/app/notifications" class="action-card">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
                <span>{{ translation.t('ui.notifications') }}</span>
                <small>View alerts</small>
              </a>
            </div>
          </div>

          @if (upcomingList.length > 0) {
            <div class="section">
              <div class="section-header">
                <h3>Upcoming Trips</h3>
                <a routerLink="/app/trip/list" class="see-all">{{ translation.t('ui.viewAll') }}</a>
              </div>
              <div class="upcoming-list">
                @for (trip of upcomingList.slice(0, 3); track trip._id) {
                  <a [routerLink]="['/app/trip', trip._id]" class="upcoming-card">
                    <div class="upcoming-date">
                      <span class="up-month">{{ trip.startDate | date:'MMM' }}</span>
                      <span class="up-day">{{ trip.startDate | date:'d' }}</span>
                    </div>
                    <div class="upcoming-info">
                      <strong>{{ trip.places.length }} place{{ trip.places.length !== 1 ? 's' : '' }}</strong>
                      <span class="muted">{{ trip.peopleCount }} traveler{{ trip.peopleCount !== 1 ? 's' : '' }} - \${{ trip.price }}</span>
                    </div>
                     <span class="badge badge-{{ trip.status.toLowerCase() }}">{{ translation.t('ui.' + trip.status.toLowerCase()) }}</span>
                   </a>
                 }
               </div>
             </div>
           }

           @if (recentTrips.length > 0) {
             <div class="section">
               <div class="section-header">
                 <h3>Recent Trips</h3>
               </div>
               <div class="recent-list">
                 @for (trip of recentTrips.slice(0, 3); track trip._id) {
                   <a [routerLink]="['/app/trip', trip._id]" class="recent-card">
                     <div class="recent-main">
                       <span class="badge badge-{{ trip.status.toLowerCase() }}">{{ translation.t('ui.' + trip.status.toLowerCase()) }}</span>
                       <span>{{ trip.places.length }} {{ translation.t('ui.places') }} - {{ trip.peopleCount }} people</span>
                    </div>
                    <span class="recent-date">{{ trip.startDate | date:'MMM d, yyyy' }}</span>
                  </a>
                }
              </div>
            </div>
          }
        }
      } @else if (auth.user?.role === 'admin') {
        <div class="welcome-section">
          <h1>{{ translation.t('ui.dashboard') }}</h1>
          <p class="muted">Manage the platform</p>
        </div>
        <div class="quick-actions">
          <a routerLink="/app/admin/dashboard" class="action-card">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
            <span>{{ translation.t('ui.statistics') }}</span>
            <small>System overview</small>
          </a>
          <a routerLink="/app/admin/users" class="action-card">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
            <span>{{ translation.t('ui.users') }}</span>
            <small>Manage users</small>
          </a>
          <a routerLink="/app/admin/trips" class="action-card">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
            <span>{{ translation.t('nav.trip_monitoring') }}</span>
            <small>Live tracking</small>
          </a>
        </div>
      } @else if (auth.user?.role === 'driver' || auth.user?.role === 'guide') {
        <div class="welcome-section">
          <h1>{{ translation.t(auth.user?.role === 'driver' ? 'nav.driver' : 'nav.guide') }} {{ translation.t('ui.dashboard') }}</h1>
          <p class="muted">Manage your assignments</p>
        </div>
        <div class="quick-actions">
          <a [routerLink]="auth.user?.role === 'driver' ? '/app/driver' : '/app/guide'" class="action-card">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><path d="M3 9h18"/><path d="M9 21V9"/></svg>
            <span>{{ translation.t('ui.dashboard') }}</span>
            <small>View your trips</small>
          </a>
          <a routerLink="/app/notifications" class="action-card">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
            <span>{{ translation.t('ui.notifications') }}</span>
            <small>View alerts</small>
          </a>
        </div>
      }
    </div>
  `,
  styles: [`
    .welcome-section { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 2rem; }
    .welcome-section h1 { font-size: 1.6rem; margin: 0; }
    .welcome-text p { margin: 0.2rem 0 0; }

    .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; margin-bottom: 2rem; }
    .stat-card {
      background: var(--tm-surface); border: 1px solid var(--glass-border); border-radius: 12px;
      padding: 1.25rem; display: flex; flex-direction: column; align-items: center; gap: 0.25rem;
      transition: all 0.2s;
    }
    .stat-card:hover { background: var(--tm-surface-raised); transform: translateY(-2px); }
    .stat-icon { width: 44px; height: 44px; border-radius: 12px; display: flex; align-items: center; justify-content: center; margin-bottom: 0.25rem; }
    .stat-icon.blue { background: rgba(17,17,17,0.12); color: var(--tm-ink); }
    .stat-icon.green { background: rgba(34,197,94,0.12); color: #3f7a52; }
    .stat-icon.purple { background: rgba(17,17,17,0.12); color: var(--tm-ink); }
    .stat-icon.orange { background: rgba(17,17,17,0.12); color: var(--tm-ink); }
    .stat-num { font-size: 1.8rem; font-weight: 800; }
    .stat-label { font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.04em; color: var(--tm-muted); font-weight: 600; }

    .section { margin-bottom: 2rem; }
    .section-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem; }
    .section-header h3 { margin: 0; font-size: 1rem; }
    .see-all { font-size: 0.82rem; color: var(--tm-primary); }

    .quick-actions { display: grid; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 0.75rem; }
    .action-card {
      background: var(--tm-surface); border: 1px solid var(--glass-border); border-radius: 12px;
      padding: 1.25rem 1rem; text-align: center; text-decoration: none; color: inherit;
      transition: all 0.2s;
    }
    .action-card:hover { background: var(--tm-surface-raised); transform: translateY(-3px); border-color: rgba(17,17,17,0.2); }
    .action-card svg { color: var(--tm-primary); margin-bottom: 0.5rem; }
    .action-card span { display: block; font-weight: 600; font-size: 0.88rem; margin-bottom: 0.15rem; }
    .action-card small { display: block; font-size: 0.75rem; color: var(--tm-muted); }

    .upcoming-list { display: flex; flex-direction: column; gap: 0.5rem; }
    .upcoming-card {
      display: flex; align-items: center; gap: 1rem;
      background: var(--tm-surface); border: 1px solid var(--glass-border); border-radius: 12px;
      padding: 1rem; text-decoration: none; color: inherit; transition: all 0.2s;
    }
    .upcoming-card:hover { background: var(--tm-surface-raised); }
    .upcoming-date { text-align: center; min-width: 48px; }
    .up-month { display: block; font-size: 0.7rem; text-transform: uppercase; color: var(--tm-muted); font-weight: 600; }
    .up-day { display: block; font-size: 1.3rem; font-weight: 800; color: var(--tm-primary); line-height: 1.2; }
    .upcoming-info { flex: 1; }
    .upcoming-info strong { display: block; font-size: 0.9rem; }
    .upcoming-info span { font-size: 0.8rem; }

    .recent-list { display: flex; flex-direction: column; gap: 0.4rem; }
    .recent-card {
      display: flex; justify-content: space-between; align-items: center;
      background: var(--tm-surface); border: 1px solid var(--glass-border); border-radius: 10px;
      padding: 0.85rem 1rem; text-decoration: none; color: inherit; transition: all 0.15s;
    }
    .recent-card:hover { background: var(--tm-surface-raised); }
    .recent-main { display: flex; align-items: center; gap: 0.75rem; font-size: 0.85rem; }
    .recent-date { font-size: 0.8rem; color: var(--tm-muted); }
  `]
})
export class HomeComponent implements OnInit {
  auth = inject(AuthService);
  translation = inject(TranslationService);
  private tripService = inject(TripService);
  private toast = inject(ToastService);
  trips: Trip[] = [];
  loading = true;

  get totalTrips() { return this.trips.length; }
  get upcomingTrips() { return this.trips.filter(t => t.status === 'DRAFT' || t.status === 'PENDING' || t.status === 'CONFIRMED').length; }
  get completedCount() { return this.trips.filter(t => t.status === 'COMPLETED').length; }
  get activeCount() { return this.trips.filter(t => t.status === 'ONGOING').length; }
  get totalPlaces() { return this.trips.reduce((sum, t) => sum + (t.places?.length || 0), 0); }
  get upcomingList() { return this.trips.filter(t => t.status === 'DRAFT' || t.status === 'PENDING' || t.status === 'CONFIRMED'); }
  get recentTrips() { return [...this.trips].sort((a, b) => new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime()); }

  ngOnInit() {
    if (this.auth.user?.role === 'tourist') {
      this.tripService.getMyTrips().subscribe({
        next: (res) => { this.trips = res.data || []; this.loading = false; },
        error: () => { this.loading = false; },
      });
    } else {
      this.loading = false;
    }
  }
}
