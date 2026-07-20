import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslationService } from '../core/services/translation.service';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (totalPages > 1) {
      <nav class="tm-pagination" aria-label="Pagination">
        <button class="page-btn" (click)="go(page - 1)" [disabled]="page <= 1">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"/></svg>
          {{ translation.t('ui.prev') }}
        </button>
        @for (p of pages; track $index) {
          @if (p.value === null) {
            <span class="page-ellipsis">&hellip;</span>
          } @else {
            <button class="page-btn" [class.active]="p.value === page" (click)="go(p.value)">{{ p.label }}</button>
          }
        }
        <button class="page-btn" (click)="go(page + 1)" [disabled]="page >= totalPages">
          {{ translation.t('ui.next') }}
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
        </button>
      </nav>
    }
  `,
  styles: [`
    .tm-pagination {
      display: flex; align-items: center; justify-content: center; gap: 0.35rem;
      margin: 1.5rem 0 0.5rem; flex-wrap: wrap;
    }
    .page-btn {
      display: inline-flex; align-items: center; gap: 0.25rem;
      min-width: 36px; height: 34px; padding: 0 0.7rem;
      background: var(--tm-surface); color: var(--tm-text);
      border: 1px solid var(--glass-border); border-radius: 8px;
      font-size: 0.82rem; font-weight: 500; cursor: pointer;
      transition: all 0.15s;
    }
    .page-btn:hover:not(:disabled):not(.active) {
      border-color: rgba(17,17,17,0.25); background: var(--glass-hover);
    }
    .page-btn:disabled { opacity: 0.4; cursor: not-allowed; }
    .page-btn.active {
      background: var(--tm-text); color: var(--tm-surface);
      border-color: var(--tm-text);
    }
    .page-ellipsis {
      color: var(--tm-muted); padding: 0 0.25rem; font-size: 0.85rem;
    }
  `],
})
export class PaginationComponent {
  translation = inject(TranslationService);
  @Input() page = 1;
  @Input() totalPages = 1;
  @Output() pageChange = new EventEmitter<number>();

  get pages(): { label: string; value: number | null }[] {
    const total = this.totalPages;
    const cur = this.page;
    if (total <= 1) return [];

    if (total <= 7) {
      const all: { label: string; value: number | null }[] = [];
      for (let i = 1; i <= total; i++) all.push({ label: '' + i, value: i });
      return all;
    }

    const result: { label: string; value: number | null }[] = [{ label: '1', value: 1 }];
    const start = Math.max(2, cur - 2);
    const end = Math.min(total - 1, cur + 2);
    if (start > 2) result.push({ label: '…', value: null });
    for (let i = start; i <= end; i++) result.push({ label: '' + i, value: i });
    if (end < total - 1) result.push({ label: '…', value: null });
    result.push({ label: '' + total, value: total });
    return result;
  }

  go(p: number | null) {
    if (p === null) return;
    if (p >= 1 && p <= this.totalPages && p !== this.page) {
      this.pageChange.emit(p);
    }
  }
}
