import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TripService, Trip } from '../../core/services/trip.service';
import { TranslationService } from '../../core/services/translation.service';
import { ToastService } from '../../core/services/toast.service';
import { PaginationComponent } from '../../shared/pagination.component';

@Component({
  selector: 'app-shared-trips',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, PaginationComponent],
  template: `
    <div class="page">
      <div class="page-header">
        <div>
          <h2 style="margin:0">{{ translation.t('ui.sharedTrips') }}</h2>
          <p class="muted" style="margin:0.2rem 0 0">Browse trips shared by other travelers</p>
        </div>
        <span class="tm-btn tm-btn-outline" (click)="showJoinForm = !showJoinForm">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>
          {{ translation.t('ui.join') }}
        </span>
      </div>

      @if (showJoinForm) {
          <div class="join-card">
            <h3>{{ translation.t('ui.join') }}</h3>
            <p>Paste the share link or trip ID to join</p>
            <div class="join-input-row">
              <input class="tm-input join-input" [(ngModel)]="joinLink" placeholder="Paste trip link or ID..." (keydown.enter)="joinByLink()" />
              <button class="tm-btn" (click)="joinByLink()">{{ translation.t('ui.join') }}</button>
            </div>
            <button class="tm-btn tm-btn-sm tm-btn-outline" (click)="showJoinForm = false">{{ translation.t('ui.cancel') }}</button>
          </div>
      }

      @if (loading) {
        <div class="tm-loader"></div>
      } @else if (error) {
        <div class="error-box">{{ error }}</div>
      } @else if (sharedTrips.length === 0) {
        <div class="empty-state">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
          </svg>
          <h3>{{ translation.t('trip.no_shared') }}</h3>
          <p>Create a trip and share it with others, or ask a friend for a share link</p>
          <a routerLink="/app/trip/new" class="tm-btn">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Create a Trip
          </a>
        </div>
      } @else {
        <div class="shared-grid">
          @for (trip of pagedTrips; track trip._id) {
            <div class="shared-card">
              <div class="shared-top">
                <span class="badge badge-{{ trip.status.toLowerCase() }}">{{ translation.t('ui.' + trip.status.toLowerCase()) }}</span>
                <span class="trip-price">\${{ trip.price }}</span>
              </div>
              <div class="shared-mid">
                <div class="shared-stat">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                  <span>{{ trip.places.length || 0 }} {{ translation.t('ui.places') }}</span>
                </div>
                <div class="shared-stat">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
                  <span>{{ trip.peopleCount }} people</span>
                </div>
                <div class="shared-stat">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
                  <span>{{ trip.distanceMeters ? (trip.distanceMeters / 1000).toFixed(1) + 'km' : 'N/A' }}</span>
                </div>
              </div>
              <div class="capacity-section">
                <div class="capacity-header">
                  <span class="capacity-label">{{ translation.t('ui.capacity') }}</span>
                  <span class="capacity-text">Capacity: {{ vehicleCapacity(trip) }}, Joined: {{ trip.peopleCount }}</span>
                </div>
                <div class="capacity-bar">
                  <div class="capacity-fill" [style.width.%]="capacityPercent(trip)"></div>
                </div>
                @if (isFull(trip)) {
                  <div class="capacity-full">This trip is full</div>
                }
              </div>
              <div class="cost-split">
                <span class="cost-label">{{ translation.t('trip.per_person') }}</span>
                <span class="cost-amount">\${{ perPersonCost(trip) }}</span>
                <span class="cost-total">of \${{ trip.price }} total</span>
              </div>
              <div class="shared-bottom">
                <a [routerLink]="['/app/trip', trip._id]" class="tm-btn tm-btn-sm tm-btn-outline view-btn">View Details</a>
                <button class="tm-btn tm-btn-sm tm-btn-outline copy-btn" (click)="copyInviteLink(trip)">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                  {{ translation.t('ui.copy') }}
                </button>
                @if (!isFull(trip) && trip.status === 'PENDING') {
                  <button class="tm-btn tm-btn-sm join-btn" (click)="joinTrip(trip)">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                    {{ translation.t('ui.join') }}
                  </button>
                }
              </div>
            </div>
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

    .empty-state { text-align: center; padding: 3rem 1rem; }
    .empty-state svg { width: 64px; height: 64px; color: var(--tm-muted); opacity: 0.4; margin-bottom: 1rem; }
    .empty-state h3 { margin: 0 0 0.3rem; }
    .empty-state p { color: var(--tm-muted); margin: 0 0 1.2rem; }

    .join-card { background: var(--tm-surface); border: 1px solid var(--glass-border); border-radius: 12px; padding: 1.25rem; margin-bottom: 1.5rem; }
    .join-card h3 { margin: 0 0 0.3rem; font-size: 1rem; }
    .join-card p { margin: 0 0 0.8rem; font-size: 0.85rem; color: var(--tm-muted); }
    .join-input-row { display: flex; gap: 0.5rem; margin-bottom: 0.5rem; }
    .join-input { margin: 0; flex: 1; }

    .shared-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 1rem; }
    .shared-card { background: var(--tm-surface); border: 1px solid var(--glass-border); border-radius: 12px; padding: 1.25rem; transition: all 0.2s; }
    .shared-card:hover { background: var(--tm-surface-raised); transform: translateY(-2px); border-color: rgba(17,17,17,0.2); }
    .shared-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem; }
    .trip-price { font-size: 1.1rem; font-weight: 700; color: var(--tm-primary); }
    .shared-mid { display: flex; gap: 1rem; margin-bottom: 0.75rem; flex-wrap: wrap; }
    .shared-stat { display: flex; align-items: center; gap: 0.3rem; font-size: 0.82rem; color: var(--tm-muted); }
    .shared-stat svg { color: var(--tm-primary); flex-shrink: 0; }

    .capacity-section { margin-bottom: 0.75rem; }
    .capacity-header { display: flex; justify-content: space-between; margin-bottom: 0.3rem; }
    .capacity-label { font-size: 0.72rem; text-transform: uppercase; letter-spacing: 0.04em; color: var(--tm-muted); font-weight: 600; }
    .capacity-text { font-size: 0.78rem; color: var(--tm-muted); }
    .capacity-bar { height: 5px; background: var(--glass-border); border-radius: 999px; overflow: hidden; margin-bottom: 0.25rem; }
    .capacity-fill { height: 100%; border-radius: 999px; transition: width 0.3s; }
    .capacity-fill { background: var(--tm-primary); }
    .capacity-full { font-size: 0.75rem; color: var(--tm-danger); font-weight: 600; }

    .cost-split { display: flex; align-items: center; gap: 0.5rem; margin-bottom: 1rem; padding: 0.5rem 0.75rem; background: rgba(255,255,255,0.02); border-radius: 8px; }
    .cost-label { font-size: 0.72rem; text-transform: uppercase; letter-spacing: 0.04em; color: var(--tm-muted); font-weight: 600; }
    .cost-amount { font-size: 1rem; font-weight: 700; color: var(--tm-success); }
    .cost-total { font-size: 0.78rem; color: var(--tm-muted); margin-left: auto; }

    .shared-bottom { display: flex; gap: 0.5rem; padding-top: 0.75rem; border-top: 1px solid var(--glass-border); }
    .view-btn, .join-btn, .copy-btn { flex: 1; justify-content: center; }
    .join-btn { background: var(--tm-success); }
    .join-btn:hover { background: #111111; }
  `]
})
export class SharedTripsComponent implements OnInit {
  private tripService = inject(TripService);
  translation = inject(TranslationService);
  private toast = inject(ToastService);
  private router = inject(Router);
  sharedTrips: Trip[] = [];
  loading = true;
  error = '';
  showJoinForm = false;
  joinLink = '';

