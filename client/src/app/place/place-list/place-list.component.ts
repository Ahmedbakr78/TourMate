import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PlaceService, Place } from '../../core/services/place.service';
import { ToastService } from '../../core/services/toast.service';
import { VoteButtonComponent } from '../../vote/vote-button/vote-button.component';
import { MapComponent, MapMarker } from '../../shared/map/map.component';
import { LocalService } from '../../core/services/local.service';
import { TranslationService } from '../../core/services/translation.service';
import { IconComponent } from '../../shared/icon.component';

@Component({
  selector: 'app-place-list',
  standalone: true,
  imports: [CommonModule, FormsModule, VoteButtonComponent, MapComponent, IconComponent],
  template: `
    <div class="page">
      <div class="page-header">
        <div>
          <h2 style="margin:0">{{ translation.t('ui.places') }}</h2>
          <p class="muted" style="margin:0.2rem 0 0">Discover destinations</p>
        </div>
        <div class="view-toggle">
          <button class="toggle-btn" [class.active]="viewMode === 'list'" (click)="viewMode = 'list'">
            <app-icon name="menu" [size]="16"></app-icon>
            List
          </button>
          <button class="toggle-btn" [class.active]="viewMode === 'map'" (click)="viewMode = 'map'">
            <app-icon name="map" [size]="16"></app-icon>
            Map
          </button>
        </div>
      </div>

      <div class="filters">
        <div class="search-wrap">
          <input type="text" [(ngModel)]="query" placeholder="{{ translation.t('place.search') }}" class="tm-input" (input)="search()">
          <app-icon class="search-icon" name="search" [size]="16"></app-icon>
        </div>
        <select [(ngModel)]="cityFilter" class="tm-input" (change)="search()">
          <option value="">{{ translation.t('place.all_cities') }}</option>
          <option value="Cairo">Cairo</option>
          <option value="Giza">Giza</option>
          <option value="Alexandria">Alexandria</option>
          <option value="Luxor">Luxor</option>
          <option value="Aswan">Aswan</option>
        </select>
        <select [(ngModel)]="categoryFilter" class="tm-input" (change)="search()">
          <option value="">{{ translation.t('place.all_categories') }}</option>
          <option value="historical">Historical</option>
          <option value="museum">Museum</option>
          <option value="park">Park</option>
          <option value="restaurant">Restaurant</option>
          <option value="beach">Beach</option>
        </select>
      </div>

      @if (loading) {
        <div class="tm-loader"></div>
      } @else if (error) {
        <div class="error-box">{{ error }}</div>
      } @else if (viewMode === 'map') {
        <div class="map-view">
          <app-map
            [markers]="mapMarkers"
            [center]="mapCenter"
            [zoom]="11"
            (markerClick)="focusPlace($event)"
          />
          @if (selectedPlace) {
            <div class="selected-place-card">
              <div class="selected-place-info">
                <h4>{{ selectedPlace.name }}</h4>
                <span class="place-cat">{{ selectedPlace.category }} · {{ selectedPlace.city }}</span>
                <p>{{ selectedPlace.description }}</p>
              </div>
              <div class="selected-place-vote">
                <app-vote-button [placeId]="selectedPlace._id!" />
              </div>
            </div>
          }
        </div>
      } @else {
        <div class="places-grid">
          @for (p of places; track p._id) {
            <div class="place-card">
              <div class="place-top">
                <span class="place-category">{{ p.category }}</span>
              </div>
              <h4>{{ p.name }}</h4>
                <button class="fav-heart" [class.active]="isFav(p._id || '')" (click)="toggleFav(p)" title="{{ translation.t('ui.favorites') }}">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="isFav(p._id || '') ? 'currentColor' : 'none'" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
              </button>
              <div class="place-location">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                {{ p.city }}
              </div>
              <p class="place-desc">{{ p.description }}</p>
              <div class="place-vote">
                <app-vote-button [placeId]="p._id!" />
              </div>
            </div>
          } @empty {
            <div class="empty-box">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
              <p>{{ translation.t('place.no_places') }}</p>
            </div>
          }
        </div>
      }
    </div>
  `,
  styles: [`
    .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
    .view-toggle { display: flex; gap: 0; background: var(--tm-surface); border: 1px solid var(--glass-border); border-radius: 9px; overflow: hidden; }
    .toggle-btn {
      display: flex; align-items: center; gap: 0.3rem; padding: 0.4rem 0.75rem;
      border: none; background: none; color: var(--tm-muted); font-size: 0.8rem; font-weight: 500;
      cursor: pointer; transition: all 0.15s;
    }
    .toggle-btn:hover { background: var(--glass-hover); color: var(--tm-text); }
    .toggle-btn.active { background: rgba(17,17,17,0.12); color: var(--tm-primary); font-weight: 600; }
    .toggle-btn svg { flex-shrink: 0; }

    .filters { display: flex; gap: 0.5rem; margin-bottom: 1.5rem; flex-wrap: wrap; }
    .search-wrap { position: relative; flex: 1; min-width: 200px; }
    .search-wrap .tm-input { padding-right: 2.2rem; margin-bottom: 0; }
    .search-icon { position: absolute; right: 12px; top: 50%; transform: translateY(-50%); color: var(--tm-muted); pointer-events: none; }
    .filters select { width: auto; min-width: 140px; margin-bottom: 0; }
    .error-box { padding: 1rem; background: rgba(239,68,68,0.1); border: 1px solid rgba(239,68,68,0.2); border-radius: 10px; color: #a33a32; grid-column: 1 / -1; }

    .map-view { background: var(--tm-surface); border: 1px solid var(--glass-border); border-radius: 12px; overflow: hidden; min-height: 500px; position: relative; }
    .map-view app-map { height: 500px; display: block; }

    .selected-place-card {
      position: absolute; bottom: 1rem; left: 1rem; right: 1rem;
      background: var(--tm-surface-raised); border: 1px solid var(--glass-border);
      border-radius: 12px; padding: 1rem; display: flex; align-items: flex-start; gap: 1rem;
      box-shadow: 0 8px 32px rgba(0,0,0,0.3); z-index: 1000;
    }
    .selected-place-info { flex: 1; min-width: 0; }
    .selected-place-info h4 { margin: 0 0 0.2rem; font-size: 1rem; }
    .selected-place-info span { font-size: 0.78rem; color: var(--tm-muted); }
    .selected-place-info p { margin: 0.3rem 0 0; font-size: 0.82rem; color: var(--tm-muted); }
    .selected-place-vote { flex-shrink: 0; }

    .places-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1rem; }
    .place-card {
      background: var(--tm-surface);
      border: 1px solid var(--glass-border);
      border-radius: 12px;
      padding: 1.25rem;
      transition: all 0.2s;
    }
    .place-card:hover { background: var(--tm-surface-raised); transform: translateY(-2px); }
    .place-top { margin-bottom: 0.5rem; }
    .place-category { font-size: 0.72rem; text-transform: uppercase; letter-spacing: 0.04em; color: var(--tm-primary); font-weight: 600; }
    .place-card h4 { margin: 0 0 0.35rem; font-size: 1.05rem; position: relative; padding-right: 1.5rem; }
    .fav-heart { position: absolute; top: 1.1rem; right: 1.1rem; background: none; border: none; color: var(--tm-muted); cursor: pointer; padding: 4px; border-radius: 50%; transition: all 0.15s; }
    .fav-heart:hover { color: var(--tm-danger); background: rgba(239,68,68,0.1); }
    .fav-heart.active { color: #a33a32; }
    .place-location { display: flex; align-items: center; gap: 0.3rem; font-size: 0.82rem; color: var(--tm-muted); margin-bottom: 0.6rem; }
    .place-location svg { color: var(--tm-primary); flex-shrink: 0; }
    .place-desc { margin: 0 0 0.6rem; font-size: 0.85rem; color: var(--tm-muted); line-height: 1.5; }
    .place-vote { display: flex; justify-content: flex-end; }
    .empty-box { grid-column: 1 / -1; text-align: center; padding: 3rem; color: var(--tm-muted); }
    .empty-box svg { margin-bottom: 0.5rem; }
    .empty-box p { margin: 0; }
  `]
})
export class PlaceListComponent implements OnInit {
  private placeService = inject(PlaceService);
  translation = inject(TranslationService);
  private toast = inject(ToastService);
  private local = inject(LocalService);
  places: Place[] = [];
  query = '';
  cityFilter = '';
  categoryFilter = '';
  loading = false;
  error = '';
  viewMode: 'list' | 'map' = 'list';
  selectedPlace: Place | null = null;
  mapCenter: [number, number] = [30.0444, 31.2357];

