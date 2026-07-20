import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-stat-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="stat-box">
      <span class="stat-num">{{ value }}</span>
      <span class="stat-label">{{ label }}</span>
    </div>
  `,
  styles: [`
    .stat-box {
      flex: 1; background: var(--tm-surface); border: 1px solid var(--glass-border); border-radius: 12px;
      padding: 1.25rem; text-align: center;
    }
    .stat-num { display: block; font-size: 1.8rem; font-weight: 800; color: var(--tm-primary); }
    .stat-label { display: block; font-size: 0.78rem; text-transform: uppercase; letter-spacing: 0.04em; color: var(--tm-muted); margin-top: 0.15rem; }
  `],
})
export class StatCardComponent {
  @Input() value = 0;
  @Input() label = '';
}
