import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LostItemService } from '../../core/services/lost-item.service';
import { ToastService } from '../../core/services/toast.service';
import { EmptyStateComponent } from '../../shared/empty-state.component';
import { ModalComponent } from '../../shared/modal.component';
import { IconComponent } from '../../shared/icon.component';
import { TranslationService } from '../../core/services/translation.service';

@Component({
  selector: 'app-lost-item-list',
  standalone: true,
  imports: [CommonModule, FormsModule, EmptyStateComponent, ModalComponent, IconComponent],
  template: `
    <div class="page">
      <div class="page-header">
        <div>
          <h2 style="margin:0">{{ translation.t('ui.lostFound') }}</h2>
          <p class="muted" style="margin:0.2rem 0 0">Report and find lost items</p>
        </div>
      </div>

      <div class="lost-form">
        <h3>{{ translation.t('lost.report_lost') }}</h3>
        <div class="form-row">
          <label>{{ translation.t('lost.item_title') }}</label>
          <input type="text" [(ngModel)]="newItem.title" placeholder="e.g. Blue Backpack" class="tm-input">
        </div>
        <div class="form-row">
          <label>{{ translation.t('lost.description') }}</label>
          <textarea [(ngModel)]="newItem.description" placeholder="Describe the item..." class="tm-input" rows="2"></textarea>
        </div>
        <button class="tm-btn tm-btn-primary" (click)="report()" [disabled]="submitting">
          @if (submitting) { Reporting... } @else {
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
            {{ translation.t('lost.report_item') }}
          }
        </button>
        @if (reportErr) { <div class="error-box">{{ reportErr }}</div> }
      </div>

      <h3 style="margin: 1.5rem 0 0.75rem">{{ translation.t('lost.all_items') }}</h3>
      @if (loading) {
        <div class="tm-loader"></div>
      } @else if (loadErr) {
        <div class="error-box">{{ loadErr }}</div>
      } @else {
        <div class="item-list">
          @for (item of items; track item._id) {
            <div class="item-card" [class.found]="item.found">
              <div class="item-info" (click)="openDetail(item._id!)">
                <div class="item-header">
                  <strong>{{ item.title }}</strong>
                  <span class="badge" [class.found]="item.found">{{ item.found ? translation.t('ui.found') : translation.t('ui.lost') }}</span>
                </div>
                <p>{{ item.description }}</p>
                 <span class="view-link"><app-icon name="eye" [size]="13"></app-icon> {{ translation.t('ui.view_details') }}</span>
              </div>
              <div class="item-actions">
                @if (!item.found) {
                  <button class="tm-btn tm-btn-sm tm-btn-success" (click)="reportFound(item._id!)">{{ translation.t('ui.mark_found') }}</button>
                }
                <button class="tm-btn tm-btn-sm tm-btn-danger" (click)="deleteItem(item._id!)">Delete</button>
              </div>
            </div>
          } @empty {
            <app-empty-state [message]="translation.t('lost.no_items')" [actionLabel]="translation.t('lost.report_an_item')" (onAction)="scrollToForm()"></app-empty-state>
          }
        </div>
      }
    </div>

    <app-modal [open]="deleteModalOpen" title="{{ translation.t('lost.delete_item') }}" confirmLabel="{{ translation.t('ui.delete') }}" (close)="deleteModalOpen = false" (confirm)="confirmDelete()">
      <p>{{ translation.t('ui.areYouSure') }}</p>
    </app-modal>

    <app-modal [open]="detailOpen" [title]="selectedItem?.title || 'Item details'" [showFooter]="false" (close)="detailOpen = false">
      @if (detailLoading) {
        <div class="tm-loader"></div>
      } @else if (selectedItem) {
        <div class="detail-block">
          <span class="badge" [class.found]="selectedItem.found">{{ selectedItem.found ? translation.t('ui.found') : translation.t('ui.lost') }}</span>
          @if (selectedItem.status) {
            <span class="status-badge" [class.closed]="selectedItem.status === 'closed'">{{ selectedItem.status }}</span>
          }
        </div>
        <h4 class="detail-label">{{ translation.t('lost.description') }}</h4>
        <p class="detail-text">{{ selectedItem.description || translation.t('lost.no_description') }}</p>
        <h4 class="detail-label">{{ translation.t('ui.location') }}</h4>
        <p class="detail-text">
          @if (selectedItem.location?.address) {
            {{ selectedItem.location.address }}
          } @else if (selectedItem.location?.lat != null) {
            {{ selectedItem.location.lat }}, {{ selectedItem.location.lng }}
          } @else {
            {{ translation.t('ui.not_specified') }}
          }
        </p>
        @if (detailErr) { <div class="error-box">{{ detailErr }}</div> }
        <div class="detail-actions">
          @if (!selectedItem.found) {
            <button class="tm-btn tm-btn-sm tm-btn-success" (click)="markFound()">
              <app-icon name="check" [size]="14"></app-icon> {{ translation.t('ui.mark_found') }}
            </button>
          }
          @if (selectedItem.status !== 'closed') {
            <button class="tm-btn tm-btn-sm tm-btn-outline" (click)="closeItem()">
              <app-icon name="x" [size]="14"></app-icon> {{ translation.t('ui.close') }}
            </button>
          } @else {
            <button class="tm-btn tm-btn-sm tm-btn-outline" (click)="reopenItem()">
              <app-icon name="refresh" [size]="14"></app-icon> {{ translation.t('ui.reopen') }}
            </button>
          }
          <button class="tm-btn tm-btn-sm tm-btn-danger" (click)="deleteFromDetail()">
            <app-icon name="trash" [size]="14"></app-icon> {{ translation.t('ui.delete') }}
          </button>
        </div>
      }
    </app-modal>
  `,
  styles: [`
    .page-header { margin-bottom: 1.5rem; }
    .lost-form {
      background: var(--tm-surface); border: 1px solid var(--glass-border); border-radius: 12px;
      padding: 1.25rem; max-width: 500px;
    }
    .lost-form h3 { margin: 0 0 1rem; font-size: 0.95rem; }
    .form-row { margin-bottom: 0.5rem; }
    .form-row label { display: block; font-size: 0.78rem; font-weight: 600; color: var(--tm-muted); margin-bottom: 0.35rem; text-transform: uppercase; letter-spacing: 0.04em; }
    .error-box { margin-top: 0.5rem; padding: 0.5rem; background: rgba(239,68,68,0.1); border: 1px solid rgba(239,68,68,0.2); border-radius: 8px; color: #a33a32; font-size: 0.85rem; }

    .item-list { display: flex; flex-direction: column; gap: 0.5rem; }
    .item-card {
      background: var(--tm-surface); border: 1px solid var(--glass-border); border-radius: 10px;
      padding: 1rem 1.25rem;
      display: flex; justify-content: space-between; align-items: center;
      gap: 1rem; transition: all 0.15s;
    }
    .item-card:hover { background: var(--tm-surface-raised); }
    .item-card.found { opacity: 0.6; }
    .item-info { flex: 1; min-width: 0; }
    .item-header { display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.3rem; }
    .item-header strong { font-size: 0.95rem; }
    .item-info p { margin: 0; font-size: 0.85rem; color: var(--tm-muted); }
    .badge { padding: 0.2rem 0.5rem; border-radius: 999px; font-size: 0.72rem; font-weight: 600; background: rgba(239,68,68,0.15); color: #a33a32; }
    .badge.found { background: rgba(34,197,94,0.15); color: #3f7a52; }
    .item-actions { display: flex; gap: 0.4rem; flex-shrink: 0; }
    .item-info { cursor: pointer; flex: 1; min-width: 0; }
    .view-link { display: inline-flex; align-items: center; gap: 0.25rem; font-size: 0.75rem; color: var(--tm-primary); margin-top: 0.3rem; font-weight: 600; }

    .detail-block { display: flex; gap: 0.5rem; align-items: center; margin-bottom: 1rem; }
    .status-badge { padding: 0.2rem 0.5rem; border-radius: 999px; font-size: 0.72rem; font-weight: 600; background: rgba(17,17,17,0.08); color: var(--tm-muted); text-transform: capitalize; }
    .status-badge.closed { background: rgba(239,68,68,0.12); color: #a33a32; }
    .detail-label { font-size: 0.78rem; text-transform: uppercase; letter-spacing: 0.04em; color: var(--tm-muted); margin: 0.75rem 0 0.3rem; }
    .detail-text { margin: 0; font-size: 0.9rem; color: var(--tm-text); line-height: 1.5; }
    .detail-actions { display: flex; gap: 0.5rem; flex-wrap: wrap; margin-top: 1.25rem; }
  `]
})
export class LostItemListComponent implements OnInit {
  private lostItemService = inject(LostItemService);
  translation = inject(TranslationService);
  private toast = inject(ToastService);
  items: any[] = [];
  newItem: any = {};
  loading = false;
  loadErr = '';
  submitting = false;
  reportErr = '';
  deleteModalOpen = false;
  pendingDeleteId: string | null = null;

