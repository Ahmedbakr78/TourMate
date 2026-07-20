import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TripService } from '../../core/services/trip.service';
import { PlaceService, Place } from '../../core/services/place.service';
import { GuideService } from '../../core/services/guide.service';
import { DriverService } from '../../core/services/driver.service';
import { VehicleService } from '../../core/services/vehicle.service';
import { ToastService } from '../../core/services/toast.service';
import { TranslationService } from '../../core/services/translation.service';
import { PaymentComponent } from '../../payment/payment.component';

@Component({
  selector: 'app-trip-new',
  standalone: true,
  imports: [CommonModule, FormsModule, PaymentComponent],
  template: `
    <div class="page">
      <div class="page-header">
        <div>
          <h2 style="margin:0">{{ translation.t('ui.newTrip') }}</h2>
          <p class="muted" style="margin:0.2rem 0 0">Plan your next adventure</p>
        </div>
      </div>

      <div class="new-trip-layout">
        <form (ngSubmit)="createTrip()" class="new-trip-form">
          <div class="form-card">
            <h3>{{ translation.t('trip.trip_details') }}</h3>
            <div class="form-row">
              <label>Start Date</label>
              <input type="datetime-local" [(ngModel)]="form.startDate" name="startDate" required class="tm-input">
            </div>
            <div class="form-row">
              <label>End Date</label>
              <input type="datetime-local" [(ngModel)]="form.endDate" name="endDate" required class="tm-input">
            </div>
            <div class="form-row">
              <label>Number of People</label>
              <input type="number" [(ngModel)]="form.peopleCount" name="peopleCount" min="1"
                (ngModelChange)="onPeopleCountChange()" class="tm-input">
            </div>
            <div class="form-row">
              <label>{{ translation.t('ui.price') }} ($)</label>
              <div class="price-row">
                <input type="number" [(ngModel)]="form.price" name="price" min="0" class="tm-input">
                <button type="button" class="tm-btn tm-btn-sm tm-btn-outline" (click)="doCalculate()">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12a9 9 0 1 1-3-6.7L21 8M21 3v5h-5"/></svg>
                  {{ translation.t('ui.calculate') }}
                </button>
              </div>
              @if (priceEstimated) {
                <span class="auto-note">Auto-estimated from places &amp; assignments</span>
              }
            </div>
          </div>

          <div class="form-card">
            <h3>{{ translation.t('ui.assignGuide') }} / {{ translation.t('ui.assignDriver') }} / {{ translation.t('ui.assignVehicle') }}</h3>
            <div class="form-row">
              <label>{{ translation.t('ui.guides') }}</label>
              <select class="tm-input" [(ngModel)]="form.guideId" name="guideId" (ngModelChange)="recalculate()">
                <option [ngValue]="null">No guide</option>
                @for (g of guides; track g._id) {
                  <option [ngValue]="g._id">{{ guideLabel(g) }}</option>
                }
              </select>
            </div>
            <div class="form-row">
              <label>{{ translation.t('ui.drivers') }}</label>
              <select class="tm-input" [(ngModel)]="form.driverId" name="driverId" (ngModelChange)="recalculate()">
                <option [ngValue]="null">No driver</option>
                @for (d of drivers; track d._id) {
                  <option [ngValue]="d._id">{{ driverLabel(d) }}</option>
                }
              </select>
            </div>
            <div class="form-row">
              <label>{{ translation.t('ui.vehicles') }}</label>
              <select class="tm-input" [(ngModel)]="form.vehicleId" name="vehicleId" (ngModelChange)="recalculate()">
                <option [ngValue]="null">No vehicle</option>
                @for (v of vehicles; track v._id) {
                  <option [ngValue]="v._id">{{ vehicleLabel(v) }}</option>
                }
              </select>
            </div>
          </div>

          <div class="form-card">
            <h3>{{ translation.t('ui.places') }}</h3>
            <div class="form-row">
              <label>{{ translation.t('ui.search') }}</label>
              <div class="search-wrap">
                <input type="text" [(ngModel)]="searchQuery" name="search" placeholder="Search by city or name..." class="tm-input" (input)="searchPlaces()">
                <svg class="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              </div>
            </div>
            @if (searchResults.length > 0) {
              <div class="search-results">
                @for (p of searchResults; track p._id) {
                  <div class="result-item" (click)="addPlace(p)">
                    <span class="result-name">{{ p.name }}</span>
                    <span class="result-meta">{{ p.city }} - {{ p.category }}</span>
                  </div>
                }
              </div>
            }
            @if (selectedPlaces.length > 0) {
              <div class="selected-places">
                <label>{{ translation.t('ui.places') }} ({{ selectedPlaces.length }})</label>
                <div class="place-tags">
                  @for (p of selectedPlaces; track p._id; let i = $index) {
                    <span class="place-tag">
                      <button type="button" class="reorder" (click)="movePlace(i, -1)"
                        [disabled]="i === 0" title="Move up" aria-label="Move up">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="18 15 12 9 6 15"/></svg>
                      </button>
                      <span class="place-name">{{ p.name }}</span>
                      <button type="button" class="reorder" (click)="movePlace(i, 1)"
                        [disabled]="i === selectedPlaces.length - 1" title="Move down" aria-label="Move down">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"/></svg>
                      </button>
                      <button type="button" class="remove" (click)="removePlace(p)">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                      </button>
                    </span>
                  }
                </div>
              </div>
            }
          </div>

          @if (error) { <div class="error-box">{{ error }}</div> }
          <button type="submit" class="tm-btn tm-btn-primary"
            [disabled]="!form.startDate || !form.endDate || selectedPlaces.length === 0 || submitting">
            @if (submitting) {
              <span class="btn-spinner"></span> Creating...
            } @else {
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
              {{ translation.t('ui.newTrip') }}
            }
          </button>
        </form>
      </div>

      @if (showPayment) {
        <app-payment
          [amount]="paymentAmount"
          (confirm)="onPaymentConfirm($event)"
          (cancel)="onPaymentCancel()"
        />
      }
    </div>
  `,
  styles: [`
    .page-header { margin-bottom: 1.5rem; }
    .new-trip-layout { max-width: 640px; }
    .new-trip-form { display: flex; flex-direction: column; gap: 1rem; }
    .form-card {
      background: var(--tm-surface);
      border: 1px solid var(--glass-border);
      border-radius: 12px;
      padding: 1.25rem;
    }
    .form-card h3 { margin: 0 0 1rem; font-size: 0.95rem; }
    .form-row { margin-bottom: 0.5rem; }
    .form-row label { display: block; font-size: 0.78rem; font-weight: 600; color: var(--tm-muted); margin-bottom: 0.35rem; text-transform: uppercase; letter-spacing: 0.04em; }
    .price-row { display: flex; gap: 0.4rem; align-items: stretch; }
    .price-row .tm-input { flex: 1; margin: 0; }
    .auto-note { display: block; font-size: 0.72rem; color: var(--tm-muted); margin-top: 0.3rem; }
    .search-wrap { position: relative; }
    .search-icon { position: absolute; right: 12px; top: 10px; color: var(--tm-muted); pointer-events: none; }
    .search-results { border: 1px solid var(--glass-border); border-radius: 10px; max-height: 200px; overflow-y: auto; margin-top: 0.25rem; }
    .result-item { padding: 0.6rem 0.8rem; cursor: pointer; border-bottom: 1px solid var(--glass-border); display: flex; justify-content: space-between; align-items: center; transition: background 0.15s; }
    .result-item:last-child { border-bottom: none; }
    .result-item:hover { background: var(--glass-hover); }
    .result-name { font-weight: 500; font-size: 0.9rem; }
    .result-meta { font-size: 0.78rem; color: var(--tm-muted); }
    .selected-places { margin-top: 0.75rem; }
    .selected-places label { display: block; font-size: 0.78rem; font-weight: 600; color: var(--tm-muted); margin-bottom: 0.4rem; text-transform: uppercase; letter-spacing: 0.04em; }
    .place-tags { display: flex; flex-wrap: wrap; gap: 0.4rem; }
    .place-tag { background: rgba(17,17,17,0.12); color: var(--tm-accent); padding: 0.3rem 0.4rem 0.3rem 0.5rem; border-radius: 999px; font-size: 0.82rem; display: flex; align-items: center; gap: 0.15rem; }
    .place-name { padding: 0 0.1rem; }
    .reorder { background: none; border: none; cursor: pointer; font-size: 0.9rem; color: var(--tm-muted); padding: 0 2px; line-height: 1; display: inline-flex; align-items: center; }
    .reorder:hover:not(:disabled) { color: var(--tm-primary); }
    .reorder:disabled { opacity: 0.3; cursor: not-allowed; }
    .remove { background: none; border: none; cursor: pointer; font-size: 1.1rem; color: var(--tm-muted); padding: 0 2px; line-height: 1; display: inline-flex; }
    .remove:hover { color: var(--tm-danger); }
    .error-box { padding: 0.75rem; background: rgba(239,68,68,0.1); border: 1px solid rgba(239,68,68,0.2); border-radius: 8px; color: #a33a32; font-size: 0.85rem; }
    .btn-spinner { width: 16px; height: 16px; border: 2px solid rgba(255,255,255,0.3); border-top-color: #fff; border-radius: 50%; animation: spin 0.5s linear infinite; }
    @keyframes spin { to { transform: rotate(360deg); } }
  `]
})
export class TripNewComponent implements OnInit {
  private tripService = inject(TripService);
  private placeService = inject(PlaceService);
  private guideService = inject(GuideService);
  private driverService = inject(DriverService);
  private vehicleService = inject(VehicleService);
  private router = inject(Router);
  translation = inject(TranslationService);
  private toast = inject(ToastService);

