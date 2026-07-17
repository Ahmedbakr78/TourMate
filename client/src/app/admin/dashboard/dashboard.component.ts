import { Component, inject, OnInit } from '@angular/core';
import { AdminService, SystemStats } from '../../core/services/admin.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  template: `
    <h2>System Statistics</h2>
    <div class="tm-grid">
      <div class="tm-card stat"><span class="num">{{ stats?.totalUsers ?? '-' }}</span><span>Registered Users</span></div>
      <div class="tm-card stat"><span class="num">{{ stats?.activeTrips ?? '-' }}</span><span>Active Trips</span></div>
      <div class="tm-card stat"><span class="num">{{ stats?.totalDrivers ?? '-' }}</span><span>Drivers</span></div>
      <div class="tm-card stat"><span class="num">{{ stats?.totalGuides ?? '-' }}</span><span>Guides</span></div>
      <div class="tm-card stat"><span class="num">{{ stats?.totalVehicles ?? '-' }}</span><span>Vehicles</span></div>
    </div>

    <div class="tm-card chart">
      <h3>Overview</h3>
      @for (item of bars; track item.label) {
        <div class="bar-row">
          <span class="bar-label">{{ item.label }}</span>
          <div class="bar-track"><div class="bar-fill" [style.width.%]="item.pct"></div></div>
          <span class="bar-val">{{ item.value }}</span>
        </div>
      }
    </div>
  `,
  styles: [
    `
      .stat { display: flex; flex-direction: column; align-items: center; }
      .num { font-size: 2rem; font-weight: 800; color: var(--tm-primary); }
      .chart { margin-top: 1.25rem; }
      .bar-row { display: flex; align-items: center; gap: 0.75rem; margin: 0.5rem 0; }
      .bar-label { width: 110px; }
      .bar-track { flex: 1; background: #e2e8f0; border-radius: 6px; height: 14px; overflow: hidden; }
      .bar-fill { background: var(--tm-primary); height: 100%; }
      .bar-val { width: 40px; text-align: right; }
    `,
  ],
})
export class DashboardComponent implements OnInit {
  admin = inject(AdminService);
  stats: SystemStats | null = null;

  get bars() {
    if (!this.stats) return [];
    const max = Math.max(
      this.stats.totalUsers,
      this.stats.activeTrips,
      this.stats.totalDrivers,
      this.stats.totalGuides,
      this.stats.totalVehicles,
      1
    );
    const mk = (label: string, value: number) => ({ label, value, pct: (value / max) * 100 });
    return [
      mk('Users', this.stats.totalUsers),
      mk('Active Trips', this.stats.activeTrips),
      mk('Drivers', this.stats.totalDrivers),
      mk('Guides', this.stats.totalGuides),
      mk('Vehicles', this.stats.totalVehicles),
    ];
  }

  ngOnInit() {
    this.admin.getStats().subscribe((res) => (this.stats = res.data));
  }
}
