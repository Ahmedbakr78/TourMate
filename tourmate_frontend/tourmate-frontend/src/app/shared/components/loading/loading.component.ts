import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-loading',
  template: `
    <div class="loading-wrapper" *ngIf="show">
      <mat-spinner [diameter]="diameter"></mat-spinner>
    </div>
  `,
  styles: [`
    .loading-wrapper {
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 2rem;
    }
  `]
})
export class LoadingComponent {
  @Input() show = true;
  @Input() diameter = 40;
}
