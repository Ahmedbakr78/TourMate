import { Component, inject, OnInit } from '@angular/core';
import { AdminService } from '../../core/services/admin.service';
import { User } from '../../core/models/user.model';

@Component({
  selector: 'app-user-management',
  standalone: true,
  template: `
    <h2>User Management</h2>
    <div class="tm-grid">
      @for (u of users; track u._id || u.id) {
        <div class="tm-card user">
          <div class="row"><strong>{{ u.name }}</strong><span class="role">{{ u.role }}</span></div>
          <div class="email">{{ u.email }}</div>
          <div class="status" [class.blocked]="!u.isActive">
            {{ u.isActive ? 'Active' : 'Blocked' }}
          </div>
          @if (u.isActive) {
            <button class="tm-btn tm-btn-danger" (click)="block(u)">Block</button>
          } @else {
            <button class="tm-btn" (click)="unblock(u)">Unblock</button>
          }
        </div>
      } @empty {
        <p>Loading users…</p>
      }
    </div>
  `,
  styles: [
    `
      .user { display: flex; flex-direction: column; gap: 0.4rem; }
      .row { display: flex; justify-content: space-between; align-items: center; }
      .role { background: var(--tm-primary); color: #fff; padding: 0.1rem 0.5rem; border-radius: 6px; font-size: 0.75rem; }
      .email { color: var(--tm-muted); font-size: 0.85rem; }
      .status { font-weight: 600; }
      .status.blocked { color: var(--tm-danger); }
    `,
  ],
})
export class UserManagementComponent implements OnInit {
  admin = inject(AdminService);
  users: User[] = [];

  ngOnInit() {
    this.load();
  }

  load() {
    this.admin.getUsers().subscribe((res) => (this.users = res.data));
  }

  block(u: User) {
    const id = u._id || u.id!;
    this.admin.blockUser(id).subscribe(() => this.load());
  }

  unblock(u: User) {
    const id = u._id || u.id!;
    this.admin.unblockUser(id).subscribe(() => this.load());
  }
}
