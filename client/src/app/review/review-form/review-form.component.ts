import { Component, Input, OnInit, inject, SimpleChanges, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ReviewService } from '../../core/services/review.service';
import { ToastService } from '../../core/services/toast.service';
import { IconComponent } from '../../shared/icon.component';
import { TranslationService } from '../../core/services/translation.service';

@Component({
  selector: 'app-review-form',
  standalone: true,
  imports: [CommonModule, FormsModule, IconComponent],
  template: `
    <div class="review-form">
      <h4>{{ editId ? translation.t('review.edit') : translation.t('review.leave') }}</h4>
      <div class="form-row">
        <label>{{ translation.t('ui.rating') }}</label>
        <div class="star-select">
          @for (s of [1,2,3,4,5]; track s) {
            <button type="button" class="star-btn" [class.active]="s <= rating" (click)="rating = s" [attr.aria-label]="'Rate ' + s">
              <app-icon name="star" [size]="20" [color]="s <= rating ? '#9a7b3a' : 'currentColor'"></app-icon>
            </button>
          }
        </div>
      </div>
      <div class="form-row">
        <label>{{ translation.t('ui.comment') }}</label>
        <textarea [(ngModel)]="comment" class="tm-input" rows="3" placeholder="{{ translation.t('review.share_exp') }}"></textarea>
      </div>
      @if (error) { <div class="error-msg">{{ error }}</div> }
      <button class="tm-btn tm-btn-primary" (click)="submit()" [disabled]="submitting">
        @if (submitting) { {{ translation.t('ui.submitting') }} } @else { {{ editId ? translation.t('review.update') : translation.t('review.submit') }} }
      </button>
    </div>
  `,
  styles: [`
    .review-form { display: flex; flex-direction: column; gap: 0.75rem; padding: 1.25rem; background: var(--tm-surface); border: 1px solid var(--glass-border); border-radius: 12px; }
    .review-form h4 { margin: 0; font-size: 0.95rem; }
    .form-row label { display: block; font-size: 0.78rem; font-weight: 600; color: var(--tm-muted); margin-bottom: 0.35rem; text-transform: uppercase; letter-spacing: 0.04em; }
    .star-select { display: flex; gap: 0.25rem; }
    .star-btn { background: none; border: none; cursor: pointer; padding: 2px; color: var(--tm-muted); transition: color 0.15s; }
    .star-btn.active { color: #9a7b3a; }
    .star-btn:hover { color: #9a7b3a; }
    .error-msg { padding: 0.5rem; background: rgba(239,68,68,0.1); border: 1px solid rgba(239,68,68,0.2); border-radius: 8px; color: #a33a32; font-size: 0.85rem; }
  `]
})
export class ReviewFormComponent implements OnInit, OnChanges {
  private reviewService = inject(ReviewService);
  translation = inject(TranslationService);
  private toast = inject(ToastService);
  private route = inject(ActivatedRoute);
  @Input() tripId!: string;
  @Input() review?: any;
  @Input() reviewId?: string;

  rating = 5;
  comment = '';
  submitting = false;
  error = '';
  editId: string | null = null;

  ngOnInit() {
    this.initFromInput();
    if (!this.editId && !this.review && this.reviewId) {
      this.reviewService.getById(this.reviewId).subscribe({
        next: (res: any) => { this.setEdit(res.data || res); },
        error: () => {},
      });
    }
  }

  ngOnChanges(_: SimpleChanges) {
    if (this.review) this.setEdit(this.review);
  }

  private initFromInput() {
    if (this.review) this.setEdit(this.review);
  }

  private setEdit(r: any) {
    if (!r) return;
    this.editId = r._id || null;
    this.rating = r.rating ?? 5;
    this.comment = r.comment || '';
  }

  submit() {
    if (this.submitting) return;
    this.submitting = true; this.error = '';
    const payload = { rating: this.rating, comment: this.comment };
    if (this.editId) {
      this.reviewService.update(this.editId, payload).subscribe({
        next: () => { this.toast.success('Review updated!'); this.submitting = false; },
        error: (e) => { this.submitting = false; this.error = e.error?.message || 'Failed to update review'; this.toast.error(this.error); },
      });
    } else {
      this.reviewService.create({ tripId: this.tripId, ...payload }).subscribe({
        next: () => { this.toast.success('Review submitted!'); this.comment = ''; this.rating = 5; this.submitting = false; },
        error: (e) => { this.submitting = false; this.error = e.error?.message || 'Failed to submit review'; this.toast.error(this.error); },
      });
    }
  }
}