  form: any = { peopleCount: 1, price: 0, guideId: null, driverId: null, vehicleId: null };
  searchQuery = '';
  searchResults: Place[] = [];
  selectedPlaces: Place[] = [];
  submitting = false;
  error = '';
  priceEstimated = false;

  guides: any[] = [];
  drivers: any[] = [];
  vehicles: any[] = [];

  showPayment = false;
  paymentAmount = 0;

  private recalcTimer?: any;

  ngOnInit() {
    this.guideService.getAll().subscribe({ next: (res) => this.guides = res?.data || [], error: () => {} });
    this.driverService.getAll().subscribe({ next: (res) => this.drivers = res?.data || [], error: () => {} });
    this.vehicleService.getAll().subscribe({ next: (res) => this.vehicles = res?.data || [], error: () => {} });
  }

  guideLabel(g: any): string {
    return g?.userId?.name || g?.name || g?.fullName || ('Guide ' + (g?._id ? g._id.slice(-4) : ''));
  }
  driverLabel(d: any): string {
    return d?.userId?.name || d?.name || d?.fullName || ('Driver ' + (d?._id ? d._id.slice(-4) : ''));
  }
  vehicleLabel(v: any): string {
    const base = v?.model || v?.name || v?.plateNumber || v?.plate || 'Vehicle';
    const cap = v?.capacity ? ' (seats ' + v.capacity + ')' : '';
    return base + cap;
  }

