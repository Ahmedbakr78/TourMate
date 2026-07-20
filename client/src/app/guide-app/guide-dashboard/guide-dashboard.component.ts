import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TripService, Trip } from '../../core/services/trip.service';
import { ToastService } from '../../core/services/toast.service';
import { GuideService } from '../../core/services/guide.service';
import { AuthService } from '../../core/services/auth.service';
import { StatCardComponent } from '../../shared/stat-card.component';
import { TranslationService } from '../../core/services/translation.service';

@Component({
  selector: 'app-guide-dashboard',
  standalone: true,
  imports: [CommonModule, StatCardComponent],
  template: `
    <div class="page">
      <div class="page-header">
        <div>
          <h2 style="margin:0">{{ translation.t('guide.dashboard') }}</h2>
          <p class="muted" style="margin:0.2rem 0 0">Manage your guiding trips</p>
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
        <div class="stats-row">
          <app-stat-card [value]="upcoming" label="{{ translation.t('ui.upcoming') }}"></app-stat-card>
          <app-stat-card [value]="completedTrips" label="{{ translation.t('ui.completed') }}"></app-stat-card>
          <app-stat-card [value]="activeTrips" label="{{ translation.t('ui.active') }}"></app-stat-card>
        </div>

        <div class="tabs">
          <button class="tab" [class.active]="tab() === 'upcoming'" (click)="tab.set('upcoming')">{{ translation.t('ui.upcoming') }}</button>
          <button class="tab" [class.active]="tab() === 'history'" (click)="tab.set('history')">{{ translation.t('ui.history') }}</button>
        </div>

        @if (tab() === 'upcoming') {
          <h3 style="margin: 1rem 0 0.75rem">{{ translation.t('guide.your_trips') }}</h3>
          @for (trip of guideTrips; track trip._id) {
            <div class="trip-card">
              <div class="trip-card-top">
                <span class="badge badge-{{ trip.status.toLowerCase() }}">{{ trip.status }}</span>
                <span class="trip-people">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
                  {{ trip.peopleCount }}
                </span>
              </div>
              <div class="trip-card-mid">
                <span>{{ trip.places.length }} {{ translation.t('ui.places') }}</span>
                <span class="trip-date">{{ trip.startDate | date:'MMM d' }} - {{ trip.endDate | date:'MMM d, yyyy' }}</span>
              </div>
              <div class="trip-card-bottom">
                @if (trip.status === 'PENDING') {
                  <button class="tm-btn tm-btn-sm tm-btn-success" (click)="acceptTrip(trip._id!)">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
                    {{ translation.t('ui.accept') }}
                  </button>
                  <button class="tm-btn tm-btn-sm tm-btn-danger" (click)="rejectTrip(trip._id!)">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                    {{ translation.t('ui.reject') }}
                  </button>
                }
                @if (trip.status === 'ONGOING') {
                  <button class="tm-btn tm-btn-sm tm-btn-primary" (click)="completeTrip(trip._id!)">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
                    {{ translation.t('ui.complete') }}
                  </button>
                }
              </div>
            </div>
          } @empty {
            <div class="empty-state">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
              <p>{{ translation.t('guide.no_upcoming') }}</p>
            </div>
          }
        } @else {
          <h3 style="margin: 1rem 0 0.75rem">{{ translation.t('guide.trip_history') }}</h3>
          @for (trip of historyTrips; track trip._id) {
            <div class="trip-card">
              <div class="trip-card-top">
                <span class="badge badge-{{ trip.status.toLowerCase() }}">{{ trip.status }}</span>
                <span class="trip-people">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
                  {{ trip.peopleCount }}
                </span>
              </div>
              <div class="trip-card-mid">
                <span>{{ trip.places.length }} {{ translation.t('ui.places') }}</span>
                <span class="trip-date">{{ trip.startDate | date:'MMM d' }} - {{ trip.endDate | date:'MMM d, yyyy' }}</span>
              </div>
            </div>
          } @empty {
            <div class="empty-state">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              <p>{{ translation.t('guide.no_history') }}</p>
            </div>
          }
        }
      }
    </div>
  `,
  styles: [`
    .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; flex-wrap: wrap; gap: 0.5rem; }
    .error-box { padding: 1rem; background: rgba(239,68,68,0.1); border: 1px solid rgba(239,68,68,0.2); border-radius: 10px; color: #a33a32; }

    .avail-toggle { display: flex; align-items: center; gap: 0.5rem; font-size: 0.85rem; font-weight: 600; }
    .toggle { position: relative; display: inline-block; width: 40px; height: 22px; cursor: pointer; }
    .toggle input { opacity: 0; width: 0; height: 0; }
    .toggle-slider { position: absolute; inset: 0; background: var(--tm-muted); border-radius: 999px; transition: 0.2s; }
    .toggle-slider::before { content: ''; position: absolute; width: 18px; height: 18px; border-radius: 50%; background: #fff; top: 2px; left: 2px; transition: 0.2s; }
    .toggle input:checked + .toggle-slider { background: var(--tm-success); }
    .toggle input:checked + .toggle-slider::before { transform: translateX(18px); }

    .stats-row { display: flex; gap: 1rem; }
    .stat-box { flex: 1; background: var(--tm-surface); border: 1px solid var(--glass-border); border-radius: 12px; padding: 1.25rem; text-align: center; }
    .stat-num { display: block; font-size: 1.8rem; font-weight: 800; color: var(--tm-primary); }
    .stat-label { display: block; font-size: 0.78rem; text-transform: uppercase; letter-spacing: 0.04em; color: var(--tm-muted); margin-top: 0.15rem; }

    .tabs { display: flex; gap: 0.25rem; margin-top: 1.25rem; border-bottom: 1px solid var(--glass-border); }
    .tab { background: none; border: none; padding: 0.6rem 1rem; cursor: pointer; color: var(--tm-muted); font-weight: 600; font-size: 0.9rem; border-bottom: 2px solid transparent; }
    .tab.active { color: var(--tm-primary); border-bottom-color: var(--tm-primary); }

    .trip-card { background: var(--tm-surface); border: 1px solid var(--glass-border); border-radius: 10px; padding: 1rem; margin-bottom: 0.6rem; }
    .trip-card-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.4rem; }
    .trip-people { display: flex; align-items: center; gap: 0.25rem; font-size: 0.85rem; color: var(--tm-muted); }
    .trip-people svg { color: var(--tm-primary); }
    .trip-card-mid { display: flex; justify-content: space-between; font-size: 0.85rem; color: var(--tm-muted); margin-bottom: 0.6rem; }
    .trip-date { color: var(--tm-muted); }
    .trip-card-bottom { display: flex; gap: 0.5rem; }

    .empty-state { text-align: center; padding: 3rem; color: var(--tm-muted); }
    .empty-state svg { margin-bottom: 0.5rem; opacity: 0.5; }
    .empty-state p { margin: 0; }
  `]
})
export class GuideDashboardComponent implements OnInit {
  private tripService = inject(TripService);
  translation = inject(TranslationService);
  private toast = inject(ToastService);
  private guideService = inject(GuideService);
  private auth = inject(AuthService);
  allTrips: Trip[] = [];
  upcoming = 0;
  completedTrips = 0;
  activeTrips = 0;
  loading = true;
  error = '';
  isAvailable = signal(false);
  tab = signal<'upcoming' | 'history'>('upcoming');

