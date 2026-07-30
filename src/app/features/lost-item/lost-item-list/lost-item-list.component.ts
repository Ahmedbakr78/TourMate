import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LostItemService } from '../../../core/services/lost-item.service';
import { ILostItem } from '../../../core/models/lost-item.model';

@Component({
  selector: 'app-lost-item-list',
  template: `
    <div class="page-header">
      <h1>My Lost &amp; Found reports</h1>
    </div>
    <p class="hint">
      To report a new lost item, open the relevant trip and use the "Lost &amp; Found" tab.
    </p>

    <app-loading *ngIf="loading"></app-loading>

    <div class="list" *ngIf="!loading">
      <mat-card *ngFor="let item of items" class="item-card">
        <h3>{{ item.title }}</h3>
        <p>{{ item.description }}</p>
        <mat-chip selected [color]="item.status === 'found' ? 'primary' : (item.status === 'closed' ? '' : 'warn')">
          {{ item.status }}
        </mat-chip>
      </mat-card>
      <p *ngIf="items.length === 0" class="empty">No lost item reports yet.</p>
    </div>
  `,
  styles: [`
    .page-header { padding: 1.5rem 1.5rem 0; }
    .hint { padding: 0 1.5rem; color: #666; font-size: 0.9rem; }
    .list { display: flex; flex-direction: column; gap: 0.75rem; padding: 1rem 1.5rem; }
    .empty { color: #888; }
  `]
})
export class LostItemListComponent implements OnInit {

  items: ILostItem[] = [];
  loading = false;

  constructor(private lostItemService: LostItemService, private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.loading = true;
    this.lostItemService.getMyLostItems().subscribe({
      next: res => {
        this.loading = false;
        this.items = res.data ?? [];
      },
      error: err => {
        this.loading = false;
        this.snackBar.open(err?.error?.error?.message || 'Failed to load lost items', 'Close', { duration: 4000 });
      }
    });
  }
}
