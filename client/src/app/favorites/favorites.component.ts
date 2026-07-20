import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { LocalService, FavoritePlace } from '../core/services/local.service';
import { TranslationService } from '../core/services/translation.service';
import { ToastService } from '../core/services/toast.service';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="page">
      <div class="page-header">
        <div>
          <h2 style="margin:0">{{ translation.t('ui.favorites') }}</h2>
          <p class="muted" style="margin:0.2rem 0 0">Your saved destinations (stored offline)</p>
        </div>
        <span class="count-badge">{{ favorites.length }} saved</span>
      </div>

      @if (favorites.length === 0) {
        <div class="empty-state">
          <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
          <h3>No favorites yet</h3>
          <p>Browse places and tap the heart to save them here</p>
          <a routerLink="/app/places" class="tm-btn">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            {{ translation.t('ui.places') }}
          </a>
        </div>
      } @else {
        <div class="fav-grid">
          @for (f of favorites; track f._id) {
            <div class="fav-card">
              <div class="fav-top">
                <span class="fav-cat">{{ f.category }}</span>
                <button class="fav-remove" (click)="remove(f)" title="{{ translation.t('ui.delete') }}">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
              </div>
              <h4>{{ f.name }}</h4>
              <span class="fav-city">{{ f.city }}</span>
              <p class="fav-desc">{{ f.description }}</p>
            </div>
          }
        </div>
      }
    </div>
  `,
  styles: [`
    .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
    .count-badge { padding: 0.35rem 0.8rem; background: rgba(239,68,68,0.12); color: #a33a32; border-radius: 999px; font-size: 0.8rem; font-weight: 600; }
    .empty-state { text-align: center; padding: 3rem 1rem; }
    .empty-state svg { color: rgba(239,68,68,0.5); margin-bottom: 0.75rem; }
    .empty-state h3 { margin: 0 0 0.3rem; }
    .empty-state p { color: var(--tm-muted); margin: 0 0 1.2rem; }
    .fav-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 1rem; }
    .fav-card { background: var(--tm-surface); border: 1px solid var(--glass-border); border-radius: 12px; padding: 1.25rem; transition: all 0.2s; }
    .fav-card:hover { background: var(--tm-surface-raised); transform: translateY(-2px); }
    .fav-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem; }
    .fav-cat { font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.04em; color: var(--tm-primary); font-weight: 600; }
    .fav-remove { background: none; border: none; color: var(--tm-muted); cursor: pointer; padding: 4px; border-radius: 6px; }
    .fav-remove:hover { background: rgba(239,68,68,0.12); color: #a33a32; }
    .fav-card h4 { margin: 0 0 0.25rem; font-size: 1rem; }
    .fav-city { font-size: 0.78rem; color: var(--tm-muted); }
    .fav-desc { margin: 0.5rem 0 0; font-size: 0.82rem; color: var(--tm-muted); line-height: 1.5; }
  `]
})
export class FavoritesComponent {
  private local = inject(LocalService);
  translation = inject(TranslationService);
  private toast = inject(ToastService);
  get favorites(): FavoritePlace[] { return this.local.getFavorites(); }

  remove(f: FavoritePlace) {
    this.local.removeFavorite(f._id);
    this.toast.info('Removed from favorites');
  }
}