  detailOpen = false;
  detailLoading = false;
  detailErr = '';
  selectedItem: any = null;

  ngOnInit() { this.load(); }

  openDetail(id: string) {
    this.detailOpen = true;
    this.detailLoading = true;
    this.detailErr = '';
    this.selectedItem = null;
    this.lostItemService.getById(id).subscribe({
      next: (res) => { this.selectedItem = res.data || res; this.detailLoading = false; },
      error: (e) => { this.detailLoading = false; this.detailErr = e.error?.message || 'Failed to load item'; },
    });
  }

  private refreshDetail() {
    if (!this.selectedItem?._id) return;
    this.lostItemService.getById(this.selectedItem._id).subscribe({
      next: (res) => { this.selectedItem = res.data || res; },
      error: () => {},
    });
  }

  markFound() {
    if (!this.selectedItem?._id) return;
    this.lostItemService.reportFound(this.selectedItem._id).subscribe({
      next: () => { this.toast.success('Marked as found'); this.refreshDetail(); this.load(); },
      error: () => this.toast.error('Failed to update'),
    });
  }

  closeItem() {
    if (!this.selectedItem?._id) return;
    this.lostItemService.close(this.selectedItem._id).subscribe({
      next: () => { this.toast.success('Item closed'); this.refreshDetail(); this.load(); },
      error: () => this.toast.error('Failed to close'),
    });
  }

