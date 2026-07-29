import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { UserService } from 'src/app/core/services/user.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { DriverService } from 'src/app/core/services/driver.service';
import { GuideService } from 'src/app/core/services/guide.service';
import { IUser } from 'src/app/core/models/user.model';
import { IDriver } from 'src/app/core/models/driver.model';
import { IGuide } from 'src/app/core/models/guide.model';
import { GenderEnum, RoleEnum } from 'src/app/core/models/enums';
import { ConfirmDialogComponent } from 'src/app/shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  user: IUser | null = null;
  loading = false;
  saving = false;
  uploadingImage = false;
  changingPassword = false;

  genderEnum = GenderEnum;
  roleEnum = RoleEnum;

  // Driver self-service
  myDriver: IDriver | null = null;
  loadingDriver = false;
  updatingDriverAvailability = false;

  // Guide self-service
  myGuide: IGuide | null = null;
  loadingGuide = false;
  updatingGuideAvailability = false;
  uploadingCertificate = false;
  newCertificate?: File;

  profileForm = this.fb.group({
    name: ['', Validators.required],
    phone: ['', Validators.required],
    gender: [GenderEnum.MALE]
  });

  passwordForm = this.fb.group({
    oldPassword: ['', Validators.required],
    newPassword: ['', [Validators.required, Validators.minLength(6)]]
  });

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private authService: AuthService,
    private driverService: DriverService,
    private guideService: GuideService,
    private router: Router,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.loading = true;
    this.userService.getCurrentUserId().subscribe({
      next: res => {
        this.loading = false;
        this.user = res.data ?? null;
        if (this.user) {
          this.profileForm.patchValue({
            name: this.user.name,
            phone: this.user.phone,
            gender: this.user.gender
          });
          this.loadRoleProfile();
        }
      },
      error: err => {
        this.loading = false;
        this.snackBar.open(err?.error?.error?.message || 'Failed to load profile', 'Close', { duration: 4000 });
      }
    });
  }

  private loadRoleProfile(): void {
    if (!this.user) return;

    if (this.user.role === RoleEnum.DRIVER) {
      this.loadingDriver = true;
      this.driverService.findMyDriverProfile(this.user._id).subscribe({
        next: driver => {
          this.loadingDriver = false;
          this.myDriver = driver ?? null;
        },
        error: () => (this.loadingDriver = false)
      });
    }

    if (this.user.role === RoleEnum.GUIDE) {
      this.loadingGuide = true;
      this.guideService.findMyGuideProfile(this.user._id).subscribe({
        next: guide => {
          this.loadingGuide = false;
          this.myGuide = guide ?? null;
        },
        error: () => (this.loadingGuide = false)
      });
    }
  }

  toggleDriverAvailability(availability: boolean): void {
    if (!this.myDriver) return;
    this.updatingDriverAvailability = true;
    this.driverService.updateDriver(this.myDriver._id, { availability }).subscribe({
      next: res => {
        this.updatingDriverAvailability = false;
        if (this.myDriver) this.myDriver.availability = res.data?.availability ?? availability;
        this.snackBar.open(`You're now ${availability ? 'available' : 'unavailable'} for trips`, 'Close', { duration: 3000 });
      },
      error: err => {
        this.updatingDriverAvailability = false;
        this.snackBar.open(err?.error?.error?.message || 'Update failed', 'Close', { duration: 4000 });
      }
    });
  }

  toggleGuideAvailability(availability: boolean): void {
    if (!this.myGuide) return;
    this.updatingGuideAvailability = true;
    this.guideService.updateGuide(this.myGuide._id, { availability }).subscribe({
      next: res => {
        this.updatingGuideAvailability = false;
        if (this.myGuide) this.myGuide.availability = res.data?.availability ?? availability;
        this.snackBar.open(`You're now ${availability ? 'available' : 'unavailable'} for trips`, 'Close', { duration: 3000 });
      },
      error: err => {
        this.updatingGuideAvailability = false;
        this.snackBar.open(err?.error?.error?.message || 'Update failed', 'Close', { duration: 4000 });
      }
    });
  }

  onCertificateSelected(event: Event): void {
    this.newCertificate = (event.target as HTMLInputElement).files?.[0];
  }

  uploadNewCertificate(): void {
    if (!this.myGuide || !this.newCertificate) return;
    this.uploadingCertificate = true;
    this.guideService.updateGuide(this.myGuide._id, {}, this.newCertificate).subscribe({
      next: res => {
        this.uploadingCertificate = false;
        this.newCertificate = undefined;
        if (this.myGuide && res.data?.certificate) this.myGuide.certificate = res.data.certificate;
        this.snackBar.open('Certificate updated', 'Close', { duration: 3000 });
      },
      error: err => {
        this.uploadingCertificate = false;
        this.snackBar.open(err?.error?.error?.message || 'Upload failed', 'Close', { duration: 4000 });
      }
    });
  }

  saveProfile(): void {
    if (this.profileForm.invalid) return;
    this.saving = true;
    this.userService.updateUser(this.profileForm.getRawValue() as any).subscribe({
      next: res => {
        this.saving = false;
        this.user = res.data ?? this.user;
        this.snackBar.open('Profile updated', 'Close', { duration: 3000 });
      },
      error: err => {
        this.saving = false;
        this.snackBar.open(err?.error?.error?.message || 'Update failed', 'Close', { duration: 4000 });
      }
    });
  }

  onImageSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;

    this.uploadingImage = true;
    this.userService.uploadProfileImage(file).subscribe({
      next: res => {
        this.uploadingImage = false;
        this.user = res.data ?? this.user;
        this.snackBar.open('Profile picture updated', 'Close', { duration: 3000 });
      },
      error: err => {
        this.uploadingImage = false;
        this.snackBar.open(err?.error?.error?.message || 'Upload failed', 'Close', { duration: 4000 });
      }
    });
  }

  deleteImage(): void {
    this.userService.deleteProfileImage().subscribe({
      next: () => {
        if (this.user) this.user.profileImage = undefined;
        this.snackBar.open('Profile picture removed', 'Close', { duration: 3000 });
      },
      error: err => this.snackBar.open(err?.error?.error?.message || 'Failed to remove picture', 'Close', { duration: 4000 })
    });
  }

  changePassword(): void {
    if (this.passwordForm.invalid) return;
    this.changingPassword = true;
    this.authService.changePassword(this.passwordForm.getRawValue() as any).subscribe({
      next: () => {
        this.changingPassword = false;
        this.passwordForm.reset();
        this.snackBar.open('Password changed', 'Close', { duration: 3000 });
      },
      error: err => {
        this.changingPassword = false;
        this.snackBar.open(err?.error?.error?.message || 'Password change failed', 'Close', { duration: 4000 });
      }
    });
  }

  deleteAccount(): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: { title: 'Delete account', message: 'This will permanently delete your account. Continue?' }
    });
    dialogRef.afterClosed().subscribe(confirmed => {
      if (!confirmed) return;
      this.userService.deleteAccount().subscribe({
        next: () => {
          this.authService.clearSession();
          this.snackBar.open('Account deleted', 'Close', { duration: 3000 });
          this.router.navigate(['/auth/login']);
        },
        error: err => this.snackBar.open(err?.error?.error?.message || 'Deletion failed', 'Close', { duration: 4000 })
      });
    });
  }
}
