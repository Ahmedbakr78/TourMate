import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { VehicleService } from '../../core/services/vehicle.service';
import { DriverService } from '../../core/services/driver.service';
import { ToastService } from '../../core/services/toast.service';
import { TranslationService } from '../../core/services/translation.service';
import { ModalComponent } from '../../shared/modal.component';
import { IconComponent } from '../../shared/icon.component';

@Component({
  selector: 'app-vehicle-management',
  standalone: true,
  imports: [CommonModule, FormsModule, ModalComponent, IconComponent],
  template: `
    <div class="page">
      <div class="page-header">
        <div>
          <h2 style="margin:0">{{ translation.t('ui.vehicles') }}</h2>
          <p class="muted" style="margin:0.2rem 0 0">{{ vehicles.length }} vehicles</p>
        </div>
        <button class="tm-btn" (click)="openAdd()">
          <app-icon name="plus" [size]="16"></app-icon> Add Vehicle
        </button>
      </div>

      @if (loading) {
        <div class="tm-loader"></div>
      } @else if (error) {
        <div class="error-box">{{ error }}</div>
            } @else if (vehicles.length === 0) {
              <div class="empty-state">{{ translation.t('ui.noData') }}</div>
            } @else {
              <div class="tm-table-wrap">
                <table class="tm-table">
                  <thead>
                    <tr>
                      <th>{{ translation.t('ui.brand') }}</th><th>{{ translation.t('ui.model') }}</th><th>{{ translation.t('ui.plateNumber') }}</th><th>{{ translation.t('ui.capacity') }}</th><th>Driver</th><th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    @for (v of vehicles; track v._id) {
                      <tr>
                        <td>{{ v.brand }}</td>
                        <td>{{ v.model }}</td>
                        <td>{{ v.plateNumber }}</td>
                        <td>{{ v.capacity }}</td>
                        <td>{{ driverName(v) }}</td>
                        <td class="actions-cell">
                          <button class="tm-btn tm-btn-sm tm-btn-outline" (click)="openEdit(v)">
                            <app-icon name="edit" [size]="14"></app-icon> {{ translation.t('ui.edit') }}
                          </button>
                          <button class="tm-btn tm-btn-sm tm-btn-danger" (click)="askDelete(v)">
                            <app-icon name="trash" [size]="14"></app-icon> {{ translation.t('ui.delete') }}
                          </button>
                        </td>
                      </tr>
                    }
                  </tbody>
                </table>
              </div>
            }
    </div>

    <app-modal [open]="modalOpen" [title]="editingId ? 'Edit Vehicle' : 'Add Vehicle'" [showFooter]="true"
      [confirmLabel]="translation.t('ui.save')" (close)="closeModal()" (confirm)="save()">
      <div class="form-row">
        <label>{{ translation.t('ui.brand') }}</label>
        <input class="tm-input" [(ngModel)]="form.brand" placeholder="e.g. Toyota" />
      </div>
      <div class="form-row">
        <label>{{ translation.t('ui.model') }}</label>
        <input class="tm-input" [(ngModel)]="form.vehicleModel" placeholder="e.g. Hiace" />
      </div>
      <div class="form-row">
        <label>{{ translation.t('ui.plateNumber') }}</label>
        <input class="tm-input" [(ngModel)]="form.plateNumber" placeholder="e.g. ABC-123" />
      </div>
      <div class="form-row">
        <label>{{ translation.t('ui.capacity') }}</label>
        <input class="tm-input" type="number" min="1" [(ngModel)]="form.capacity" placeholder="e.g. 7" />
      </div>
      <div class="form-row">
        <label>Driver</label>
        <select class="tm-input" [(ngModel)]="form.driverId">
          <option value="">— Unassigned —</option>
          @for (d of drivers; track d._id) {
            <option [value]="d._id">{{ driverLabel(d) }}</option>
          }
        </select>
      </div>
      <div class="form-row">
        <label>Image</label>
        <label class="file-drop">
          <app-icon name="upload" [size]="18"></app-icon>
          <span>{{ selectedFile ? selectedFile.name : 'Choose an image' }}</span>
          <input type="file" accept="image/*" (change)="onFileSelected($event)" hidden />
        </label>
      </div>
    </app-modal>

    <app-modal [open]="confirmOpen" title="Delete Vehicle" [showFooter]="true"
      [confirmLabel]="translation.t('ui.delete')" [cancelLabel]="translation.t('ui.cancel')" (close)="confirmOpen=false" (confirm)="doDelete()">
      <p>Are you sure you want to delete <strong>{{ pending?.brand }} {{ pending?.model }}</strong> ({{ pending?.plateNumber }})? This cannot be undone.</p>
    </app-modal>
  `,
  styles: [`
    .page-header { margin-bottom: 1.5rem; }
    .error-box { padding: 1rem; background: rgba(239,68,68,0.1); border: 1px solid rgba(239,68,68,0.2); border-radius: 10px; color: #a33a32; }
    .empty-state { text-align: center; padding: 2rem; color: var(--tm-muted); }
    .tm-table-wrap { overflow-x: auto; }
    .actions-cell { display: flex; gap: 0.4rem; }
    .form-row { display: flex; flex-direction: column; gap: 0.35rem; }
    .form-row label { font-size: 0.72rem; font-weight: 600; color: var(--tm-text-secondary); text-transform: uppercase; letter-spacing: 0.07em; }
    .file-drop {
      display: flex; align-items: center; gap: 0.5rem; cursor: pointer;
      border: 1px dashed var(--tm-line-strong); border-radius: var(--tm-radius-sm);
      padding: 0.7rem 1rem; color: var(--tm-muted); font-size: 0.85rem; margin-bottom: 0.9rem;
    }
    .file-drop:hover { border-color: var(--tm-ink); color: var(--tm-ink); }
  `],
})
export class VehicleManagementComponent implements OnInit {
  vehicleService = inject(VehicleService);
  driverService = inject(DriverService);
  translation = inject(TranslationService);
  toast = inject(ToastService);

