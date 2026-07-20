import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="empty-state" [class.compact]="compact">
      @if (icon) { <div class="es-icon">{{ icon }}</div> }
      <p class="es-text">{{ message }}</p>
      @if (actionLabel && actionRoute) {
        <a class="es-action" [routerLink]="actionRoute">{{ actionLabel }}</a>
      } @else if (actionLabel && onAction) {
        <button class="es-action" (click)="onAction.emit()">{{ actionLabel }}</button>
      }
    </div>
  `,
  styles: [`
    .empty-state { text-align: center; padding: 3rem 1rem; color: var(--tm-muted); }
    .empty-state.compact { padding: 1.5rem 1rem; }
    .es-icon { font-size: 2rem; opacity: 0.5; margin-bottom: 0.5rem; }
    .es-text { margin: 0 0 0.75rem; font-size: 0.9rem; }
    .es-action {
      display: inline-block; padding: 0.5rem 1rem; border-radius: 999px;
      background: rgba(17,17,17,0.12); color: var(--tm-primary); border: 1px solid rgba(17,17,17,0.25);
      font-size: 0.8rem; font-weight: 600; text-decoration: none; cursor: pointer;
    }
    .es-action:hover { background: rgba(17,17,17,0.2); }
  `],
})
export class EmptyStateComponent {
  @Input() message = 'Nothing here yet';
  @Input() icon = '';
  @Input() actionLabel = '';
  @Input() actionRoute: string | null = null;
  @Input() compact = false;
  @Output() onAction = new EventEmitter<void>();
}
