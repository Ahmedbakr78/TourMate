import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { DriverService } from '../../core/services/driver.service';
import { VehicleService } from '../../core/services/vehicle.service';
import { ToastService } from '../../core/services/toast.service';
import { ModalComponent } from '../../shared/modal.component';
import { IconComponent } from '../../shared/icon.component';
import { TranslationService } from '../../core/services/translation.service';

interface Vehicle {
  _id?: string;
  type?: string;
  model?: string;
  plateNumber?: string;
  capacity?: number | string;
  color?: string;
  image?: { secure_url?: string };
  [key: string]: any;
}

@Component({
  selector: 'app-driver-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, ModalComponent, IconComponent],
  template: `
    <div class="page">
      <div class="page-header">
        <div>
          <h2 style="margin:0">{{ translation.t('driver.profile') }}</h2>
          <p class="muted" style="margin:0.2rem 0 0">Manage your profile & vehicles</p>
        </div>
        <label class="avail-toggle">
          <span>{{ translation.t('ui.available') }}</span>
          <span class="toggle">
            <input type="checkbox" [checked]="isAvailable()" (change)="toggleAvailability()" />
            <span class="toggle-slider"></span>
          </span>
        </label>
      </div>

      @if (loading) {
        <div class="tm-loader"></div>
      } @else if (error) {
        <div class="error-box">{{ error }}</div>
      } @else {
        <div class="profile-card">
          <div class="avatar-wrap">
            @if (avatarUrl) {
              <img [src]="avatarUrl" class="avatar" />
            } @else {
              <div class="avatar placeholder">{{ (driver?.name || user?.name || '?')[0] }}</div>
            }
          </div>
          <div class="profile-meta">
            <h3 style="margin:0">{{ driver?.name || user?.name }}</h3>
            <span class="meta-line">{{ driver?.email || user?.email }}</span>
            <span class="meta-line">{{ driver?.phone || user?.phone }}</span>
          </div>
        </div>
      }

      <div class="section-head">
        <h3 style="margin:0">{{ translation.t('driver.my_vehicles') }}</h3>
        <button class="tm-btn tm-btn-sm" (click)="openAddVehicle()">
          <app-icon name="plus" [size]="16"></app-icon> {{ translation.t('vehicle.add_vehicle') }}
        </button>
      </div>

      @if (vehiclesLoading) {
        <div class="tm-loader"></div>
      } @else if (vehiclesError) {
        <div class="error-box">{{ vehiclesError }}</div>
      } @else {
        <div class="vehicle-grid">
          @for (v of vehicles; track v._id) {
            <div class="vehicle-card">
              <div class="vehicle-img">
                @if (v.image?.secure_url) {
                  <img [src]="v.image?.secure_url" />
                } @else {
                  <div class="vehicle-img-ph"><app-icon name="box" [size]="28"></app-icon></div>
                }
              </div>
              <div class="vehicle-body">
                <strong>{{ v.model || v.type || 'Vehicle' }}</strong>
                <span class="vehicle-sub">{{ v.type }}</span>
                <span class="vehicle-sub">{{ v.plateNumber }}</span>
                <div class="vehicle-actions">
                  <label class="tm-btn tm-btn-sm tm-btn-outline">
                    <app-icon name="upload" [size]="14"></app-icon> {{ translation.t('vehicle.image_label') }}
                    <input type="file" accept="image/*" hidden (change)="uploadVehicleImage(v, $event)" />
                  </label>
                  <button class="tm-btn tm-btn-sm tm-btn-outline" (click)="openEditVehicle(v)">
                     <app-icon name="edit" [size]="14"></app-icon> {{ translation.t('ui.edit') }}
                  </button>
                  <button class="tm-btn tm-btn-sm tm-btn-danger" (click)="deleteVehicle(v)">
                    <app-icon name="trash" [size]="14"></app-icon>
                  </button>
                </div>
              </div>
            </div>
          } @empty {
            <div class="empty-box">
              <app-icon name="box" [size]="36"></app-icon>
              <p>{{ translation.t('driver.no_vehicles') }}</p>
            </div>
          }
        </div>
      }
    </div>

    <app-modal [open]="vehicleModalOpen" [title]="editingVehicle ? translation.t('vehicle.edit_vehicle') : translation.t('vehicle.add_vehicle')"
      [showFooter]="true" confirmLabel="{{ translation.t('ui.save') }}" cancelLabel="{{ translation.t('ui.cancel') }}"
      (close)="vehicleModalOpen = false" (confirm)="saveVehicle()">
      <div class="vform">
        <div class="form-row">
          <label>{{ translation.t('vehicle.type') }}</label>
          <input class="tm-input" [(ngModel)]="vehicleForm.type" placeholder="e.g. Sedan, Van" />
        </div>
        <div class="form-row">
          <label>{{ translation.t('ui.model') }}</label>
          <input class="tm-input" [(ngModel)]="vehicleForm.model" placeholder="e.g. Toyota Hiace" />
        </div>
        <div class="form-row">
          <label>{{ translation.t('ui.plateNumber') }}</label>
          <input class="tm-input" [(ngModel)]="vehicleForm.plateNumber" placeholder="e.g. ABC-1234" />
        </div>
        <div class="form-row two">
          <div>
            <label>{{ translation.t('ui.capacity') }}</label>
            <input class="tm-input" type="number" [(ngModel)]="vehicleForm.capacity" placeholder="Seats" />
          </div>
          <div>
            <label>{{ translation.t('vehicle.color') }}</label>
            <input class="tm-input" [(ngModel)]="vehicleForm.color" placeholder="e.g. White" />
          </div>
        </div>
        <div class="form-row">
          <label>{{ translation.t('vehicle.image_label') }}</label>
          <label class="tm-btn tm-btn-sm tm-btn-outline">
            <app-icon name="upload" [size]="14"></app-icon>
            {{ vehicleImageFile ? translation.t('ui.replace') : translation.t('ui.uploadImage') }}
            <input type="file" accept="image/*" hidden (change)="onVehicleImageChange($event)" />
          </label>
          @if (vehicleImageFile) {
            <div class="img-note"><app-icon name="image" [size]="14"></app-icon> {{ vehicleImageFile.name }}</div>
          }
        </div>
      </div>
    </app-modal>

    <app-modal [open]="deleteVehicleModalOpen" title="{{ translation.t('vehicle.delete_vehicle') }}" confirmLabel="{{ translation.t('ui.delete') }}"
      [showFooter]="true" (close)="deleteVehicleModalOpen = false" (confirm)="confirmDeleteVehicle()">
      <p>{{ translation.t('ui.areYouSure') }}</p>
    </app-modal>
  `,
  styles: [`
    .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; flex-wrap: wrap; gap: 0.5rem; }

    .avail-toggle { display: flex; align-items: center; gap: 0.5rem; font-size: 0.85rem; font-weight: 600; }
    .toggle { position: relative; display: inline-block; width: 40px; height: 22px; cursor: pointer; }
    .toggle input { opacity: 0; width: 0; height: 0; }
    .toggle-slider { position: absolute; inset: 0; background: var(--tm-muted); border-radius: 999px; transition: 0.2s; }
    .toggle-slider::before { content: ''; position: absolute; width: 18px; height: 18px; border-radius: 50%; background: #fff; top: 2px; left: 2px; transition: 0.2s; }
    .toggle input:checked + .toggle-slider { background: var(--tm-success); }
    .toggle input:checked + .toggle-slider::before { transform: translateX(18px); }

    .error-box { padding: 1rem; background: rgba(239,68,68,0.1); border: 1px solid rgba(239,68,68,0.2); border-radius: 10px; color: #a33a32; }

    .profile-card { display: flex; align-items: center; gap: 1rem; background: var(--tm-surface); border: 1px solid var(--glass-border); border-radius: 12px; padding: 1.25rem; margin-bottom: 1.5rem; }
    .avatar-wrap { width: 72px; height: 72px; border-radius: 50%; overflow: hidden; flex-shrink: 0; }
    .avatar { width: 100%; height: 100%; object-fit: cover; }
    .avatar.placeholder { background: var(--tm-primary); color: #fff; display: flex; align-items: center; justify-content: center; font-size: 1.6rem; font-weight: 700; }
    .profile-meta h3 { font-size: 1.1rem; }
    .meta-line { display: flex; align-items: center; gap: 0.35rem; font-size: 0.85rem; color: var(--tm-muted); margin-top: 0.25rem; }
    .meta-line app-icon { color: var(--tm-primary); }

    .section-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem; }

    .vehicle-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 1rem; }
    .vehicle-card { background: var(--tm-surface); border: 1px solid var(--glass-border); border-radius: 12px; overflow: hidden; }
    .vehicle-img { height: 120px; background: var(--tm-surface-raised); display: flex; align-items: center; justify-content: center; }
    .vehicle-img img { width: 100%; height: 100%; object-fit: cover; }
    .vehicle-img-ph { color: var(--tm-muted); opacity: 0.5; }
    .vehicle-body { padding: 0.85rem 1rem 1rem; }
    .vehicle-body strong { display: block; font-size: 0.95rem; }
    .vehicle-sub { display: block; font-size: 0.8rem; color: var(--tm-muted); margin-top: 0.15rem; }
    .vehicle-actions { display: flex; gap: 0.4rem; margin-top: 0.6rem; flex-wrap: wrap; }

    .empty-box { grid-column: 1/-1; text-align: center; padding: 2.5rem; color: var(--tm-muted); }
    .empty-box p { margin: 0.5rem 0 0; }

    .vform .form-row { margin-bottom: 0.6rem; }
    .vform .form-row.two { display: grid; grid-template-columns: 1fr 1fr; gap: 0.6rem; }
    .vform .form-row label { display: block; font-size: 0.78rem; font-weight: 600; color: var(--tm-muted); margin-bottom: 0.3rem; text-transform: uppercase; letter-spacing: 0.04em; }
    .img-note { display: flex; align-items: center; gap: 0.35rem; font-size: 0.8rem; color: var(--tm-muted); margin-top: 0.4rem; }
  `],
})
export class DriverProfileComponent implements OnInit {
  private auth = inject(AuthService);
  translation = inject(TranslationService);
  private driverService = inject(DriverService);
  private vehicleService = inject(VehicleService);
  private toast = inject(ToastService);

