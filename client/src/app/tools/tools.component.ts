import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TripService, Trip } from '../core/services/trip.service';
import { TranslationService } from '../core/services/translation.service';
import { ToastService } from '../core/services/toast.service';

interface Currency { code: string; name: string; rate: number; }
interface UnitGroup { name: string; units: { name: string; factor: number }[]; }

@Component({
  selector: 'app-tools',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page">
      <div class="page-header">
        <div>
          <h2 style="margin:0">{{ translation.t('ui.tools') }}</h2>
          <p class="muted" style="margin:0.2rem 0 0">Free offline utilities — no internet needed</p>
        </div>
      </div>

      <div class="tools-grid">
        <!-- Currency Converter -->
        <div class="tool-card">
          <div class="tool-head">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
            <h3>{{ translation.t('tools.currency_converter') }}</h3>
          </div>
          <div class="conv-row">
            <input class="tm-input conv-amount" type="number" [(ngModel)]="amount" (input)="convert()" />
            <select class="tm-input conv-select" [(ngModel)]="fromCur" (change)="convert()">
              @for (c of currencies; track c.code) { <option [value]="c.code">{{ c.code }} — {{ c.name }}</option> }
            </select>
          </div>
          <div class="conv-swap" (click)="swap()">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg>
          </div>
          <div class="conv-row">
            <input class="tm-input conv-amount" [value]="result()" readonly />
            <select class="tm-input conv-select" [(ngModel)]="toCur" (change)="convert()">
              @for (c of currencies; track c.code) { <option [value]="c.code">{{ c.code }} — {{ c.name }}</option> }
            </select>
          </div>
          <p class="conv-rate muted">{{ fromCur }} 1 = {{ toCur }} {{ rate() }}</p>
        </div>

        <!-- Unit Converter -->
        <div class="tool-card">
          <div class="tool-head">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M3 12h18M3 18h18"/></svg>
            <h3>{{ translation.t('tools.unit_converter') }}</h3>
          </div>
          <select class="tm-input" [(ngModel)]="unitGroup" (change)="convertUnit()">
            @for (g of unitGroups; track g.name) { <option [value]="g.name">{{ g.name }}</option> }
          </select>
          <div class="conv-row" style="margin-top:0.5rem">
            <input class="tm-input conv-amount" type="number" [(ngModel)]="unitValue" (input)="convertUnit()" />
            <select class="tm-input conv-select" [(ngModel)]="unitFrom" (change)="convertUnit()">
              @for (u of currentUnits; track u.name) { <option [value]="u.name">{{ u.name }}</option> }
            </select>
          </div>
          <div class="conv-row">
            <input class="tm-input conv-amount" [value]="unitResult()" readonly />
            <select class="tm-input conv-select" [(ngModel)]="unitTo" (change)="convertUnit()">
              @for (u of currentUnits; track u.name) { <option [value]="u.name">{{ u.name }}</option> }
            </select>
          </div>
        </div>

        <!-- Tip Calculator -->
        <div class="tool-card">
          <div class="tool-head">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>
            <h3>{{ translation.t('tools.tip_calculator') }}</h3>
          </div>
          <div class="form-row">
            <label>{{ translation.t('tools.bill_amount') }}</label>
            <input class="tm-input" type="number" [(ngModel)]="bill" (input)="calcTip()" />
          </div>
          <div class="form-row">
            <label>{{ translation.t('tools.tip_pct') }}: {{ tipPct }}%</label>
            <input type="range" min="0" max="30" [(ngModel)]="tipPct" (input)="calcTip()" class="tm-range" />
          </div>
          <div class="form-row">
            <label>{{ translation.t('tools.split_between') }}</label>
            <input class="tm-input" type="number" min="1" [(ngModel)]="splitCount" (input)="calcTip()" />
          </div>
          <div class="tip-result">
            <div class="tip-line"><span>{{ translation.t('ui.tip') }}</span><strong>\${{ tipAmount() }}</strong></div>
            <div class="tip-line"><span>{{ translation.t('ui.total') }}</span><strong>\${{ tipTotal() }}</strong></div>
            <div class="tip-line accent"><span>{{ translation.t('ui.perPerson') }}</span><strong>\${{ tipPerPerson() }}</strong></div>
          </div>
        </div>

        <!-- Trip Countdown -->
        <div class="tool-card">
          <div class="tool-head">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            <h3>{{ translation.t('tools.trip_countdown') }}</h3>
          </div>
          <select class="tm-input" [(ngModel)]="countdownTripId" (change)="updateCountdown()">
            <option value="">{{ translation.t('tools.select_trip') }}</option>
            @for (t of trips; track t._id) { <option [value]="t._id">{{ t.startDate | date:'MMM d' }} — {{ t.places.length }} places</option> }
          </select>
          @if (countdownText()) {
            <div class="countdown-display">
              <span class="cd-num">{{ countdownText() }}</span>
              <span class="cd-label">{{ translation.t('tools.until_trip_starts') }}</span>
            </div>
          } @else {
            <p class="muted" style="margin-top:0.75rem">{{ translation.t('tools.pick_trip') }}</p>
          }
        </div>
      </div>
    </div>
  `,
  styles: [`
    .page-header { margin-bottom: 1.5rem; }
    .tools-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1rem; }
    .tool-card { background: var(--tm-surface); border: 1px solid var(--glass-border); border-radius: 12px; padding: 1.25rem; }
    .tool-head { display: flex; align-items: center; gap: 0.5rem; margin-bottom: 1rem; }
    .tool-head svg { color: var(--tm-primary); }
    .tool-head h3 { margin: 0; font-size: 1rem; }

    .conv-row { display: flex; gap: 0.4rem; }
    .conv-amount { flex: 1; margin-bottom: 0; }
    .conv-select { width: 110px; margin-bottom: 0; }
    .conv-swap { display: flex; justify-content: center; padding: 0.35rem; cursor: pointer; color: var(--tm-muted); }
    .conv-swap svg { transition: transform 0.2s; }
    .conv-swap:hover { color: var(--tm-primary); }
    .conv-rate { font-size: 0.75rem; margin: 0.4rem 0 0; }

    .tm-range { width: 100%; accent-color: var(--tm-primary); margin-bottom: 0.5rem; }

    .form-row { margin-bottom: 0.6rem; }
    .form-row label { display: block; font-size: 0.78rem; font-weight: 600; color: var(--tm-muted); margin-bottom: 0.3rem; text-transform: uppercase; letter-spacing: 0.04em; }
    .form-row .tm-input { margin-bottom: 0; }

    .tip-result { margin-top: 0.75rem; padding-top: 0.75rem; border-top: 1px solid var(--glass-border); display: flex; flex-direction: column; gap: 0.4rem; }
    .tip-line { display: flex; justify-content: space-between; font-size: 0.85rem; }
    .tip-line.accent { color: var(--tm-primary); font-size: 0.95rem; }
    .tip-line.accent strong { font-size: 1.1rem; }

    .countdown-display { text-align: center; margin-top: 1rem; }
    .cd-num { display: block; font-size: 2rem; font-weight: 800; color: var(--tm-primary); }
    .cd-label { font-size: 0.8rem; color: var(--tm-muted); }

    @media (max-width: 600px) {
      .tools-grid { grid-template-columns: 1fr; }
    }
  `]
})
export class ToolsComponent {
  private tripService = inject(TripService);
  translation = inject(TranslationService);
  private toast = inject(ToastService);

  currencies: Currency[] = [
    { code: 'USD', name: 'US Dollar', rate: 1 },
    { code: 'EUR', name: 'Euro', rate: 0.92 },
    { code: 'GBP', name: 'British Pound', rate: 0.79 },
    { code: 'EGP', name: 'Egyptian Pound', rate: 48.5 },
    { code: 'JPY', name: 'Japanese Yen', rate: 151.5 },
    { code: 'AED', name: 'UAE Dirham', rate: 3.67 },
    { code: 'CAD', name: 'Canadian Dollar', rate: 1.36 },
    { code: 'AUD', name: 'Australian Dollar', rate: 1.52 },
    { code: 'CHF', name: 'Swiss Franc', rate: 0.88 },
    { code: 'INR', name: 'Indian Rupee', rate: 83.2 },
  ];
  amount = 100;
  fromCur = 'USD';
  toCur = 'EUR';
  result = signal(0);
  rate = signal(0);

  unitGroups: UnitGroup[] = [
    { name: 'Distance', units: [
      { name: 'Kilometers', factor: 1 },
      { name: 'Miles', factor: 0.621371 },
      { name: 'Meters', factor: 1000 },
      { name: 'Feet', factor: 3280.84 },
    ]},
    { name: 'Temperature', units: [
      { name: 'Celsius', factor: 1 },
      { name: 'Fahrenheit', factor: 1 },
      { name: 'Kelvin', factor: 1 },
    ]},
    { name: 'Weight', units: [
      { name: 'Kilograms', factor: 1 },
      { name: 'Pounds', factor: 2.20462 },
      { name: 'Grams', factor: 1000 },
      { name: 'Ounces', factor: 35.274 },
    ]},
    { name: 'Volume', units: [
      { name: 'Liters', factor: 1 },
      { name: 'Gallons', factor: 0.264172 },
      { name: 'Mililiters', factor: 1000 },
    ]},
  ];
  unitGroup = 'Distance';
  unitValue = 1;
  unitFrom = 'Kilometers';
  unitTo = 'Miles';
  unitResult = signal(0);

  get currentUnits() {
    return this.unitGroups.find(g => g.name === this.unitGroup)?.units || [];
  }

  bill = 50;
  tipPct = 15;
  splitCount = 1;
  tipAmount = signal(0);
  tipTotal = signal(0);
  tipPerPerson = signal(0);

  trips: Trip[] = [];
  countdownTripId = '';
  countdownText = signal('');

  constructor() {
    if (this.currentUnits[0]) this.unitFrom = this.currentUnits[0].name;
    if (this.currentUnits[1]) this.unitTo = this.currentUnits[1].name;
    this.convert();
    this.convertUnit();
    this.calcTip();
    this.loadTrips();
  }

  loadTrips() {
    this.tripService.getMyTrips().subscribe({
      next: (res) => { this.trips = res.data || []; },
      error: () => {},
    });
  }

  convert() {
    const from = this.currencies.find(c => c.code === this.fromCur);
    const to = this.currencies.find(c => c.code === this.toCur);
    if (!from || !to) return;
    const usd = this.amount / from.rate;
    this.rate.set(+(to.rate / from.rate).toFixed(4));
    this.result.set(+(usd * to.rate).toFixed(2));
  }

  swap() {
    const t = this.fromCur; this.fromCur = this.toCur; this.toCur = t;
    this.convert();
  }

  convertUnit() {
    const group = this.unitGroups.find(g => g.name === this.unitGroup);
    if (!group) return;
    const from = group.units.find(u => u.name === this.unitFrom);
    const to = group.units.find(u => u.name === this.unitTo);
    if (!from || !to) return;
    if (this.unitGroup === 'Temperature') {
      this.unitResult.set(+this.convertTemp(this.unitValue, this.unitFrom, this.unitTo).toFixed(2));
      return;
    }
    const base = this.unitValue * from.factor;
    this.unitResult.set(+(base / to.factor).toFixed(4));
  }

  convertTemp(val: number, from: string, to: string): number {
    let c = val;
    if (from === 'Fahrenheit') c = (val - 32) * 5 / 9;
    if (from === 'Kelvin') c = val - 273.15;
    if (to === 'Fahrenheit') return c * 9 / 5 + 32;
    if (to === 'Kelvin') return c + 273.15;
    return c;
  }

  calcTip() {
    const tip = (this.bill * this.tipPct) / 100;
    this.tipAmount.set(+tip.toFixed(2));
    this.tipTotal.set(+(this.bill + tip).toFixed(2));
    this.tipPerPerson.set(+((this.bill + tip) / Math.max(this.splitCount, 1)).toFixed(2));
  }

  updateCountdown() {
    const trip = this.trips.find(t => t._id === this.countdownTripId);
    if (!trip) { this.countdownText.set(''); return; }
    const diff = new Date(trip.startDate).getTime() - Date.now();
    if (diff <= 0) { this.countdownText.set('Trip started!'); return; }
    const days = Math.floor(diff / 86400000);
    const hours = Math.floor((diff % 86400000) / 3600000);
    this.countdownText.set(`${days}d ${hours}h`);
  }
}
