import { Component, inject } from '@angular/core';
import { RouterOutlet, RouterLink, Router } from '@angular/router';
import { AuthService } from '../core/services/auth.service';
import { User } from '../core/models/user.model';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink],
  template: `
    <div class="shell">
      <aside class="sidebar">
        <div class="brand">TourMate</div>
        <nav>
          @if (auth.user?.role === 'admin') {
            <a routerLink="/app/admin/dashboard" routerLinkActive="active">Dashboard</a>
            <a routerLink="/app/admin/users" routerLinkActive="active">Users</a>
            <a routerLink="/app/admin/trips" routerLinkActive="active">Trip Monitoring</a>
          }
        </nav>
        <div class="user">
          <span>{{ auth.user?.name }}</span>
          <button class="tm-btn tm-btn-danger" (click)="logout()">Logout</button>
        </div>
      </aside>
      <main class="content">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: [
    `
      .shell { display: flex; min-height: 100vh; }
      .sidebar {
        width: 220px; background: var(--tm-surface); box-shadow: var(--tm-shadow);
        display: flex; flex-direction: column; padding: 1rem;
      }
      .brand { font-weight: 800; font-size: 1.3rem; color: var(--tm-primary); margin-bottom: 1.5rem; }
      nav { display: flex; flex-direction: column; gap: 0.4rem; flex: 1; }
      nav a { padding: 0.6rem 0.8rem; border-radius: 8px; color: var(--tm-text); }
      nav a.active, nav a:hover { background: var(--tm-primary); color: #fff; }
      .user { display: flex; flex-direction: column; gap: 0.5rem; }
      .content { flex: 1; padding: 1.5rem; }
    `,
  ],
})
export class LayoutComponent {
  auth = inject(AuthService);
  private router = inject(Router);

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
