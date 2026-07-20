import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../core/services/notification.service';
import { TranslationService } from '../../core/services/translation.service';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-notification-center',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page">
      <div class="page-header">
        <div>
          <h2 style="margin:0">{{ translation.t('ui.notifications') }}</h2>
          <p class="muted" style="margin:0.2rem 0 0">Stay updated</p>
        </div>
        @if (unreadCount > 0) {
          <button class="tm-btn tm-btn-sm tm-btn-outline" (click)="markAllRead()">{{ translation.t('ui.markAllRead') }}</button>
        }
      </div>

      @if (loading) {
        <div class="tm-loader"></div>
      } @else if (error) {
        <div class="error-box">{{ error }}</div>
      } @else if (notifications.length === 0) {
        <div class="empty-state">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
          <h3>{{ translation.t('ui.no_notifications') }}</h3>
          <p>{{ translation.t('notification.caught_up') }}</p>
        </div>
      } @else {
        <div class="notif-list">
          @for (n of notifications; track n._id) {
            <div class="notif-item" [class.unread]="!n.isRead" (click)="markRead(n)">
              <div class="notif-dot"></div>
              <div class="notif-content">
                <div class="notif-title">{{ n.title }}</div>
                <div class="notif-msg">{{ n.message }}</div>
                <div class="notif-time">{{ n.createdAt | date:'MMM d, h:mm a' }}</div>
              </div>
            </div>
          }
        </div>
      }
    </div>
  `,
  styles: [`
    .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
    .error-box { padding: 1rem; background: rgba(239,68,68,0.1); border: 1px solid rgba(239,68,68,0.2); border-radius: 10px; color: #a33a32; }
    .empty-state { text-align: center; padding: 3rem; color: var(--tm-muted); }
    .empty-state svg { margin-bottom: 1rem; opacity: 0.5; }
    .empty-state h3 { margin: 0 0 0.3rem; font-size: 1.1rem; color: var(--tm-text); }

    .notif-list { max-width: 600px; display: flex; flex-direction: column; gap: 0.5rem; }
    .notif-item {
      display: flex; gap: 0.75rem; align-items: flex-start;
      background: var(--tm-surface); border: 1px solid var(--glass-border); border-radius: 10px;
      padding: 1rem; cursor: pointer; transition: all 0.15s;
    }
    .notif-item:hover { background: var(--tm-surface-raised); }
    .notif-item.unread { border-left: 3px solid var(--tm-primary); }
    .notif-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--tm-primary); margin-top: 6px; flex-shrink: 0; display: none; }
    .notif-item.unread .notif-dot { display: block; }
    .notif-content { flex: 1; min-width: 0; }
    .notif-title { font-weight: 600; font-size: 0.9rem; margin-bottom: 0.15rem; }
    .notif-msg { font-size: 0.82rem; color: var(--tm-muted); margin-bottom: 0.25rem; line-height: 1.4; }
    .notif-time { font-size: 0.75rem; color: var(--tm-muted); opacity: 0.7; }
  `]
})
export class NotificationCenterComponent implements OnInit {
  private notifService = inject(NotificationService);
  translation = inject(TranslationService);
  private toast = inject(ToastService);
  notifications: any[] = [];
  unreadCount = 0;
  loading = true;
  error = '';

  ngOnInit() { this.load(); }

  load() {
    this.loading = true;
    this.error = '';
    this.notifService.getAll().subscribe({
      next: (res) => {
        this.notifications = res.data || [];
        this.unreadCount = res.unreadCount || 0;
        this.loading = false;
      },
      error: (e) => {
        this.loading = false;
        this.error = e.error?.message || 'Failed to load notifications';
        this.toast.error(this.error);
      },
    });
  }

  markRead(n: any) {
    if (!n.isRead) this.notifService.markAsRead(n._id).subscribe({ next: () => this.load(), error: (e) => this.toast.error(e.error?.message || 'Failed to mark as read') });
  }

  markAllRead() { this.notifService.markAllAsRead().subscribe({ next: () => this.load(), error: (e) => this.toast.error(e.error?.message || 'Failed to mark all as read') }); }
}