  get guideTrips() { return this.allTrips.filter(t => t.status === 'PENDING' || t.status === 'CONFIRMED' || t.status === 'ONGOING'); }
  get historyTrips() { return this.allTrips.filter(t => t.status === 'COMPLETED' || t.status === 'CANCELLED'); }

  ngOnInit() {
    this.loading = true;
    this.error = '';
    this.tripService.getAll({}).subscribe({
      next: (res) => {
        this.allTrips = res.data || [];
        this.upcoming = this.allTrips.filter(t => t.status === 'CONFIRMED' || t.status === 'PENDING').length;
        this.activeTrips = this.allTrips.filter(t => t.status === 'ONGOING').length;
        this.completedTrips = this.allTrips.filter(t => t.status === 'COMPLETED').length;
        this.loading = false;
      },
      error: (e) => { this.loading = false; this.error = e.error?.message || 'Failed to load dashboard'; this.toast.error(this.error); },
    });
  }

  toggleAvailability() {
    this.isAvailable.update(v => !v);
    this.guideService.updateAvailability(this.auth.user?._id!, this.isAvailable() ? 'available' : 'offline').subscribe({
      next: () => this.toast.success(this.isAvailable() ? 'You are now available' : 'You are now unavailable'),
      error: () => this.toast.error('Failed to update availability'),
    });
  }

  acceptTrip(id: string) {
    const gid = this.auth.user?._id;
    if (!gid) return;
    this.tripService.assignGuide(id, gid).subscribe({
      next: () => { this.toast.success('Trip accepted'); this.ngOnInit(); },
      error: (e) => this.toast.error(e.error?.message || 'Failed to accept trip'),
    });
  }

  rejectTrip(id: string) {
    this.tripService.cancelTrip(id).subscribe({
      next: () => { this.toast.info('Trip rejected'); this.ngOnInit(); },
      error: (e) => this.toast.error(e.error?.message || 'Failed to reject trip'),
    });
  }

  completeTrip(id: string) { this.tripService.completeTrip(id).subscribe({ next: () => { this.toast.success('Trip completed'); this.ngOnInit(); }, error: (e) => this.toast.error(e.error?.message || 'Failed to complete trip') }); }
}