  driverId = '';
  driver: any = null;
  loading = true;
  error = '';
  isAvailable = signal(false);

  vehicles: Vehicle[] = [];
  vehiclesLoading = false;
  vehiclesError = '';

  vehicleModalOpen = false;
  editingVehicle: Vehicle | null = null;
  vehicleForm: any = {};
  vehicleImageFile: File | null = null;
  vehicleSubmitting = false;

  deleteVehicleId: string | null = null;
  deleteVehicleModalOpen = false;

  get user() { return this.auth.user; }
  get avatarUrl() { return this.driver?.profileImage?.secure_url || this.user?.profileImage?.secure_url; }

  ngOnInit() {
    this.driverId = this.auth.user?._id || '';
    this.loadDriver();
    this.loadVehicles();
  }

  loadDriver() {
    this.loading = true; this.error = '';
    this.driverService.getById(this.driverId).subscribe({
      next: (res) => {
        this.driver = res.data || res;
        this.isAvailable.set(this.driver?.availability === 'available');
        this.loading = false;
      },
      error: (e) => {
        this.loading = false;
        this.error = e.error?.message || 'Failed to load profile';
        this.driver = this.user;
      },
    });
  }

  toggleAvailability() {
    this.isAvailable.update(v => !v);
    this.driverService.updateAvailability(this.driverId, this.isAvailable() ? 'available' : 'offline').subscribe({
      next: () => this.toast.success(this.isAvailable() ? 'You are now available' : 'You are now unavailable'),
      error: () => this.toast.error('Failed to update availability'),
    });
  }

