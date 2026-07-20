import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IconComponent, IconName } from '../shared/icon.component';
import { TranslationService } from '../core/services/translation.service';

interface Tip { icon: IconName; title: string; body: string; category: string; }

@Component({
  selector: 'app-tips',
  standalone: true,
  imports: [CommonModule, FormsModule, IconComponent],
  template: `
    <div class="page">
      <div class="page-header">
        <div>
          <h2 style="margin:0">{{ translation.t('ui.tips') }}</h2>
          <p class="muted" style="margin:0.2rem 0 0">Free expert guidance, always available offline</p>
        </div>
        <select class="tm-input cat-filter" [(ngModel)]="filter" (change)="applyFilter()">
          <option value="">{{ translation.t('place.all_categories') }}</option>
          @for (c of categories; track c) { <option [value]="c">{{ c }}</option> }
        </select>
      </div>

      <div class="tips-grid">
        @for (t of filtered(); track t.title) {
          <div class="tip-card">
            <div class="tip-icon"><app-icon [name]="t.icon" [size]="22" color="var(--tm-ink)"></app-icon></div>
            <div class="tip-body">
              <span class="tip-cat">{{ t.category }}</span>
              <h4>{{ t.title }}</h4>
              <p>{{ t.body }}</p>
            </div>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; flex-wrap: wrap; gap: 0.5rem; }
    .cat-filter { width: auto; min-width: 160px; margin: 0; }
    .tips-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 1rem; }
    .tip-card {
      background: var(--tm-surface); border: 1px solid var(--glass-border); border-radius: 12px;
      padding: 1.25rem; display: flex; gap: 0.85rem; transition: all 0.2s;
    }
    .tip-card:hover { background: var(--tm-surface-raised); transform: translateY(-2px); box-shadow: var(--tm-shadow); }
    .tip-icon {
      width: 44px; height: 44px; border-radius: 12px; flex-shrink: 0;
      background: rgba(17,17,17,0.12); display: flex; align-items: center; justify-content: center;
    }
    .tip-body { flex: 1; }
    .tip-cat { font-size: 0.68rem; text-transform: uppercase; letter-spacing: 0.05em; color: var(--tm-primary); font-weight: 600; }
    .tip-body h4 { margin: 0.15rem 0 0.35rem; font-size: 0.95rem; }
    .tip-body p { margin: 0; font-size: 0.83rem; color: var(--tm-muted); line-height: 1.5; }
    @media (max-width: 600px) { .tips-grid { grid-template-columns: 1fr; } }
  `]
})
export class TipsComponent {
  translation = inject(TranslationService);
  filter = '';
  categories = ['Packing', 'Safety', 'Budget', 'Health', 'Tech', 'Culture'];

  allTips: Tip[] = [
    { icon: 'bag', title: 'Roll, Don\'t Fold', body: 'Rolling clothes saves space and reduces wrinkles. Use packing cubes to separate outfits by day.', category: 'Packing' },
    { icon: 'bank', title: 'Notify Your Bank', body: 'Always alert your card issuer before traveling abroad to avoid frozen cards on arrival.', category: 'Safety' },
    { icon: 'cash', title: 'Use Local ATMs', body: 'Local bank ATMs usually offer better exchange rates than airport kiosks or hotels.', category: 'Budget' },
    { icon: 'doc', title: 'Keep Copies of Documents', body: 'Store digital copies of your passport and visa in offline cloud storage or a USB drive.', category: 'Safety' },
    { icon: 'glass', title: 'Hydrate on Flights', body: 'Cabin air is very dry. Drink water regularly and avoid excess alcohol to beat jet lag.', category: 'Health' },
    { icon: 'plug', title: 'Universal Adapter', body: 'A single universal travel adapter with USB-C covers nearly every country\'s socket type.', category: 'Tech' },
    { icon: 'flag', title: 'Learn Basic Phrases', body: 'Knowing "hello", "thank you", and "help" in the local language goes a long way with locals.', category: 'Culture' },
    { icon: 'calendar', title: 'Arrive Early', body: 'For international flights, reach the airport 3 hours early to absorb unexpected delays.', category: 'Safety' },
    { icon: 'box', title: 'Carry-On Only', body: 'Packing light with carry-on avoids checked baggage fees and lost luggage risk.', category: 'Packing' },
    { icon: 'wallet', title: 'Set a Daily Budget', body: 'Withdraw local cash in weekly chunks and track spending to avoid overshooting your trip budget.', category: 'Budget' },
    { icon: 'run', title: 'Walk to Explore', body: 'Walking neighborhoods reveals hidden gems that tour buses never reach — and it\'s free.', category: 'Budget' },
    { icon: 'food', title: 'Eat Where Locals Do', body: 'Restaurants away from major attractions with local crowds offer authentic food at fair prices.', category: 'Culture' },
    { icon: 'lock', title: 'Use a VPN', body: 'A VPN protects your data on public Wi-Fi and can unlock region-locked services.', category: 'Tech' },
    { icon: 'medkit', title: 'Pack a Med Kit', body: 'Include pain relievers, antihistamines, rehydration salts, and any prescription meds.', category: 'Health' },
    { icon: 'scan', title: 'Scan for Skimmers', body: 'Before using an ATM, tug the card reader. Loose parts may indicate a skimming device.', category: 'Safety' },
    { icon: 'phone', title: 'Offline Maps', body: 'Download maps for offline use before you lose signal — essential in remote areas.', category: 'Tech' },
    { icon: 'shield', title: 'Travel Insurance', body: 'A small policy can save thousands in medical or cancellation emergencies abroad.', category: 'Health' },
    { icon: 'shirt', title: 'Dress Appropriately', body: 'Research local dress codes, especially for religious sites, to show respect and avoid fines.', category: 'Culture' },
  ];

  filtered = () => this.filter
    ? this.allTips.filter(t => t.category === this.filter)
    : this.allTips;

  applyFilter() {}
}