  reopenItem() {
    if (!this.selectedItem?._id) return;
    this.lostItemService.reopen(this.selectedItem._id).subscribe({
      next: () => { this.toast.success('Item reopened'); this.refreshDetail(); this.load(); },
      error: () => this.toast.error('Failed to reopen'),
    });
  }

  deleteFromDetail() {
    if (!this.selectedItem?._id) return;
    this.pendingDeleteId = this.selectedItem._id;
    this.detailOpen = false;
    this.deleteModalOpen = true;
  }

  load() {
    this.loading = true; this.loadErr = '';
    this.lostItemService.getAll().subscribe({
      next: (res) => { this.items = res.data || []; this.loading = false; },
      error: (e) => { this.loading = false; this.loadErr = e.error?.message || 'Failed to load'; },
    });
  }

  report() {
    if (!this.newItem.title || this.submitting) return;
    this.submitting = true; this.reportErr = '';
    this.lostItemService.create(this.newItem).subscribe({
      next: () => { this.newItem = {}; this.submitting = false; this.load(); this.toast.success('Item reported'); },
      error: (e) => { this.submitting = false; this.reportErr = e.error?.message || 'Failed'; },
    });
  }

  reportFound(id: string) {
    this.lostItemService.reportFound(id).subscribe({
      next: () => { this.load(); this.toast.success('Marked as found'); },
      error: () => this.toast.error('Failed to update'),
    });
  }

  deleteItem(id: string) {
    this.pendingDeleteId = id;
    this.deleteModalOpen = true;
  }

  confirmDelete() {
    if (!this.pendingDeleteId) return;
    this.lostItemService.delete(this.pendingDeleteId).subscribe({
      next: () => { this.deleteModalOpen = false; this.pendingDeleteId = null; this.load(); this.toast.success('Item deleted'); },
      error: () => this.toast.error('Failed to delete'),
    });
  }

  scrollToForm() {
    const el = document.querySelector('.lost-form');
    if (el) (el as HTMLElement).scrollIntoView({ behavior: 'smooth' });
  }
}
