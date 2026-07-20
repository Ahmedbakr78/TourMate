import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService } from '../../core/services/admin.service';
import { ToastService } from '../../core/services/toast.service';
import { TranslationService } from '../../core/services/translation.service';
import { IconComponent } from '../../shared/icon.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, IconComponent],
  template: `
    <div class="page">
      <div class="page-header">
        <div>
          <h2 style="margin:0">{{ translation.t('ui.statistics') }}</h2>
          <p class="muted" style="margin:0.2rem 0 0">Platform overview</p>
        </div>
      </div>

      @if (loading) {
        <div class="tm-loader"></div>
      } @else if (error) {
        <div class="error-box">{{ error }}</div>
      } @else {
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-icon users">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            </div>
            <span class="stat-num">{{ stats?.totalUsers ?? '-' }}</span>
            <span class="stat-label">{{ translation.t('ui.users') }}</span>
          </div>
          <div class="stat-card">
            <div class="stat-icon trips">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
            </div>
            <span class="stat-num">{{ stats?.activeTrips ?? '-' }}</span>
            <span class="stat-label">{{ translation.t('ui.trips') }}</span>
          </div>
          <div class="stat-card">
            <div class="stat-icon drivers">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 17v-3a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v3"/><path d="M2 17v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2"/><circle cx="6" cy="15" r="1.5"/><circle cx="18" cy="15" r="1.5"/></svg>
            </div>
            <span class="stat-num">{{ stats?.totalDrivers ?? '-' }}</span>
            <span class="stat-label">{{ translation.t('ui.drivers') }}</span>
          </div>
          <div class="stat-card">
            <div class="stat-icon guides">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
            </div>
            <span class="stat-num">{{ stats?.totalGuides ?? '-' }}</span>
            <span class="stat-label">{{ translation.t('ui.guides') }}</span>
          </div>
          <div class="stat-card">
            <div class="stat-icon pending-guides">
              <app-icon name="compass" [size]="22"></app-icon>
            </div>
            <span class="stat-num">{{ pendingGuides ?? '-' }}</span>
            <span class="stat-label">{{ translation.t('ui.pending') }}</span>
          </div>
          <div class="stat-card">
            <div class="stat-icon pending-drivers">
              <app-icon name="map" [size]="22"></app-icon>
            </div>
            <span class="stat-num">{{ pendingDrivers ?? '-' }}</span>
            <span class="stat-label">{{ translation.t('ui.pending') }}</span>
          </div>
        </div>

        <div class="chart-card">
          <h3>Platform Overview</h3>
          <div class="bars">
            @for (item of bars; track item.key) {
              <div class="bar-row">
                <span class="bar-label">{{ translation.t(item.key) }}</span>
                <div class="bar-track"><div class="bar-fill" [style.width.%]="item.pct" style="background: var(--tm-primary)"></div></div>
                <span class="bar-val">{{ item.value }}</span>
              </div>
            }
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .page-header { margin-bottom: 1.5rem; }
    .error-box { padding: 1rem; background: rgba(239,68,68,0.1); border: 1px solid rgba(239,68,68,0.2); border-radius: 10px; color: #a33a32; }

    .stats-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 1.5rem; }
    .stat-card {
      background: var(--tm-surface); border: 1px solid var(--glass-border); border-radius: 12px;
      padding: 1.25rem; display: flex; flex-direction: column; align-items: center; gap: 0.3rem;
      transition: all 0.2s;
    }
    .stat-card:hover { background: var(--tm-surface-raised); transform: translateY(-2px); }
    .stat-icon { width: 44px; height: 44px; border-radius: 12px; display: flex; align-items: center; justify-content: center; margin-bottom: 0.25rem; }
    .stat-icon.users { background: rgba(17,17,17,0.12); color: var(--tm-ink); }
    .stat-icon.trips { background: rgba(34,197,94,0.12); color: #3f7a52; }
    .stat-icon.drivers { background: rgba(251,191,36,0.12); color: #9a7b3a; }
    .stat-icon.guides { background: rgba(17,17,17,0.12); color: var(--tm-ink); }
    .stat-icon.pending-guides { background: rgba(251,191,36,0.12); color: #9a7b3a; }
    .stat-icon.pending-drivers { background: rgba(245,158,11,0.12); color: #9a6a1f; }
    .stat-num { font-size: 1.8rem; font-weight: 800; }
    .stat-label { font-size: 0.78rem; text-transform: uppercase; letter-spacing: 0.04em; color: var(--tm-muted); }

    .chart-card {
      background: var(--tm-surface); border: 1px solid var(--glass-border); border-radius: 12px;
      padding: 1.25rem; max-width: 500px;
    }
    .chart-card h3 { margin: 0 0 1rem; font-size: 0.95rem; }
    .bars { display: flex; flex-direction: column; gap: 0.6rem; }
    .bar-row { display: flex; align-items: center; gap: 0.75rem; }
    .bar-label { width: 100px; font-size: 0.85rem; color: var(--tm-muted); }
    .bar-track { flex: 1; background: var(--glass-border); border-radius: 6px; height: 12px; overflow: hidden; }
    .bar-fill { height: 100%; border-radius: 6px; transition: width 0.5s ease; }
    .bar-val { width: 36px; text-align: right; font-size: 0.85rem; font-weight: 600; }
  `],
})
export class DashboardComponent implements OnInit {
  admin = inject(AdminService);
  translation = inject(TranslationService);
  toast = inject(ToastService);
  stats: any = null;
  loading = true;
  error = '';
  pendingGuides: number | null = null;
  pendingDrivers: number | null = null;

  get bars() {
    if (!this.stats) return [];
    const max = Math.max(
      this.stats.totalUsers,
      this.stats.activeTrips,
      this.stats.totalDrivers,
      this.stats.totalGuides,
      1
    );
    const mk = (key: string, value: number) => ({ key, value, pct: (value / max) * 100 });
    return [
      mk('ui.users', this.stats.totalUsers),
      mk('ui.trips', this.stats.activeTrips),
      mk('ui.drivers', this.stats.totalDrivers),
      mk('ui.guides', this.stats.totalGuides),
    ];
  }

  ngOnInit() {
    this.loading = true;
    this.error = '';
    this.admin.getStats().subscribe({
      next: (res) => {
        this.stats = res.data;
        this.loading = false;
      },
      error: (e) => {
        this.loading = false;
        this.error = e.error?.message || 'Failed to load stats';
        this.toast.error(this.error);
      },
    });
    this.loadPending();
  }

  loadPending() {
    this.admin.getPendingGuides().subscribe({
      next: (res) => { this.pendingGuides = (res.data || []).length; },
      error: () => { this.pendingGuides = null; },
    });
    this.admin.getPendingDrivers().subscribe({
      next: (res) => { this.pendingDrivers = (res.data || []).length; },
      error: () => { this.pendingDrivers = null; },
    });
  }
}
