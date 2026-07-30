import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { AdminService } from 'src/app/core/services/admin.service';
import { UserService } from 'src/app/core/services/user.service';
import { IUser } from 'src/app/core/models/user.model';
import { RoleEnum, StatusUserEnum } from 'src/app/core/models/enums';
import { ConfirmDialogComponent } from 'src/app/shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-admin-users',
  template: `
    <div class="page-header"><h1>Manage Users</h1></div>

    <app-loading *ngIf="loading"></app-loading>

    <table mat-table [dataSource]="users" *ngIf="!loading" class="mat-elevation-z1 full-width-table">
      <ng-container matColumnDef="name">
        <th mat-header-cell *matHeaderCellDef>Name</th>
        <td mat-cell *matCellDef="let u">{{ u.name }}</td>
      </ng-container>
      <ng-container matColumnDef="email">
        <th mat-header-cell *matHeaderCellDef>Email</th>
        <td mat-cell *matCellDef="let u">{{ u.email }}</td>
      </ng-container>
      <ng-container matColumnDef="role">
        <th mat-header-cell *matHeaderCellDef>Role</th>
        <td mat-cell *matCellDef="let u">
          <mat-select [value]="u.role" (selectionChange)="changeRole(u, $event.value)">
            <mat-option *ngFor="let r of roles" [value]="r">{{ r }}</mat-option>
          </mat-select>
        </td>
      </ng-container>
      <ng-container matColumnDef="status">
        <th mat-header-cell *matHeaderCellDef>Status</th>
        <td mat-cell *matCellDef="let u">
          <mat-select [value]="u.status" (selectionChange)="changeStatus(u, $event.value)">
            <mat-option *ngFor="let s of statuses" [value]="s">{{ s }}</mat-option>
          </mat-select>
        </td>
      </ng-container>
      <ng-container matColumnDef="actions">
        <th mat-header-cell *matHeaderCellDef></th>
        <td mat-cell *matCellDef="let u">
          <button mat-icon-button color="warn" (click)="deleteUser(u)"><mat-icon>delete</mat-icon></button>
        </td>
      </ng-container>

      <tr mat-header-row *matHeaderRowDef="columns"></tr>
      <tr mat-row *matRowDef="let row; columns: columns;"></tr>
    </table>

    <mat-paginator
      *ngIf="!loading"
      [length]="totalDocs"
      [pageSize]="limit"
      [pageSizeOptions]="[10, 20, 50]"
      (page)="onPageChange($event)">
    </mat-paginator>
  `,
  styles: [`
    .page-header { padding: 1.5rem; }
    .full-width-table { width: 100%; }
    td, th { padding: 0.5rem 1rem; }
  `]
})
export class AdminUsersComponent implements OnInit {

  users: IUser[] = [];
  loading = false;
  page = 1;
  limit = 10;
  totalDocs = 0;
  columns = ['name', 'email', 'role', 'status', 'actions'];
  roles = Object.values(RoleEnum);
  statuses = Object.values(StatusUserEnum);

  constructor(
    private userService: UserService,
    private adminService: AdminService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.loading = true;
    this.userService.getUsers(this.page, this.limit).subscribe({
      next: res => {
        this.loading = false;
        this.users = res.data?.docs ?? [];
        this.totalDocs = res.data?.totalDocs ?? 0;
      },
      error: err => {
        this.loading = false;
        this.snackBar.open(err?.error?.error?.message || 'Failed to load users', 'Close', { duration: 4000 });
      }
    });
  }

  onPageChange(event: { pageIndex: number; pageSize: number }): void {
    this.page = event.pageIndex + 1;
    this.limit = event.pageSize;
    this.loadUsers();
  }

  changeRole(user: IUser, role: RoleEnum): void {
    this.adminService.changeUserRole(user._id, role).subscribe({
      next: () => this.snackBar.open(`Role updated to ${role}`, 'Close', { duration: 3000 }),
      error: err => this.snackBar.open(err?.error?.error?.message || 'Failed to update role', 'Close', { duration: 4000 })
    });
  }

  changeStatus(user: IUser, status: StatusUserEnum): void {
    this.adminService.changeUserStatus(user._id, status).subscribe({
      next: () => this.snackBar.open(`Status updated to ${status}`, 'Close', { duration: 3000 }),
      error: err => this.snackBar.open(err?.error?.error?.message || 'Failed to update status', 'Close', { duration: 4000 })
    });
  }

  deleteUser(user: IUser): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: { title: 'Delete user', message: `Delete ${user.name}? This cannot be undone.` }
    });
    dialogRef.afterClosed().subscribe(confirmed => {
      if (!confirmed) return;
      this.adminService.deleteUser(user._id).subscribe({
        next: () => {
          this.snackBar.open('User deleted', 'Close', { duration: 3000 });
          this.loadUsers();
        },
        error: err => this.snackBar.open(err?.error?.error?.message || 'Delete failed', 'Close', { duration: 4000 })
      });
    });
  }
}