  page = 1;
  pageSize = 9;
  get totalPages() { return Math.max(1, Math.ceil(this.sharedTrips.length / this.pageSize)); }
  get pagedTrips(): Trip[] {
    const start = (this.page - 1) * this.pageSize;
    return this.sharedTrips.slice(start, start + this.pageSize);
  }

  ngOnInit() {
    this.loadShared();
  }

  loadShared() {
    this.loading = true; this.error = '';
    this.tripService.getSharedTrips().subscribe({
      next: (res) => { this.sharedTrips = res.data || []; this.page = 1; this.loading = false; },
      error: (e) => { this.loading = false; this.error = e.error?.message || 'Failed to load shared trips'; this.toast.error(this.error); },
    });
  }

  vehicleCapacity(trip: Trip): number {
    return trip.peopleCount + 2;
  }

  capacityPercent(trip: Trip): number {
    const cap = this.vehicleCapacity(trip);
    if (cap <= 0) return 100;
    return Math.min((trip.peopleCount / cap) * 100, 100);
  }

  isFull(trip: Trip): boolean {
    return this.capacityPercent(trip) >= 100;
  }

  perPersonCost(trip: Trip): string {
    const count = Math.max(trip.peopleCount, 1);
    return (trip.price / count).toFixed(2);
  }

  inviteLink(trip: Trip): string {
    return `${window.location.origin}/app/trip/${trip._id}`;
  }

  copyInviteLink(trip: Trip) {
    const link = this.inviteLink(trip);
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(link).then(
        () => this.toast.success('Invite link copied!'),
        () => this.toast.error('Could not copy link'),
      );
    } else {
      this.toast.error('Clipboard not available');
    }
  }

  onPageChange(p: number) {
    this.page = p;
  }

  joinTrip(trip: Trip) {
    this.tripService.update(trip._id!, { peopleCount: trip.peopleCount + 1 }).subscribe({
      next: () => { this.toast.success('Joined trip!'); this.loadShared(); },
      error: (e) => this.toast.error(e.error?.message || 'Failed to join trip'),
    });
  }

  joinByLink() {
    const link = this.joinLink.trim();
    if (!link) { this.toast.error('Paste a trip link or ID'); return; }
    const segments = link.split('/');
    const id = segments[segments.length - 1] || link;
    this.router.navigate(['/app/trip', id]);
    this.showJoinForm = false;
    this.joinLink = '';
  }
}
