import { Component, inject, OnInit } from '@angular/core';
import { AdminService } from '../../core/services/admin.service';
import { User } from '../../core/models/user.model';
import { ToastService } from '../../core/services/toast.service';
import { TranslationService } from '../../core/services/translation.service';

@Component({
  selector: 'app-user-management',
  standalone: true,
  template: `
    <div class="page">
      <div class="page-header">
        <div>
          <h2 style="margin:0">{{ translation.t('ui.users') }}</h2>
          <p class="muted" style="margin:0.2rem 0 0">{{ users.length }} registered users</p>
        </div>
      </div>

      @if (loading) {
        <div class="tm-loader"></div>
      } @else if (error) {
        <div class="error-box">{{ error }}</div>
      } @else {
        <div class="user-cards">
          @for (u of users; track u._id || u.id) {
            <div class="user-card">
              <div class="user-card-top">
                <div class="user-avatar">{{ (u.name || '?')[0] }}</div>
                <div class="user-meta">
                  <strong>{{ u.name }}</strong>
                  <span class="user-email">{{ u.email }}</span>
                </div>
                <span class="role-badge role-{{ (u.role || '').toLowerCase() }}">{{ u.role }}</span>
              </div>
              <div class="user-card-bottom">
                <span class="status-indicator" [class.blocked]="u.status !== 'ACTIVE'">
                  <span class="dot"></span>
                  {{ u.status === 'ACTIVE' ? 'Active' : 'Blocked' }}
                </span>
                @if (u.status === 'ACTIVE') {
                  <button class="tm-btn tm-btn-sm tm-btn-danger" (click)="block(u)">Block</button>
                } @else {
                  <button class="tm-btn tm-btn-sm" (click)="unblock(u)">Unblock</button>
                }
              </div>
            </div>
            } @empty {
              <div class="empty-state">{{ translation.t('ui.noData') }}</div>
            }
        </div>
      }
    </div>
  `,
  styles: [`
    .page-header { margin-bottom: 1.5rem; }
    .error-box { padding: 1rem; background: rgba(239,68,68,0.1); border: 1px solid rgba(239,68,68,0.2); border-radius: 10px; color: #a33a32; }

    .user-cards { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 0.75rem; }
    .user-card {
      background: var(--tm-surface); border: 1px solid var(--glass-border); border-radius: 10px;
      padding: 1rem;
    }
    .user-card-top { display: flex; align-items: center; gap: 0.75rem; margin-bottom: 0.75rem; }
    .user-avatar {
      width: 40px; height: 40px; border-radius: 50%;
      background: var(--tm-primary); color: #fff;
      display: flex; align-items: center; justify-content: center;
      font-weight: 700; font-size: 1rem;
      flex-shrink: 0;
    }
    .user-meta { flex: 1; min-width: 0; }
    .user-meta strong { display: block; font-size: 0.9rem; }
    .user-email { display: block; font-size: 0.8rem; color: var(--tm-muted); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .role-badge { font-size: 0.7rem; font-weight: 600; padding: 0.2rem 0.5rem; border-radius: 6px; background: rgba(17,17,17,0.12); color: var(--tm-ink); }
    .role-badge.role-driver { background: rgba(251,191,36,0.12); color: #9a7b3a; }
    .role-badge.role-guide { background: rgba(17,17,17,0.12); color: var(--tm-ink); }
    .role-badge.role-admin { background: rgba(239,68,68,0.12); color: #a33a32; }
    .user-card-bottom { display: flex; justify-content: space-between; align-items: center; }
    .status-indicator { display: flex; align-items: center; gap: 0.4rem; font-size: 0.82rem; color: #3f7a52; }
    .status-indicator.blocked { color: #a33a32; }
    .dot { width: 8px; height: 8px; border-radius: 50%; background: currentColor; }
    .empty-state { grid-column: 1 / -1; text-align: center; padding: 2rem; color: var(--tm-muted); }
  `],
})
export class UserManagementComponent implements OnInit {
  admin = inject(AdminService);
  translation = inject(TranslationService);
  toast = inject(ToastService);
  users: User[] = [];
  loading = false;
  error = '';

  ngOnInit() { this.load(); }

  load() {
    this.loading = true; this.error = '';
    this.admin.getUsers().subscribe({
      next: (res) => { this.users = res.data; this.loading = false; },
      error: (e) => { this.loading = false; this.error = e.error?.message || 'Failed to load'; this.toast.error(this.error); },
    });
  }

  block(u: User) {
    const id = u._id || u.id!;
    this.admin.blockUser(id).subscribe({
      next: () => { this.load(); this.toast.success(`${u.name} blocked`); },
      error: () => this.toast.error('Failed to block'),
    });
  }

  unblock(u: User) {
    const id = u._id || u.id!;
    this.admin.unblockUser(id).subscribe({
      next: () => { this.load(); this.toast.success(`${u.name} unblocked`); },
      error: () => this.toast.error('Failed to unblock'),
    });
  }
}
