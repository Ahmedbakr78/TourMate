import { Component, inject } from '@angular/core';
import { ToastService } from '../services/toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  template: `
    <div class="toast-wrap">
      @for (t of toast.toasts; track t.id) {
        <div class="toast toast-{{ t.type }}" (click)="toast.remove(t.id)">
          {{ t.message }}
        </div>
      }
    </div>
  `,
  styles: [`
    .toast-wrap {
      position: fixed; top: 16px; right: 16px; z-index: 10000;
      display: flex; flex-direction: column; gap: 8px;
    }
    .toast {
      padding: 12px 20px; border-radius: 8px; cursor: pointer;
      font-size: 0.9rem; box-shadow: 0 4px 16px rgba(0,0,0,.15);
      animation: slideIn .25s ease-out; max-width: 360px;
    }
    .toast-success { background: var(--tm-ink); color: #fff; border-left: 3px solid #3f7a52; }
    .toast-error   { background: var(--tm-ink); color: #fff; border-left: 3px solid #a33a32; }
    .toast-info    { background: var(--tm-ink); color: #fff; border-left: 3px solid #9a7b3a; }
    @keyframes slideIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
  `],
})
export class ToastContainerComponent {
  toast = inject(ToastService);
}
