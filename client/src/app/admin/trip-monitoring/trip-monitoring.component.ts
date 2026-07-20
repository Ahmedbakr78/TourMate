import { Component, OnInit, OnDestroy, inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription, interval } from 'rxjs';
import { TripService, Trip } from '../../core/services/trip.service';
import { TrackingService, DriverLocation } from '../../core/services/tracking.service';
import { ToastService } from '../../core/services/toast.service';
import { TranslationService } from '../../core/services/translation.service';
import { MapComponent, MapMarker, MapRoute } from '../../shared/map/map.component';

@Component({
  selector: 'app-trip-monitoring',
  standalone: true,
  imports: [CommonModule, FormsModule, MapComponent],
  template: `
    <div class="page">
      <div class="page-header">
        <div>
          <h2 style="margin:0">{{ translation.t('nav.trip_monitoring') }}</h2>
          <p class="muted" style="margin:0.2rem 0 0">Real-time tracking of active trips</p>
        </div>
        <div class="header-stats">
          <span class="stat-chip">
            <span class="stat-dot live"></span>
            {{ activeTrips.length }} active
          </span>
          <span class="stat-chip">
            <span class="stat-dot"></span>
            {{ drivers.length }} drivers
          </span>
        </div>
      </div>

      @if (loading) {
        <div class="tm-loader"></div>
      } @else {
        <div class="monitoring-grid">
          <div class="map-card">
            <app-map
              [markers]="mapMarkers"
              [route]="selectedRoute"
              [center]="[30.0444, 31.2357]"
              [zoom]="11"
            />
          </div>

          <div class="driver-panel">
            <h3>{{ translation.t('ui.drivers') }}</h3>
            @if (drivers.length === 0) {
              <div class="empty-panel">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M22 17v-3a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v3"/><path d="M2 17v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2"/><circle cx="6" cy="15" r="1.5"/><circle cx="18" cy="15" r="1.5"/></svg>
                <p>{{ translation.t('ui.noData') }}</p>
              </div>
            }
            <div class="driver-list">
              @for (d of drivers; track d.driverId) {
                <div class="driver-card" [class.selected]="selectedDriverId === d.driverId" (click)="selectDriver(d)">
                  <div class="driver-avatar">{{ d.driverId.slice(-2) }}</div>
                  <div class="driver-info">
                    <span class="driver-name">Driver {{ d.driverId.slice(-4) }}</span>
                    <span class="driver-meta">
                      {{ d.coordinates[0].toFixed(4) }}, {{ d.coordinates[1].toFixed(4) }}
                    </span>
                    <span class="driver-time">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                      {{ getTimeAgo(d.updatedAt) }}
                    </span>
                  </div>
                  <div class="driver-status">
                    <span class="status-dot live"></span>
                  </div>
                </div>
              }
            </div>

            @if (selectedDriver) {
              <div class="driver-detail">
                <h4>Driver Details</h4>
                <div class="detail-row"><span>Heading</span><span>{{ selectedDriver.heading ?? 'N/A' }}°</span></div>
                <div class="detail-row"><span>Speed</span><span>{{ selectedDriver.speed ? selectedDriver.speed.toFixed(1) + ' km/h' : 'N/A' }}</span></div>
                <div class="detail-row"><span>Trip ID</span><span class="mono">{{ selectedDriver.tripId || 'N/A' }}</span></div>
                <div class="detail-row"><span>ETA</span><span>{{ estimateEta() }}</span></div>
              </div>
            }
          </div>
        </div>

        <div class="trips-section">
            <h3>{{ translation.t('ui.trips') }}</h3>
            @if (activeTrips.length === 0) {
              <div class="empty-panel">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                <p>{{ translation.t('ui.noData') }}</p>
              </div>
            } @else {
              <div class="trips-grid">
                @for (t of activeTrips; track t._id) {
                  <div class="trip-mini-card">
                    <div class="trip-mini-top">
                      <span class="badge badge-{{ t.status.toLowerCase() }}">{{ translation.t('ui.' + t.status.toLowerCase()) }}</span>
                      <span class="trip-mini-price">\${{ t.price }}</span>
                    </div>
                    <div class="trip-mini-info">
                      <span>{{ t.places.length || 0 }} {{ translation.t('ui.places') }}</span>
                      <span>{{ t.peopleCount }} people</span>
                    </div>
                  <div class="trip-mini-time">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                    {{ t.startDate | date:'MMM d, HH:mm' }}
                  </div>
                </div>
              }
            </div>
          }
        </div>
      }
    </div>
  `,
  styles: [`
    .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; flex-wrap: wrap; gap: 0.5rem; }
    .header-stats { display: flex; gap: 0.5rem; }
    .stat-chip { display: flex; align-items: center; gap: 0.4rem; padding: 0.35rem 0.75rem; background: var(--tm-surface); border: 1px solid var(--glass-border); border-radius: 999px; font-size: 0.82rem; font-weight: 600; }
    .stat-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--tm-muted); }
    .stat-dot.live { background: #3f7a52; box-shadow: 0 0 6px rgba(34,197,94,0.5); animation: pulse 2s infinite; }
    @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }

    .monitoring-grid { display: grid; grid-template-columns: 1fr 300px; gap: 1rem; margin-bottom: 1.5rem; }
    .map-card { background: var(--tm-surface); border: 1px solid var(--glass-border); border-radius: 12px; overflow: hidden; min-height: 450px; }

    .driver-panel { background: var(--tm-surface); border: 1px solid var(--glass-border); border-radius: 12px; padding: 1rem; max-height: 500px; overflow-y: auto; }
    .driver-panel h3 { margin: 0 0 0.75rem; font-size: 0.9rem; text-transform: uppercase; letter-spacing: 0.04em; color: var(--tm-muted); }

    .empty-panel { text-align: center; padding: 2rem 1rem; color: var(--tm-muted); }
    .empty-panel svg { margin-bottom: 0.5rem; opacity: 0.5; }
    .empty-panel p { margin: 0; font-size: 0.85rem; }

    .driver-list { display: flex; flex-direction: column; gap: 0.4rem; margin-bottom: 0.75rem; }
    .driver-card {
      display: flex; align-items: center; gap: 0.6rem; padding: 0.5rem 0.6rem;
      border-radius: 8px; cursor: pointer; transition: all 0.15s; border: 1px solid transparent;
    }
    .driver-card:hover { background: var(--glass-hover); }
    .driver-card.selected { border-color: var(--tm-primary); background: rgba(17,17,17,0.06); }
    .driver-avatar { width: 30px; height: 30px; border-radius: 8px; background: linear-gradient(135deg, var(--tm-primary), #000000); display: flex; align-items: center; justify-content: center; color: #fff; font-weight: 700; font-size: 0.7rem; flex-shrink: 0; }
    .driver-info { display: flex; flex-direction: column; min-width: 0; flex: 1; }
    .driver-name { font-size: 0.82rem; font-weight: 600; }
    .driver-meta { font-size: 0.68rem; color: var(--tm-muted); font-family: monospace; }
    .driver-time { display: flex; align-items: center; gap: 0.2rem; font-size: 0.65rem; color: var(--tm-muted); margin-top: 0.1rem; }
    .driver-time svg { flex-shrink: 0; }
    .driver-status { flex-shrink: 0; }
    .status-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--tm-muted); display: block; }
    .status-dot.live { background: #3f7a52; box-shadow: 0 0 6px rgba(34,197,94,0.5); animation: pulse 2s infinite; }

    .driver-detail { background: rgba(255,255,255,0.02); border: 1px solid var(--glass-border); border-radius: 8px; padding: 0.75rem; }
    .driver-detail h4 { margin: 0 0 0.5rem; font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.04em; color: var(--tm-muted); }
    .detail-row { display: flex; justify-content: space-between; padding: 0.25rem 0; font-size: 0.78rem; }
    .detail-row span:first-child { color: var(--tm-muted); }
    .mono { font-family: monospace; font-size: 0.72rem; }

    .trips-section { background: var(--tm-surface); border: 1px solid var(--glass-border); border-radius: 12px; padding: 1rem; }
    .trips-section h3 { margin: 0 0 0.75rem; font-size: 0.9rem; text-transform: uppercase; letter-spacing: 0.04em; color: var(--tm-muted); }
    .trips-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 0.75rem; }
    .trip-mini-card { border: 1px solid var(--glass-border); border-radius: 10px; padding: 0.85rem; transition: all 0.15s; }
    .trip-mini-card:hover { background: var(--tm-surface-raised); }
    .trip-mini-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem; }
    .trip-mini-price { font-weight: 700; color: var(--tm-primary); font-size: 0.9rem; }
    .trip-mini-info { display: flex; gap: 0.75rem; font-size: 0.78rem; color: var(--tm-muted); margin-bottom: 0.4rem; }
    .trip-mini-time { display: flex; align-items: center; gap: 0.3rem; font-size: 0.75rem; color: var(--tm-muted); }

    @media (max-width: 900px) {
      .monitoring-grid { grid-template-columns: 1fr; }
      .map-card { min-height: 350px; }
    }
  `]
})
export class TripMonitoringComponent implements OnInit, OnDestroy {
  private tripService = inject(TripService);
  private trackingService = inject(TrackingService);
  private toast = inject(ToastService);
  translation = inject(TranslationService);
  @ViewChild(MapComponent) mapComponent?: MapComponent;

