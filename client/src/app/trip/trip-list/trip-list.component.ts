import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TripService, Trip } from '../../core/services/trip.service';
import { ToastService } from '../../core/services/toast.service';
import { TranslationService } from '../../core/services/translation.service';
import { IconComponent } from '../../shared/icon.component';
import { PaginationComponent } from '../../shared/pagination.component';

@Component({
  selector: 'app-trip-list',
  standalone: true,
  imports: [CommonModule, RouterLink, IconComponent, PaginationComponent],
  template: `
    <div class="page">
      <div class="page-header">
        <div>
          <h2 style="margin:0">{{ translation.t('ui.myTrips') }}</h2>
          <p class="muted" style="margin:0.2rem 0 0">Manage your travel plans</p>
        </div>
        <a routerLink="/app/trip/new" class="tm-btn">
          <app-icon name="plus" [size]="16"></app-icon>
          {{ translation.t('ui.newTrip') }}
        </a>
      </div>

      @if (loading) {
        <div class="tm-loader"></div>
      } @else if (error) {
        <div class="error-box">{{ error }}</div>
      } @else if (trips.length === 0) {
        <div class="empty-state">
          <div class="empty-icon"><app-icon name="trip" [size]="56" color="var(--tm-primary)"></app-icon></div>
          <h3>{{ translation.t('trip.no_trips') }}</h3>
          <p>Start planning your next adventure</p>
          <a routerLink="/app/trip/new" class="tm-btn">
            <app-icon name="plus" [size]="16"></app-icon>
            {{ translation.t('ui.newTrip') }}
          </a>
          <div class="feature-cards">
            <div class="feature-card">
              <div class="feature-icon"><app-icon name="map" [size]="24"></app-icon></div>
              <h4>{{ translation.t('ui.places') }}</h4>
              <p>Discover historical sites, museums, parks and more</p>
              <a routerLink="/app/places" class="tm-btn tm-btn-sm tm-btn-outline">Browse</a>
            </div>
            <div class="feature-card">
              <div class="feature-icon"><app-icon name="search" [size]="24"></app-icon></div>
              <h4>{{ translation.t('ui.lostFound') }}</h4>
              <p>Report or find lost items during your travels</p>
              <a routerLink="/app/lost-items" class="tm-btn tm-btn-sm tm-btn-outline">View</a>
            </div>
            <div class="feature-card">
              <div class="feature-icon"><app-icon name="bell" [size]="24"></app-icon></div>
              <h4>{{ translation.t('ui.notifications') }}</h4>
              <p>Stay updated with trip alerts and messages</p>
              <a routerLink="/app/notifications" class="tm-btn tm-btn-sm tm-btn-outline">View</a>
            </div>
          </div>
        </div>
      } @else {
        <div class="trip-cards">
          @for (trip of pagedTrips; track trip._id) {
            <a [routerLink]="['/app/trip', trip._id]" class="trip-card">
              <div class="trip-top">
                <span class="badge badge-{{ trip.status.toLowerCase() }}">{{ translation.t('ui.' + trip.status.toLowerCase()) }}</span>
                <span class="trip-price">\${{ trip.price }}</span>
              </div>
              <div class="trip-mid">
                <div class="trip-stat">
                  <app-icon name="map" [size]="16"></app-icon>
                  <span>{{ trip.places.length }} {{ translation.t('ui.places') }}</span>
                </div>
                <div class="trip-stat">
                  <app-icon name="user" [size]="16"></app-icon>
                  <span>{{ trip.peopleCount }} people</span>
                </div>
              </div>
              <div class="trip-bottom">
                <div class="trip-date">
                  <app-icon name="calendar" [size]="14"></app-icon>
                  {{ trip.startDate | date:'MMM d' }} - {{ trip.endDate | date:'MMM d, yyyy' }}
                </div>
              </div>
            </a>
          }
        </div>
        @if (totalPages > 1) {
          <app-pagination [page]="page" [totalPages]="totalPages" (pageChange)="onPageChange($event)" />
        }
      }
    </div>
  `,
  styles: [`
    .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
    .error-box { padding: 1rem; background: rgba(239,68,68,0.1); border: 1px solid rgba(239,68,68,0.2); border-radius: 10px; color: #a33a32; }

    .empty-state { text-align: center; padding: 3rem 1rem; max-width: 700px; margin: 0 auto; }
    .empty-icon { margin-bottom: 1rem; color: var(--tm-muted); opacity: 0.5; }
    .empty-state h3 { font-size: 1.3rem; margin: 0 0 0.3rem; }
    .empty-state > p { color: var(--tm-muted); margin: 0 0 1.2rem; }

    .feature-cards { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; margin-top: 2.5rem; }
    .feature-card {
      background: var(--tm-surface);
      border: 1px solid var(--glass-border);
      border-radius: 12px;
      padding: 1.5rem 1rem;
      text-align: center;
      transition: all 0.2s;
    }
    .feature-card:hover { background: var(--tm-surface-raised); transform: translateY(-2px); }
    .feature-icon {
      width: 52px; height: 52px; margin: 0 auto 0.75rem; border-radius: 14px;
      display: flex; align-items: center; justify-content: center;
      background: rgba(17,17,17,0.12); color: var(--tm-primary);
    }
    .feature-card h4 { margin: 0 0 0.3rem; font-size: 0.95rem; }
    .feature-card p { margin: 0 0 0.8rem; font-size: 0.82rem; color: var(--tm-muted); line-height: 1.4; }

    .trip-cards { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 1rem; }
    .trip-card {
      display: block;
      background: var(--tm-surface);
      border: 1px solid var(--glass-border);
      border-radius: 12px;
      padding: 1.25rem;
      text-decoration: none;
      color: inherit;
      transition: all 0.2s;
    }
    .trip-card:hover { background: var(--tm-surface-raised); transform: translateY(-2px); border-color: rgba(17,17,17,0.2); }
    .trip-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; }
    .trip-price { font-size: 1.1rem; font-weight: 700; color: var(--tm-primary); }
    .trip-mid { display: flex; gap: 1.25rem; margin-bottom: 0.75rem; }
    .trip-stat { display: flex; align-items: center; gap: 0.35rem; font-size: 0.85rem; color: var(--tm-muted); }
    .trip-stat svg { color: var(--tm-primary); flex-shrink: 0; }
    .trip-bottom { padding-top: 0.75rem; border-top: 1px solid var(--glass-border); }
    .trip-date { display: flex; align-items: center; gap: 0.35rem; font-size: 0.82rem; color: var(--tm-muted); }
    .trip-date svg { color: var(--tm-muted); flex-shrink: 0; }
  `]
})
export class TripListComponent implements OnInit {
  private tripService = inject(TripService);
  translation = inject(TranslationService);
  private toast = inject(ToastService);
  trips: Trip[] = [];
  loading = true;
  error = '';

  page = 1;
  pageSize = 9;
  get totalPages() { return Math.max(1, Math.ceil(this.trips.length / this.pageSize)); }
  get pagedTrips(): Trip[] {
    const start = (this.page - 1) * this.pageSize;
    return this.trips.slice(start, start + this.pageSize);
  }

  ngOnInit() {
    this.tripService.getMyTrips().subscribe({
      next: (res) => { this.trips = res.data || []; this.page = 1; this.loading = false; },
      error: (e) => {
        this.loading = false;
        this.error = e.error?.message || 'Failed to load trips';
        this.toast.error(this.error);
      },
    });
  }

  onPageChange(p: number) {
    this.page = p;
  }
}