  get mapMarkers(): MapMarker[] {
    return this.places.filter(p => p.coordinates?.coordinates?.length === 2).map(p => ({
      id: p._id || '',
      lat: p.coordinates!.coordinates[1],
      lng: p.coordinates!.coordinates[0],
      label: p.name,
      icon: 'place' as const,
      color: p._id === this.selectedPlace?._id ? '#9a7b3a' : 'var(--tm-primary)',
    }));
  }

  ngOnInit() { this.load(); }

  load() {
    this.loading = true; this.error = '';
    this.placeService.getAll({ city: this.cityFilter, category: this.categoryFilter }).subscribe({
      next: (res) => { this.places = res.data || []; this.loading = false; this.updateMapCenter(); },
      error: (e) => { this.loading = false; this.error = e.error?.message || 'Failed to load places'; this.toast.error(this.error); },
    });
  }

  search() {
    if (this.query.length >= 2) {
      this.loading = true;
      this.placeService.search({ q: this.query }).subscribe({
        next: (res) => { this.places = res.data || []; this.loading = false; this.updateMapCenter(); },
        error: (e) => { this.loading = false; this.error = e.error?.message || 'Search failed'; },
      });
    } else {
      this.load();
    }
  }

  updateMapCenter() {
    const coords = this.places.filter(p => p.coordinates?.coordinates?.length === 2);
    if (coords.length > 0) {
      const lat = coords.reduce((s, p) => s + p.coordinates!.coordinates[1], 0) / coords.length;
      const lng = coords.reduce((s, p) => s + p.coordinates!.coordinates[0], 0) / coords.length;
      this.mapCenter = [lat, lng];
    }
  }

  focusPlace(placeId: string) {
    this.selectedPlace = this.places.find(p => p._id === placeId) || null;
  }

  isFav(id: string): boolean {
    return this.local.isFavorite(id);
  }

  toggleFav(p: Place) {
    if (!p._id) return;
    this.local.toggleFavorite({ _id: p._id, name: p.name, city: p.city, category: p.category, description: p.description, coordinates: p.coordinates });
    this.toast.success(this.isFav(p._id) ? 'Added to favorites' : 'Removed from favorites');
  }
}
