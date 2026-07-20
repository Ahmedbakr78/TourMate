import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (open) {
      <div class="modal-overlay" (click)="close.emit()">
        <div class="modal-box" (click)="$event.stopPropagation()">
          <div class="modal-head">
            <h3 class="modal-title">{{ title }}</h3>
            <button class="modal-x" (click)="close.emit()" aria-label="Close">&times;</button>
          </div>
          <div class="modal-body">
            <ng-content></ng-content>
          </div>
          @if (showFooter) {
            <div class="modal-foot">
              <button class="tm-btn tm-btn-ghost" (click)="close.emit()">{{ cancelLabel }}</button>
              <button class="tm-btn tm-btn-primary" (click)="confirm.emit()">{{ confirmLabel }}</button>
            </div>
          }
        </div>
      </div>
    }
  `,
  styles: [`
    .modal-overlay {
      position: fixed; inset: 0; background: rgba(0,0,0,0.55); backdrop-filter: blur(3px);
      display: flex; align-items: center; justify-content: center; z-index: 1000; padding: 1rem;
    }
    .modal-box {
      background: var(--tm-surface-raised); border: 1px solid var(--glass-border); border-radius: 14px;
      width: 100%; max-width: 480px; box-shadow: 0 24px 64px rgba(0,0,0,0.5); overflow: hidden;
    }
    .modal-head { display: flex; justify-content: space-between; align-items: center; padding: 1rem 1.25rem; border-bottom: 1px solid var(--glass-border); }
    .modal-title { margin: 0; font-size: 1rem; font-weight: 700; color: var(--tm-text); }
    .modal-x { background: none; border: none; color: var(--tm-muted); font-size: 1.4rem; cursor: pointer; line-height: 1; padding: 0 0.25rem; }
    .modal-x:hover { color: var(--tm-text); }
    .modal-body { padding: 1.25rem; color: var(--tm-text); }
    .modal-foot { display: flex; justify-content: flex-end; gap: 0.5rem; padding: 0.85rem 1.25rem; border-top: 1px solid var(--glass-border); }
  `],
})
export class ModalComponent {
  @Input() title = '';
  @Input() confirmLabel = 'Confirm';
  @Input() cancelLabel = 'Cancel';
  @Input() showFooter = false;
  @Input() open = false;
  @Output() close = new EventEmitter<void>();
  @Output() confirm = new EventEmitter<void>();
}
