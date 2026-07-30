import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AdminService, IDashboardStats, ISystemStatistics } from 'src/app/core/services/admin.service';

@Component({
  selector: 'app-admin-dashboard',
  template: `
    <div class="page-header"><h1>Admin Dashboard</h1></div>

    <app-loading *ngIf="loading"></app-loading>

    <div class="stats-grid" *ngIf="!loading && stats">
      <mat-card><mat-icon>people</mat-icon><h2>{{ stats.totalUsers }}</h2><p>Users</p></mat-card>
      <mat-card><mat-icon>map</mat-icon><h2>{{ stats.totalTrips }}</h2><p>Trips</p></mat-card>
      <mat-card><mat-icon>place</mat-icon><h2>{{ stats.totalPlaces }}</h2><p>Places</p></mat-card>
      <mat-card><mat-icon>star</mat-icon><h2>{{ stats.totalReviews }}</h2><p>Reviews</p></mat-card>
      <mat-card><mat-icon>how_to_vote</mat-icon><h2>{{ stats.totalVotes }}</h2><p>Votes</p></mat-card>
      <mat-card><mat-icon>hiking</mat-icon><h2>{{ stats.totalGuides }}</h2><p>Guides</p></mat-card>
      <mat-card><mat-icon>local_taxi</mat-icon><h2>{{ stats.totalDrivers }}</h2><p>Drivers</p></mat-card>
      <mat-card><mat-icon>find_in_page</mat-icon><h2>{{ stats.totalLostItems }}</h2><p>Lost items</p></mat-card>
    </div>

    <div class="page-header"><h1>System Analysis</h1></div>

    <app-loading *ngIf="loadingSystemStats"></app-loading>

    <div class="analysis-grid" *ngIf="!loadingSystemStats && systemStats">
      <mat-card>
        <h3>Users</h3>
        <p>Total: {{ systemStats.users.total }}</p>
        <p class="active">Active: {{ systemStats.users.active }}</p>
        <p class="blocked">Blocked: {{ systemStats.users.blocked }}</p>
      </mat-card>
      <mat-card>
        <h3>Trips</h3>
        <p>Total: {{ systemStats.trips.total }}</p>
        <p class="active">Active: {{ systemStats.trips.active }}</p>
        <p class="completed">Completed: {{ systemStats.trips.completed }}</p>
        <p class="blocked">Cancelled: {{ systemStats.trips.cancelled }}</p>
      </mat-card>
      <mat-card>
        <h3>Lost Items</h3>
        <p>Total: {{ systemStats.lostItems.total }}</p>
        <p class="active">Pending: {{ systemStats.lostItems.pending }}</p>
        <p class="completed">Resolved: {{ systemStats.lostItems.resolved }}</p>
      </mat-card>
    </div>

    <p *ngIf="!loadingSystemStats && !systemStats" class="empty">Couldn't load system analysis.</p>

    <div class="quick-links">
      <a mat-raised-button color="primary" routerLink="/admin/users">Manage Users</a>
      <a mat-raised-button color="primary" routerLink="/admin/verifications">Verifications</a>
      <a mat-raised-button color="primary" routerLink="/admin/trips">Trip Management</a>
    </div>
  `,
  styles: [`
    .page-header { padding: 1.5rem; }
    .stats-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 1rem; padding: 0 1.5rem; }
    .stats-grid mat-card { text-align: center; padding: 1rem; }
    .stats-grid mat-icon { color: #3f51b5; }
    .stats-grid h2 { margin: 0.25rem 0; }
    .stats-grid p { margin: 0; color: #777; font-size: 0.85rem; }
    .analysis-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 1rem; padding: 0 1.5rem; }
    .analysis-grid mat-card h3 { margin-top: 0; }
    .analysis-grid p { margin: 0.25rem 0; }
    .analysis-grid .active { color: #2e7d32; }
    .analysis-grid .completed { color: #1565c0; }
    .analysis-grid .blocked { color: #c62828; }
    .quick-links { display: flex; gap: 1rem; flex-wrap: wrap; padding: 1.5rem; }
    .empty { color: #888; padding: 0 1.5rem; }
  `]
})
export class AdminDashboardComponent implements OnInit {

  stats: IDashboardStats | null = null;
  systemStats: ISystemStatistics | null = null;
  loading = false;
  loadingSystemStats = false;

  constructor(private adminService: AdminService, private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.loading = true;
    this.adminService.getDashboard().subscribe({
      next: res => {
        this.loading = false;
        this.stats = res.data ?? null;
      },
      error: err => {
        this.loading = false;
        this.snackBar.open(err?.error?.error?.message || 'Failed to load dashboard', 'Close', { duration: 4000 });
      }
    });

    this.loadingSystemStats = true;
    this.adminService.getSystemStatistics().subscribe({
      next: res => {
        this.loadingSystemStats = false;
        this.systemStats = res.data ?? null;
      },
      error: err => {
        this.loadingSystemStats = false;
        this.snackBar.open(err?.error?.error?.message || 'Failed to load system analysis', 'Close', { duration: 4000 });
      }
    });
  }
}