  searchPlaces() {
    if (this.searchQuery.length < 2) { this.searchResults = []; return; }
    this.placeService.search({ q: this.searchQuery }).subscribe({
      next: (res) => this.searchResults = res.data || [],
    });
  }

  addPlace(p: Place) {
    if (!this.selectedPlaces.find((sp) => sp._id === p._id)) {
      this.selectedPlaces.push(p);
      this.recalculate();
    }
    this.searchResults = [];
    this.searchQuery = '';
  }

  removePlace(p: Place) {
    this.selectedPlaces = this.selectedPlaces.filter((sp) => sp._id !== p._id);
    this.recalculate();
  }

  movePlace(index: number, dir: number) {
    const target = index + dir;
    if (target < 0 || target >= this.selectedPlaces.length) return;
    const item = this.selectedPlaces[index];
    this.selectedPlaces.splice(index, 1);
    this.selectedPlaces.splice(target, 0, item);
  }

  onPeopleCountChange() {
    this.recalculate();
  }

  recalculate() {
    if (this.recalcTimer) clearTimeout(this.recalcTimer);
    this.recalcTimer = setTimeout(() => this.doCalculate(), 350);
  }

  doCalculate() {
    const places = this.selectedPlaces.map((p) => p._id).filter(Boolean);
    if (!places.length) return;
    this.tripService.calculatePrice({
      places,
      peopleCount: this.form.peopleCount || 1,
      guideId: this.form.guideId || undefined,
      driverId: this.form.driverId || undefined,
      vehicleId: this.form.vehicleId || undefined,
    }).subscribe({
      next: (res) => {
        const price = res?.data?.price ?? res?.data ?? res?.price;
        if (typeof price === 'number' && !isNaN(price)) {
          this.form.price = price;
          this.priceEstimated = true;
        }
      },
      error: () => {},
    });
  }

  createTrip() {
    if (this.submitting) return;
    this.submitting = true; this.error = '';
    const data = {
      places: this.selectedPlaces.map((p) => p._id),
      startDate: this.form.startDate,
      endDate: this.form.endDate,
      peopleCount: this.form.peopleCount || 1,
      price: this.form.price || 0,
      guideId: this.form.guideId || undefined,
      driverId: this.form.driverId || undefined,
      vehicleId: this.form.vehicleId || undefined,
    };
    this.tripService.create(data).subscribe({
      next: (res) => {
        this.submitting = false;
        this.toast.success('Trip created!');
        if (data.price > 0) {
          this.paymentAmount = data.price;
          this.showPayment = true;
        } else {
          this.router.navigate(['/app/trip', res.data._id]);
        }
      },
      error: (e) => { this.submitting = false; this.error = e.error?.message || 'Failed to create trip'; this.toast.error(this.error); },
    });
  }

  onPaymentConfirm(result: any) {
    this.showPayment = false;
    if (result?.success) {
      this.toast.success('Payment successful!');
    } else {
      this.toast.info('Trip created - payment pending');
    }
    this.router.navigate(['/app/trip/list']);
  }

  onPaymentCancel() {
    this.showPayment = false;
    this.toast.info('Trip created without payment');
    this.router.navigate(['/app/trip/list']);
  }
}
