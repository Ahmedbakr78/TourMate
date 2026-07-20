import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../core/services/admin.service';
import { DriverService } from '../../core/services/driver.service';
import { ToastService } from '../../core/services/toast.service';
import { TranslationService } from '../../core/services/translation.service';
import { IconComponent } from '../../shared/icon.component';

@Component({
  selector: 'app-driver-management',
  standalone: true,
  imports: [CommonModule, FormsModule, IconComponent],
  template: `
    <div class="page">
      <div class="page-header">
        <div>
          <h2 style="margin:0">{{ translation.t('ui.drivers') }}</h2>
          <p class="muted" style="margin:0.2rem 0 0">{{ drivers.length }} drivers</p>
        </div>
      </div>

      <div class="toolbar">
        <div class="search-box">
          <app-icon name="search" [size]="16"></app-icon>
          <input class="tm-input search-input" [(ngModel)]="searchTerm" (ngModelChange)="search()"
            placeholder="Search by name..." />
        </div>
        <button class="tm-btn tm-btn-outline tm-btn-sm" (click)="clearSearch()">
          <app-icon name="refresh" [size]="14"></app-icon> Reset
        </button>
      </div>

      @if (loading) {
        <div class="tm-loader"></div>
      } @else if (error) {
        <div class="error-box">{{ error }}</div>
            } @else if (drivers.length === 0) {
              <div class="empty-state">{{ translation.t('ui.noData') }}</div>
            } @else {
              <div class="table-wrap">
                <table class="tm-table">
                  <thead><tr><th>{{ translation.t('ui.name') }}</th><th>{{ translation.t('ui.email') }}</th><th>License</th><th>{{ translation.t('ui.rating') }}</th><th>{{ translation.t('ui.status') }}</th><th>Actions</th></tr></thead>
                  <tbody>
                    @for (d of drivers; track d._id) {
                      <tr>
                        <td>{{ d.userId?.name }}</td>
                        <td>{{ d.userId?.email }}</td>
                        <td>{{ d.licenseNumber }}</td>
                        <td>{{ d.rating?.toFixed(1) || 'N/A' }}</td>
                        <td><span class="badge badge-{{ (d.verificationStatus || '').toLowerCase() }}">{{ d.verificationStatus }}</span></td>
                        <td class="actions-cell">
                          @if (d.verificationStatus === 'PENDING') {
                            <button class="tm-btn tm-btn-sm tm-btn-success" (click)="approve(d._id)">{{ translation.t('ui.accept') }}</button>
                            <button class="tm-btn tm-btn-sm tm-btn-danger" (click)="reject(d._id)">{{ translation.t('ui.reject') }}</button>
                          } @else {
                      <span class="muted">-</span>
                    }
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      }
    </div>
  `,
  styles: [`
    .page-header { margin-bottom: 1.5rem; }
    .error-box { padding: 1rem; background: rgba(239,68,68,0.1); border: 1px solid rgba(239,68,68,0.2); border-radius: 10px; color: #a33a32; }
    .empty-state { text-align: center; padding: 2rem; color: var(--tm-muted); }
    .table-wrap { overflow-x: auto; }
    .actions-cell { display: flex; gap: 0.4rem; }
    .toolbar { display: flex; gap: 0.6rem; margin-bottom: 1.25rem; align-items: center; flex-wrap: wrap; }
    .search-box { display: flex; align-items: center; gap: 0.5rem; flex: 1; max-width: 360px; }
    .search-box app-icon { position: absolute; margin-left: 0.85rem; color: var(--tm-muted); }
    .search-input { margin-bottom: 0; padding-left: 2.4rem; }
    .badge-approved { background: rgba(34,197,94,0.15); color: #3f7a52; }
    .badge-rejected { background: rgba(239,68,68,0.15); color: #a33a32; }
    .badge-pending { background: rgba(251,191,36,0.15); color: #9a7b3a; }
  `],
})
export class DriverManagementComponent implements OnInit {
  admin = inject(AdminService);
  driverService = inject(DriverService);
  translation = inject(TranslationService);
  toast = inject(ToastService);
  drivers: any[] = [];
  loading = true;
  error = '';
  searchTerm = '';

  ngOnInit() { this.load(); }

  load() {
    this.loading = true; this.error = '';
    this.driverService.getAll().subscribe({
      next: (res: any) => { this.drivers = res.data; this.loading = false; },
      error: (e) => { this.error = e.error?.message || 'Failed to load'; this.loading = false; this.toast.error(this.error); },
    });
  }

  search() {
    const q = this.searchTerm.trim();
    if (!q) { this.load(); return; }
    this.loading = true; this.error = '';
    this.driverService.search({ q }).subscribe({
      next: (res: any) => { this.drivers = res.data || []; this.loading = false; },
      error: (e) => { this.error = e.error?.message || 'Search failed'; this.loading = false; this.toast.error(this.error); },
    });
  }

  clearSearch() {
    this.searchTerm = '';
    this.load();
  }

  approve(id: string) {
    this.admin.approveDriver(id).subscribe({
      next: () => { this.load(); this.toast.success('Driver approved'); },
      error: (e) => this.toast.error(e.error?.message || 'Failed'),
    });
  }

  reject(id: string) {
    this.admin.rejectDriver(id).subscribe({
      next: () => { this.load(); this.toast.success('Driver rejected'); },
      error: (e) => this.toast.error(e.error?.message || 'Failed'),
    });
  }
}
