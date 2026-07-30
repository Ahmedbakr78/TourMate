import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AdminService } from 'src/app/core/services/admin.service';
import { DriverService } from 'src/app/core/services/driver.service';
import { GuideService } from 'src/app/core/services/guide.service';
import { IDriver } from 'src/app/core/models/driver.model';
import { IGuide } from 'src/app/core/models/guide.model';
import { VerificationStatusEnum } from 'src/app/core/models/enums';

@Component({
  selector: 'app-admin-verifications',
  template: `
    <div class="page-header"><h1>Driver &amp; Guide Verifications</h1></div>

    <app-loading *ngIf="loading"></app-loading>

    <mat-tab-group *ngIf="!loading">
      <mat-tab label="Drivers">
        <div class="tab-content">
          <mat-card *ngFor="let d of pendingDrivers" class="row-card">
            <div>
              <h3>License: {{ d.licenseNumber }}</h3>
              <mat-chip selected>{{ d.verificationStatus }}</mat-chip>
            </div>
            <div class="actions">
              <button mat-raised-button color="primary" (click)="approveDriver(d)">Approve</button>
              <button mat-stroked-button color="warn" (click)="rejectDriver(d)">Reject</button>
            </div>
          </mat-card>
          <p *ngIf="pendingDrivers.length === 0" class="empty">No pending driver applications.</p>
        </div>
      </mat-tab>

      <mat-tab label="Guides">
        <div class="tab-content">
          <mat-card *ngFor="let g of pendingGuides" class="row-card">
            <div>
              <h3>{{ g.languages.join(', ') }}</h3>
              <p>{{ g.experience }} years experience</p>
              <mat-chip selected>{{ g.verificationStatus }}</mat-chip>
            </div>
            <div class="actions">
              <button mat-raised-button color="primary" (click)="approveGuide(g)">Approve</button>
              <button mat-stroked-button color="warn" (click)="rejectGuide(g)">Reject</button>
            </div>
          </mat-card>
          <p *ngIf="pendingGuides.length === 0" class="empty">No pending guide applications.</p>
        </div>
      </mat-tab>
    </mat-tab-group>
  `,
  styles: [`
    .page-header { padding: 1.5rem; }
    .tab-content { padding: 1rem 0.5rem; display: flex; flex-direction: column; gap: 0.75rem; }
    .row-card { display: flex; justify-content: space-between; align-items: center; padding: 1rem; }
    .actions { display: flex; gap: 0.5rem; }
    .empty { color: #888; padding: 1rem; }
  `]
})
export class AdminVerificationsComponent implements OnInit {

  pendingDrivers: IDriver[] = [];
  pendingGuides: IGuide[] = [];
  loading = false;

  constructor(
    private adminService: AdminService,
    private driverService: DriverService,
    private guideService: GuideService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.loading = true;
    this.driverService.getDrivers(1, 50).subscribe({
      next: res => {
        const all = (res.data as any)?.docs ?? (res.data as IDriver[]) ?? [];
        this.pendingDrivers = all.filter((d: IDriver) => d.verificationStatus === VerificationStatusEnum.PENDING);
      },
      error: () => { }
    });
    this.guideService.getGuides(1, 50).subscribe({
      next: res => {
        this.loading = false;
        const all = res.data?.docs ?? [];
        this.pendingGuides = all.filter(g => g.verificationStatus === VerificationStatusEnum.PENDING);
      },
      error: () => (this.loading = false)
    });
  }

  approveDriver(d: IDriver): void {
    this.adminService.updateDriverVerificationStatus(d._id, VerificationStatusEnum.APPROVED).subscribe({
      next: () => {
        this.snackBar.open('Driver approved', 'Close', { duration: 3000 });
        this.pendingDrivers = this.pendingDrivers.filter(x => x._id !== d._id);
      },
      error: err => this.snackBar.open(err?.error?.error?.message || 'Failed', 'Close', { duration: 4000 })
    });
  }

  rejectDriver(d: IDriver): void {
    this.adminService.updateDriverVerificationStatus(d._id, VerificationStatusEnum.REJECTED).subscribe({
      next: () => {
        this.snackBar.open('Driver rejected', 'Close', { duration: 3000 });
        this.pendingDrivers = this.pendingDrivers.filter(x => x._id !== d._id);
      },
      error: err => this.snackBar.open(err?.error?.error?.message || 'Failed', 'Close', { duration: 4000 })
    });
  }

  approveGuide(g: IGuide): void {
    this.adminService.updateGuideVerificationStatus(g._id, VerificationStatusEnum.APPROVED).subscribe({
      next: () => {
        this.snackBar.open('Guide approved', 'Close', { duration: 3000 });
        this.pendingGuides = this.pendingGuides.filter(x => x._id !== g._id);
      },
      error: err => this.snackBar.open(err?.error?.error?.message || 'Failed', 'Close', { duration: 4000 })
    });
  }

  rejectGuide(g: IGuide): void {
    this.adminService.updateGuideVerificationStatus(g._id, VerificationStatusEnum.REJECTED).subscribe({
      next: () => {
        this.snackBar.open('Guide rejected', 'Close', { duration: 3000 });
        this.pendingGuides = this.pendingGuides.filter(x => x._id !== g._id);
      },
      error: err => this.snackBar.open(err?.error?.error?.message || 'Failed', 'Close', { duration: 4000 })
    });
  }
}