  loadVehicles() {
    this.vehiclesLoading = true; this.vehiclesError = '';
    this.vehicleService.getByDriver(this.driverId).subscribe({
      next: (res) => { this.vehicles = res.data || []; this.vehiclesLoading = false; },
      error: (e) => { this.vehiclesLoading = false; this.vehiclesError = e.error?.message || 'Failed to load vehicles'; this.toast.error(this.vehiclesError); },
    });
  }

  openAddVehicle() {
    this.editingVehicle = null;
    this.vehicleForm = {};
    this.vehicleImageFile = null;
    this.vehicleModalOpen = true;
  }

  openEditVehicle(v: Vehicle) {
    this.editingVehicle = v;
    this.vehicleForm = { type: v.type, model: v.model, plateNumber: v.plateNumber, capacity: v.capacity, color: v.color };
    this.vehicleImageFile = null;
    this.vehicleModalOpen = true;
  }

  onVehicleImageChange(event: any) {
    const file = event.target.files?.[0];
    if (file) this.vehicleImageFile = file;
  }

  uploadVehicleImage(v: Vehicle, event: any) {
    const file = event.target.files?.[0];
    if (!file || !v._id) return;
    this.vehicleService.uploadImage(v._id, file).subscribe({
      next: () => { this.toast.success('Vehicle image updated'); this.loadVehicles(); },
      error: () => this.toast.error('Image upload failed'),
    });
  }

