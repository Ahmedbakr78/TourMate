import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { PlaceService, Place } from '../../core/services/place.service';
import { LocalService } from '../../core/services/local.service';
import { TranslationService } from '../../core/services/translation.service';
import { ToastService } from '../../core/services/toast.service';
import { MapComponent, MapMarker } from '../../shared/map/map.component';
import { IconComponent } from '../../shared/icon.component';

@Component({
  selector: 'app-place-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, MapComponent, IconComponent],
  template: `
    <div class="page">
      <div class="page-header">
        <div>
          <a routerLink="/app/places" class="back-link"><app-icon name="arrow-right" [size]="16" [style.transform]="'rotate(180deg)'"></app-icon> {{ translation.t('ui.back') }} {{ translation.t('ui.places') }}</a>
          @if (place) { <h2 style="margin:0.3rem 0 0">{{ place.name }}</h2> }
        </div>
        @if (place) {
          <button class="tm-btn tm-btn-sm" [class.tm-btn-outline]="!isFav" (click)="toggleFav()">
            <app-icon [name]="isFav ? 'check' : 'plus'" [size]="16"></app-icon>
            {{ translation.t('ui.save') }}
          </button>
        }
      </div>

      @if (loading) {
        <div class="tm-loader"></div>
      } @else if (error) {
        <div class="error-box">{{ error }}</div>
      } @else if (place) {
        <div class="detail-grid">
          <div class="detail-main">
            <div class="detail-tags">
              <span class="badge">{{ place.category }}</span>
              <span class="detail-city"><app-icon name="location" [size]="14"></app-icon> {{ place.city }}</span>
            </div>
            <p class="detail-desc">{{ place.description || 'No description available.' }}</p>

            <h4 class="detail-sub">Location</h4>
            @if (hasCoords) {
              <div class="mini-map">
                <app-map [markers]="markers" [center]="center" [zoom]="14" />
              </div>
            } @else {
              <p class="muted">Coordinates not available for this place.</p>
            }
            @if (hasCoords) {
              <p class="coords-text">{{ lat }}, {{ lng }}</p>
            }
          </div>

          <aside class="detail-side">
            <div class="side-card">
              <strong>{{ translation.t('ui.category') }}</strong>
              <span>{{ place.category }}</span>
            </div>
            <div class="side-card">
              <strong>{{ translation.t('ui.city') }}</strong>
              <span>{{ place.city }}</span>
            </div>
            @if (hasCoords) {
              <div class="side-card">
                <strong>Coordinates</strong>
                <span>{{ lat }}, {{ lng }}</span>
              </div>
            }
            <button class="tm-btn tm-btn-block" [class.tm-btn-outline]="!isFav" (click)="toggleFav()">
              <app-icon [name]="isFav ? 'check' : 'star'" [size]="16"></app-icon>
              {{ translation.t('ui.favorites') }}
            </button>
          </aside>
        </div>
      }
    </div>
  `,
  styles: [`
    .page-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1.5rem; gap: 0.5rem; flex-wrap: wrap; }
    .back-link { display: inline-flex; align-items: center; gap: 0.3rem; color: var(--tm-muted); text-decoration: none; font-size: 0.85rem; font-weight: 600; }
    .back-link:hover { color: var(--tm-primary); }

    .error-box { padding: 1rem; background: rgba(239,68,68,0.1); border: 1px solid rgba(239,68,68,0.2); border-radius: 10px; color: #a33a32; }

    .detail-grid { display: grid; grid-template-columns: 1fr 260px; gap: 1.25rem; align-items: start; }
    .detail-tags { display: flex; align-items: center; gap: 0.6rem; margin-bottom: 0.75rem; }
    .badge { padding: 0.25rem 0.6rem; border-radius: 999px; font-size: 0.74rem; font-weight: 600; background: rgba(17,17,17,0.08); color: var(--tm-primary); text-transform: capitalize; }
    .detail-city { display: inline-flex; align-items: center; gap: 0.3rem; font-size: 0.85rem; color: var(--tm-muted); }
    .detail-city app-icon { color: var(--tm-primary); }
    .detail-desc { font-size: 0.92rem; line-height: 1.6; color: var(--tm-text); margin: 0 0 1.25rem; }

    .detail-sub { font-size: 0.9rem; margin: 0 0 0.5rem; }
    .mini-map { height: 320px; border-radius: 12px; overflow: hidden; border: 1px solid var(--glass-border); }
    .mini-map app-map { height: 100%; display: block; }
    .coords-text { font-size: 0.8rem; color: var(--tm-muted); margin: 0.5rem 0 0; }

    .detail-side { display: flex; flex-direction: column; gap: 0.5rem; }
    .side-card { background: var(--tm-surface); border: 1px solid var(--glass-border); border-radius: 10px; padding: 0.85rem 1rem; display: flex; flex-direction: column; gap: 0.15rem; }
    .side-card strong { font-size: 0.74rem; text-transform: uppercase; letter-spacing: 0.04em; color: var(--tm-muted); }
    .side-card span { font-size: 0.9rem; }
    .tm-btn-block { width: 100%; justify-content: center; margin-top: 0.25rem; }

    .muted { color: var(--tm-muted); }
  `],
})
export class PlaceDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private placeService = inject(PlaceService);
  translation = inject(TranslationService);
  private local = inject(LocalService);
  private toast = inject(ToastService);

  place: Place | null = null;
  loading = true;
  error = '';

  get id(): string { return this.route.snapshot.paramMap.get('id') || ''; }
  get hasCoords(): boolean { return !!this.place?.coordinates?.coordinates?.length; }
  get lat(): number { return this.place?.coordinates?.coordinates?.[1] ?? 0; }
  get lng(): number { return this.place?.coordinates?.coordinates?.[0] ?? 0; }
  get center(): [number, number] { return [this.lat, this.lng]; }
  get markers(): MapMarker[] {
    if (!this.hasCoords) return [];
    return [{ id: this.place!._id || 'place', lat: this.lat, lng: this.lng, label: this.place!.name, icon: 'place', color: 'var(--tm-primary)' }];
  }
  get isFav(): boolean { return this.place?._id ? this.local.isFavorite(this.place._id) : false; }

  ngOnInit() {
    this.loading = true; this.error = '';
    const id = this.id;
    if (!id) { this.loading = false; this.error = 'Place not found'; return; }
    this.placeService.getById(id).subscribe({
      next: (res) => { this.place = res.data || res; this.loading = false; },
      error: (e) => { this.loading = false; this.error = e.error?.message || 'Failed to load place'; this.toast.error(this.error); },
    });
  }

  toggleFav() {
    if (!this.place?._id) return;
    this.local.toggleFavorite({
      _id: this.place._id,
      name: this.place.name,
      city: this.place.city,
      category: this.place.category,
      description: this.place.description,
      coordinates: this.place.coordinates,
    });
    this.toast.success(this.isFav ? 'Removed from favorites' : 'Saved to favorites');
  }
}
