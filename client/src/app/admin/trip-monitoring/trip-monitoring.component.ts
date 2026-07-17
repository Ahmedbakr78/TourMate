import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription, interval } from 'rxjs';
import { TrackingService, DriverLocation } from '../../core/services/tracking.service';

@Component({
  selector: 'app-trip-monitoring',
  standalone: true,
  imports: [CommonModule],
  template: `
    <h2>Active Trip Monitoring</h2>
    <p class="muted">Live driver positions via polling (no WebSockets) · refresh {{ periodMs / 1000 }}s</p>

    <div class="tm-card map">
      @if (locations.length === 0) {
        <div class="empty">No active trips reporting locations.</div>
      }
      @for (loc of locations; track loc.driverId) {
        <div
          class="marker"
          [style.left.%]="project(loc.coordinates[0])"
          [style.top.%]="projectY(loc.coordinates[1])"
          [title]="loc.driverId"
        >🚗</div>
      }
    </div>

    <div class="tm-grid">
      @for (loc of locations; track loc.driverId) {
        <div class="tm-card">
          <strong>Driver {{ shortId(loc.driverId) }}</strong>
          <div class="muted">Trip: {{ loc.tripId ? shortId(loc.tripId) : '—' }}</div>
          <div class="muted">Lng {{ loc.coordinates[0] | number: '1.3-3' }}, Lat {{ loc.coordinates[1] | number: '1.3-3' }}</div>
          <div class="muted">Updated: {{ loc.updatedAt | date: 'mediumTime' }}</div>
        </div>
      }
    </div>
  `,
  styles: [
    `
      .muted { color: var(--tm-muted); font-size: 0.85rem; }
      .map {
        position: relative; height: 320px; margin-bottom: 1rem;
        background:
          linear-gradient(#e2e8f0 1px, transparent 1px) 0 0 / 100% 40px,
          linear-gradient(90deg, #e2e8f0 1px, transparent 1px) 0 0 / 40px 100%,
          #f1f5f9;
        overflow: hidden;
      }
      .marker { position: absolute; transform: translate(-50%, -50%); font-size: 1.4rem; }
      .empty { position: absolute; inset: 0; display: grid; place-items: center; color: var(--tm-muted); }
    `,
  ],
})
export class TripMonitoringComponent implements OnInit, OnDestroy {
  tracking = inject(TrackingService);
  locations: DriverLocation[] = [];
  periodMs = 5000;
  private sub?: Subscription;

  ngOnInit() {
    this.refresh();
    this.sub = interval(this.periodMs).subscribe(() => this.refresh());
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
  }

  private refresh() {
    this.tracking.pollActiveTrips().subscribe((res) => (this.locations = res.data));
  }

  // Map module normally centers on a bounding box; here we normalize a fixed world window for demo.
  project(lng: number): number {
    return ((lng + 180) / 360) * 100;
  }
  projectY(lat: number): number {
    return ((90 - lat) / 180) * 100;
  }
  shortId(id: string): string {
    return id.slice(-6);
  }
}