  saveVehicle() {
    if (this.vehicleSubmitting) return;
    this.vehicleSubmitting = true;
    const payload = {
      type: this.vehicleForm.type,
      model: this.vehicleForm.model,
      plateNumber: this.vehicleForm.plateNumber,
      capacity: this.vehicleForm.capacity,
      color: this.vehicleForm.color,
    };
    const after = (id: string) => {
      if (this.vehicleImageFile) {
        this.vehicleService.uploadImage(id, this.vehicleImageFile).subscribe({
          next: () => this.finishVehicleSave(),
          error: () => { this.toast.error('Vehicle saved but image upload failed'); this.finishVehicleSave(); },
        });
      } else {
        this.finishVehicleSave();
      }
    };
    if (this.editingVehicle?._id) {
      this.vehicleService.update(this.editingVehicle._id, payload).subscribe({
        next: (res) => after((res.data?._id) || this.editingVehicle!._id!),
        error: (e) => { this.vehicleSubmitting = false; this.toast.error(e.error?.message || 'Failed to update vehicle'); },
      });
    } else {
      this.vehicleService.create(payload).subscribe({
        next: (res) => after(res.data?._id || res._id),
        error: (e) => { this.vehicleSubmitting = false; this.toast.error(e.error?.message || 'Failed to create vehicle'); },
      });
    }
  }

  private finishVehicleSave() {
    this.vehicleSubmitting = false;
    this.vehicleModalOpen = false;
    this.toast.success('Vehicle saved');
    this.loadVehicles();
  }

  deleteVehicle(v: Vehicle) {
    this.deleteVehicleId = v._id || null;
    this.deleteVehicleModalOpen = true;
  }

  confirmDeleteVehicle() {
    if (!this.deleteVehicleId) return;
    this.vehicleService.delete(this.deleteVehicleId).subscribe({
      next: () => { this.deleteVehicleModalOpen = false; this.deleteVehicleId = null; this.toast.success('Vehicle deleted'); this.loadVehicles(); },
      error: () => this.toast.error('Failed to delete vehicle'),
    });
  }
}