  activeTrips: Trip[] = [];
  drivers: DriverLocation[] = [];
  loading = true;
  selectedDriverId: string | null = null;
  selectedRoute: MapRoute | null = null;

  private pollSub?: Subscription;

  get selectedDriver() {
    return this.drivers.find(d => d.driverId === this.selectedDriverId) || null;
  }

  get mapMarkers(): MapMarker[] {
    return this.drivers.map(d => ({
      id: d.driverId,
      lat: d.coordinates[1],
      lng: d.coordinates[0],
      label: `Driver ${d.driverId.slice(-4)}`,
      icon: 'driver' as const,
      color: d.driverId === this.selectedDriverId ? '#9a7b3a' : '#3f7a52',
    }));
  }

  ngOnInit() {
    this.loadTrips();
    this.startPolling();
  }

  ngOnDestroy() {
    this.pollSub?.unsubscribe();
  }

  loadTrips() {
    this.tripService.getAll({ status: 'ONGOING' }).subscribe({
      next: (res) => { this.activeTrips = res.data || []; this.loading = false; },
      error: () => { this.loading = false; },
    });
  }

  startPolling() {
    this.pollTracking();
    this.pollSub = interval(5000).subscribe(() => this.pollTracking());
  }

  pollTracking() {
    this.trackingService.pollActiveTrips().subscribe({
      next: (res) => { this.drivers = res.data || []; },
      error: () => {},
    });
  }

  selectDriver(d: DriverLocation) {
    this.selectedDriverId = d.driverId;
    this.selectedRoute = {
      coordinates: [[d.coordinates[1], d.coordinates[0]], [d.coordinates[1] + 0.01, d.coordinates[0] + 0.01]],
      color: '#9a7b3a',
      dashArray: '5, 8',
    };
    this.mapComponent?.setView(d.coordinates[1], d.coordinates[0], 14);
  }

  estimateEta(): string {
    if (!this.selectedDriver?.speed || this.selectedDriver.speed < 1) return 'Calculating...';
    const distKm = 5;
    const hours = distKm / this.selectedDriver.speed;
    const mins = Math.round(hours * 60);
    return `~${mins} min`;
  }

  getTimeAgo(iso: string): string {
    const diff = Date.now() - new Date(iso).getTime();
    const sec = Math.floor(diff / 1000);
    if (sec < 60) return `${sec}s ago`;
    const min = Math.floor(sec / 60);
    if (min < 60) return `${min}m ago`;
    return `${Math.floor(min / 60)}h ago`;
  }
}
