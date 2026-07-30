import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NotificationService } from '../../core/services/notification.service';
import { INotification } from '../../core/models/notification.model';

@Component({
  selector: 'app-notifications',
  template: `
    <div class="page-header">
      <h1>Notifications</h1>
      <button mat-stroked-button (click)="markAllRead()" [disabled]="notifications.length === 0">Mark all as read</button>
    </div>

    <app-loading *ngIf="loading"></app-loading>

    <div class="list" *ngIf="!loading">
      <mat-card *ngFor="let n of notifications" class="notif-card" [class.unread]="!n.isRead">
        <div class="row">
          <div>
            <h3>{{ n.title }}</h3>
            <p>{{ n.message }}</p>
            <span class="date">{{ n.createdAt | date:'short' }}</span>
          </div>
          <div class="actions">
            <button mat-icon-button (click)="markRead(n)" *ngIf="!n.isRead" matTooltip="Mark as read">
              <mat-icon>mark_email_read</mat-icon>
            </button>
            <button mat-icon-button (click)="remove(n)" matTooltip="Delete">
              <mat-icon>delete</mat-icon>
            </button>
          </div>
        </div>
      </mat-card>
      <p *ngIf="notifications.length === 0" class="empty">No notifications yet.</p>
    </div>
  `,
  styles: [`
    .page-header { display: flex; justify-content: space-between; align-items: center; padding: 1.5rem; }
    .list { display: flex; flex-direction: column; gap: 0.5rem; padding: 0 1.5rem 1.5rem; }
    .notif-card.unread { border-left: 4px solid #3f51b5; }
    .row { display: flex; justify-content: space-between; align-items: flex-start; }
    .date { color: #999; font-size: 0.75rem; }
    .empty { color: #888; text-align: center; padding: 2rem; }
  `]
})
export class NotificationsComponent implements OnInit {

  notifications: INotification[] = [];
  loading = false;

  constructor(private notificationService: NotificationService, private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.loadNotifications();
  }

  loadNotifications(): void {
    this.loading = true;
    this.notificationService.getNotifications(1, 20).subscribe({
      next: res => {
        this.loading = false;
        this.notifications = res.data?.notifications ?? [];
      },
      error: err => {
        this.loading = false;
        this.snackBar.open(err?.error?.error?.message || 'Failed to load notifications', 'Close', { duration: 4000 });
      }
    });
  }

  markRead(n: INotification): void {
    this.notificationService.markAsRead(n._id).subscribe({
      next: () => (n.isRead = true),
      error: err => this.snackBar.open(err?.error?.error?.message || 'Failed', 'Close', { duration: 3000 })
    });
  }

  markAllRead(): void {
    this.notificationService.markAllAsRead().subscribe({
      next: () => {
        this.notifications.forEach(n => (n.isRead = true));
        this.snackBar.open('All marked as read', 'Close', { duration: 2500 });
      },
      error: err => this.snackBar.open(err?.error?.error?.message || 'Failed', 'Close', { duration: 3000 })
    });
  }

  remove(n: INotification): void {
    this.notificationService.deleteNotification(n._id).subscribe({
      next: () => (this.notifications = this.notifications.filter(x => x._id !== n._id)),
      error: err => this.snackBar.open(err?.error?.error?.message || 'Failed', 'Close', { duration: 3000 })
    });
  }
}