  vehicles: any[] = [];
  drivers: any[] = [];
  loading = true;
  error = '';

  modalOpen = false;
  confirmOpen = false;
  editingId: string | null = null;
  pending: any = null;
  selectedFile: File | null = null;

  form = { brand: '', vehicleModel: '', plateNumber: '', capacity: 1, driverId: '' };

  ngOnInit() {
    this.loadDrivers();
    this.load();
  }

  load() {
    this.loading = true; this.error = '';
    this.vehicleService.getAll().subscribe({
      next: (res: any) => { this.vehicles = res.data || []; this.loading = false; },
      error: (e) => { this.error = e.error?.message || 'Failed to load'; this.loading = false; this.toast.error(this.error); },
    });
  }

  loadDrivers() {
    this.driverService.getAll().subscribe({
      next: (res: any) => { this.drivers = res.data || []; },
      error: () => { /* non-fatal */ },
    });
  }

  driverName(v: any): string {
    if (!v.driver) return 'Unassigned';
    return v.driver?.userId?.name || v.driver?.name || 'Assigned';
  }

  driverLabel(d: any): string {
    return d.userId?.name || d.name || d.licenseNumber || 'Driver';
  }

  resetForm() {
    this.form = { brand: '', vehicleModel: '', plateNumber: '', capacity: 1, driverId: '' };
    this.selectedFile = null;
    this.editingId = null;
  }

  openAdd() {
    this.resetForm();
    this.modalOpen = true;
  }

  openEdit(v: any) {
    this.editingId = v._id;
    this.form = {
      brand: v.brand || '',
      vehicleModel: v.model || '',
      plateNumber: v.plateNumber || '',
      capacity: v.capacity || 1,
      driverId: v.driver?._id || v.driver || '',
    };
    this.selectedFile = null;
    this.modalOpen = true;
  }

  closeModal() {
    this.modalOpen = false;
    this.resetForm();
  }

  onFileSelected(e: Event) {
    const input = e.target as HTMLInputElement;
    if (input.files && input.files.length) {
      this.selectedFile = input.files[0];
    }
  }

  save() {
    const payload = {
      brand: this.form.brand,
      model: this.form.vehicleModel,
      plateNumber: this.form.plateNumber,
      capacity: this.form.capacity,
      driver: this.form.driverId || undefined,
    };

    const done = (id: string) => {
      if (this.selectedFile) {
        this.vehicleService.uploadImage(id, this.selectedFile).subscribe({
          next: () => this.finishSave(),
          error: (e) => { this.toast.error(e.error?.message || 'Saved, but image upload failed'); this.finishSave(); },
        });
      } else {
        this.finishSave();
      }
    };

    if (this.editingId) {
      this.vehicleService.update(this.editingId, payload).subscribe({
        next: (res: any) => done(res?.data?._id || this.editingId!),
        error: (e) => this.toast.error(e.error?.message || 'Failed to update'),
      });
    } else {
      this.vehicleService.create(payload).subscribe({
        next: (res: any) => done(res?.data?._id || res?._id),
        error: (e) => this.toast.error(e.error?.message || 'Failed to create'),
      });
    }
  }

  private finishSave() {
    this.modalOpen = false;
    this.resetForm();
    this.load();
    this.toast.success('Vehicle saved');
  }

  askDelete(v: any) {
    this.pending = v;
    this.confirmOpen = true;
  }

  doDelete() {
    if (!this.pending) return;
    const id = this.pending._id;
    this.confirmOpen = false;
    this.vehicleService.delete(id).subscribe({
      next: () => { this.load(); this.toast.success('Vehicle deleted'); this.pending = null; },
      error: (e) => this.toast.error(e.error?.message || 'Failed to delete'),
    });
  }
}
