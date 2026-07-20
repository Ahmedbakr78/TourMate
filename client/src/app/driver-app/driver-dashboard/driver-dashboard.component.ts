import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TripService, Trip } from '../../core/services/trip.service';
import { ToastService } from '../../core/services/toast.service';
import { DriverService } from '../../core/services/driver.service';
import { TrackingService } from '../../core/services/tracking.service';
import { AuthService } from '../../core/services/auth.service';
import { StatCardComponent } from '../../shared/stat-card.component';
import { TranslationService } from '../../core/services/translation.service';

@Component({
  selector: 'app-driver-dashboard',
  standalone: true,
  imports: [CommonModule, StatCardComponent],
  template: `
    <div class="page">
      <div class="page-header">
        <div>
          <h2 style="margin:0">{{ translation.t('driver.dashboard') }}</h2>
          <p class="muted" style="margin:0.2rem 0 0">Manage your trips & availability</p>
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
          <app-stat-card [value]="activeTrips" label="{{ translation.t('ui.active') }}"></app-stat-card>
          <app-stat-card [value]="completedTrips" label="{{ translation.t('ui.completed') }}"></app-stat-card>
          <app-stat-card [value]="assignedTrips.length" label="{{ translation.t('driver.total_assigned') }}"></app-stat-card>
        </div>

        @if (tracking()) {
          <div class="tracking-bar">
            <span class="live-dot"></span>
             Sharing live location (poll every 5s)
             <button class="stop-btn" (click)="stopTracking()">{{ translation.t('ui.stop') }}</button>
          </div>
        } @else {
          <button class="tm-btn tm-btn-sm" (click)="startTracking()" [disabled]="!hasOngoing">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 17v-3a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v3"/><path d="M2 17v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2"/><circle cx="6" cy="15" r="1.5"/><circle cx="18" cy="15" r="1.5"/></svg>
            {{ translation.t('driver.share_live') }}
          </button>
        }

        <h3 style="margin: 1.5rem 0 0.75rem">{{ translation.t('driver.assigned_trips') }}</h3>
        @for (trip of assignedTrips; track trip._id) {
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
            </div>
            <div class="trip-card-bottom">
              @if (trip.status === 'CONFIRMED' || trip.status === 'PENDING') {
                <button class="tm-btn tm-btn-sm tm-btn-success" (click)="startTrip(trip._id!)">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                  {{ translation.t('ui.accept') }}
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
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>
             <p>{{ translation.t('driver.no_trips_assigned') }}</p>
          </div>
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

    .tracking-bar { display: flex; align-items: center; gap: 0.5rem; margin: 1rem 0 0; padding: 0.6rem 0.85rem; background: rgba(34,197,94,0.1); border: 1px solid rgba(34,197,94,0.2); border-radius: 10px; font-size: 0.85rem; color: #3f7a52; font-weight: 600; }
    .live-dot { width: 8px; height: 8px; border-radius: 50%; background: #3f7a52; box-shadow: 0 0 6px rgba(34,197,94,0.6); animation: pulse 1.5s infinite; }
    @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
    .stop-btn { margin-left: auto; background: none; border: 1px solid rgba(239,68,68,0.3); color: #a33a32; border-radius: 6px; padding: 0.2rem 0.6rem; cursor: pointer; font-size: 0.75rem; }

    .trip-card { background: var(--tm-surface); border: 1px solid var(--glass-border); border-radius: 10px; padding: 1rem; margin-bottom: 0.6rem; }
    .trip-card-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.4rem; }
    .trip-people { display: flex; align-items: center; gap: 0.25rem; font-size: 0.85rem; color: var(--tm-muted); }
    .trip-people svg { color: var(--tm-primary); }
    .trip-card-mid { font-size: 0.85rem; color: var(--tm-muted); margin-bottom: 0.6rem; }
    .trip-card-bottom { display: flex; gap: 0.5rem; }

    .empty-state { text-align: center; padding: 3rem; color: var(--tm-muted); }
    .empty-state svg { margin-bottom: 0.5rem; opacity: 0.5; }
    .empty-state p { margin: 0; }
  `]
})
export class DriverDashboardComponent implements OnInit {
  private tripService = inject(TripService);
  translation = inject(TranslationService);
  private toast = inject(ToastService);
  private driverService = inject(DriverService);
  private trackingService = inject(TrackingService);
  private auth = inject(AuthService);
  allTrips: Trip[] = [];
  activeTrips = 0;
  completedTrips = 0;
  loading = true;
  error = '';
  isAvailable = signal(false);
  tracking = signal(false);
  hasOngoing = false;
  private trackTimer?: any;

  get assignedTrips() { return this.allTrips.filter(t => t.status !== 'DRAFT' && t.status !== 'CANCELLED'); }

  ngOnInit() {
    this.loading = true;
    this.error = '';
    this.tripService.getAll({}).subscribe({
      next: (res) => {
        this.allTrips = res.data || [];
        this.activeTrips = this.allTrips.filter(t => t.status === 'ONGOING' || t.status === 'CONFIRMED').length;
        this.completedTrips = this.allTrips.filter(t => t.status === 'COMPLETED').length;
        this.hasOngoing = this.allTrips.some(t => t.status === 'ONGOING' && t.driverId === this.auth.user?._id);
        this.loading = false;
      },
      error: (e) => { this.loading = false; this.error = e.error?.message || 'Failed to load dashboard'; this.toast.error(this.error); },
    });
  }

  toggleAvailability() {
    this.isAvailable.update(v => !v);
    this.driverService.updateAvailability(this.auth.user?._id!, this.isAvailable() ? 'available' : 'offline').subscribe({
      next: () => this.toast.success(this.isAvailable() ? 'You are now available' : 'You are now unavailable'),
      error: () => this.toast.error('Failed to update availability'),
    });
  }

  startTracking() {
    const id = this.auth.user?._id;
    if (!id) return;
    this.tracking.set(true);
    const send = () => {
      const lat = 30.0444 + (Math.random() - 0.5) * 0.05;
      const lng = 31.2357 + (Math.random() - 0.5) * 0.05;
      this.trackingService.pushLocation(id, lng, lat, { heading: 90, speed: 45 }).subscribe();
    };
    send();
    this.trackTimer = setInterval(send, 5000);
    this.toast.success('Location sharing started');
  }

  stopTracking() {
    this.tracking.set(false);
    if (this.trackTimer) clearInterval(this.trackTimer);
    this.toast.info('Location sharing stopped');
  }

  ngOnDestroy() { if (this.trackTimer) clearInterval(this.trackTimer); }

  startTrip(id: string) { this.tripService.startTrip(id).subscribe({ next: () => { this.toast.success('Trip accepted'); this.ngOnInit(); }, error: (e) => this.toast.error(e.error?.message || 'Failed to accept trip') }); }
  completeTrip(id: string) { this.tripService.completeTrip(id).subscribe({ next: () => { this.toast.success('Trip completed'); this.ngOnInit(); }, error: (e) => this.toast.error(e.error?.message || 'Failed to complete trip') }); }
}
