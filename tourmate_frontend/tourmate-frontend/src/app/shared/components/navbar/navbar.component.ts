import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/core/services/auth.service';
import { NotificationService } from 'src/app/core/services/notification.service';
import { SocketService } from 'src/app/core/services/socket.service';
import { RoleEnum } from 'src/app/core/models/enums';
import { IUser } from 'src/app/core/models/user.model';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit, OnDestroy {

  currentUser: IUser | null = null;
  unreadCount = 0;
  roleEnum = RoleEnum;

  private socketSub?: Subscription;

  constructor(
    private authService: AuthService,
    private notificationService: NotificationService,
    private socketService: SocketService,
    private snackBar: MatSnackBar,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => (this.currentUser = user));

    if (this.authService.isLoggedIn()) {
      this.refreshUnreadCount();
    }

    this.socketSub = this.socketService.newNotification$.subscribe(notification => {
      this.unreadCount++;
      this.snackBar.open(notification?.title || 'New notification', 'View', { duration: 5000 })
        .onAction().subscribe(() => this.router.navigate(['/notifications']));
    });
  }

  ngOnDestroy(): void {
    this.socketSub?.unsubscribe();
  }

  refreshUnreadCount(): void {
    this.notificationService.getNotifications(1, 1).subscribe({
      next: res => (this.unreadCount = res.data?.unreadCount ?? 0),
      error: () => { /* silently ignore - navbar shouldn't break the app */ }
    });
  }

  logout(): void {
    this.authService.logOut().subscribe({
      next: () => this.router.navigate(['/auth/login']),
      error: () => {
        // even if the API call fails (e.g. token already expired), clear locally
        this.authService.clearSession();
        this.router.navigate(['/auth/login']);
      }
    });
  }
}
