import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TripService, Trip } from '../../core/services/trip.service';
import { TranslationService } from '../../core/services/translation.service';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-trip-calendar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="page">
      <div class="page-header">
        <div>
          <h2 style="margin:0">{{ translation.t('ui.calendar') }}</h2>
          <p class="muted" style="margin:0.2rem 0 0">{{ currentMonthName }} {{ currentYear }}</p>
        </div>
        <div class="cal-nav">
          <button class="tm-btn tm-btn-sm tm-btn-outline" (click)="prevMonth()">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
          </button>
          <span class="cal-month-label">{{ currentMonthName }} {{ currentYear }}</span>
          <button class="tm-btn tm-btn-sm tm-btn-outline" (click)="nextMonth()">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
          </button>
        </div>
      </div>

      @if (loading) {
        <div class="tm-loader"></div>
      } @else {
        <div class="calendar-grid">
          <div class="cal-header">
            @for (day of ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']; track day) {
              <div class="cal-day-name">{{ day }}</div>
            }
          </div>
          <div class="cal-body">
            @for (week of weeks; track $index) {
              @for (day of week; track $index) {
                <div class="cal-day" [class.other-month]="!day.isCurrentMonth" [class.today]="day.isToday">
                  <span class="cal-day-num">{{ day.num }}</span>
                  @if (day.trips.length > 0) {
                    <div class="cal-day-trips">
                      @for (t of day.trips.slice(0, 2); track t._id) {
                        <a [routerLink]="['/app/trip', t._id]" class="cal-trip-dot badge badge-{{ t.status.toLowerCase() }}">
                          {{ t.places.length }}p
                        </a>
                      }
                      @if (day.trips.length > 2) {
                        <span class="cal-more">+{{ day.trips.length - 2 }}</span>
                      }
                    </div>
                  }
                </div>
              }
            }
          </div>
        </div>

        @if (monthTrips.length > 0) {
          <div class="section">
            <h3>{{ translation.t('ui.trips') }}</h3>
            <div class="month-trip-list">
              @for (trip of monthTrips; track trip._id) {
                <a [routerLink]="['/app/trip', trip._id]" class="month-trip-card">
                  <span class="badge badge-{{ trip.status.toLowerCase() }}">{{ translation.t('ui.' + trip.status.toLowerCase()) }}</span>
                  <span class="month-trip-dates">{{ trip.startDate | date:'MMM d' }} - {{ trip.endDate | date:'MMM d' }}</span>
                  <span class="month-trip-meta">{{ trip.places.length }} {{ translation.t('ui.places') }} - {{ trip.peopleCount }} people</span>
                  <span class="month-trip-price">\${{ trip.price }}</span>
                </a>
              }
            </div>
          </div>
        }
      }
    </div>
  `,
  styles: [`
    .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; flex-wrap: wrap; gap: 0.5rem; }
    .cal-nav { display: flex; align-items: center; gap: 0.5rem; }
    .cal-month-label { font-weight: 600; font-size: 0.95rem; min-width: 140px; text-align: center; }

    .calendar-grid { background: var(--tm-surface); border: 1px solid var(--glass-border); border-radius: 12px; overflow: hidden; margin-bottom: 1.5rem; }
    .cal-header { display: grid; grid-template-columns: repeat(7, 1fr); }
    .cal-day-name { padding: 0.6rem 0.4rem; text-align: center; font-size: 0.75rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.04em; color: var(--tm-muted); border-bottom: 1px solid var(--glass-border); }
    .cal-body { display: grid; grid-template-columns: repeat(7, 1fr); }
    .cal-day {
      min-height: 90px; padding: 0.4rem; border-right: 1px solid var(--glass-border); border-bottom: 1px solid var(--glass-border);
      position: relative;
    }
    .cal-day:nth-child(7n) { border-right: none; }
    .cal-day.other-month { opacity: 0.25; }
    .cal-day.today .cal-day-num { background: var(--tm-primary); color: #fff; border-radius: 50%; width: 26px; height: 26px; display: flex; align-items: center; justify-content: center; }
    .cal-day-num { font-size: 0.8rem; font-weight: 600; margin-bottom: 0.2rem; display: inline-block; }
    .cal-day-trips { display: flex; flex-direction: column; gap: 0.15rem; }
    .cal-trip-dot { font-size: 0.6rem; padding: 0.1rem 0.3rem; cursor: pointer; text-decoration: none; }
    .cal-more { font-size: 0.65rem; color: var(--tm-muted); }

    .section h3 { margin: 0 0 0.75rem; font-size: 1rem; }
    .month-trip-list { display: flex; flex-direction: column; gap: 0.4rem; }
    .month-trip-card {
      display: flex; align-items: center; gap: 0.75rem;
      background: var(--tm-surface); border: 1px solid var(--glass-border); border-radius: 10px;
      padding: 0.75rem 1rem; text-decoration: none; color: inherit; transition: all 0.15s;
    }
    .month-trip-card:hover { background: var(--tm-surface-raised); }
    .month-trip-dates { flex: 1; font-size: 0.85rem; }
    .month-trip-meta { font-size: 0.8rem; color: var(--tm-muted); }
    .month-trip-price { font-weight: 700; color: var(--tm-primary); }
  `]
})
export class TripCalendarComponent implements OnInit {
  private tripService = inject(TripService);
  translation = inject(TranslationService);
  private toast = inject(ToastService);
  trips: Trip[] = [];
  loading = true;

  currentMonth = new Date().getMonth();
  currentYear = new Date().getFullYear();

  get currentMonthName() {
    return new Date(this.currentYear, this.currentMonth).toLocaleString('default', { month: 'long' });
  }

  get monthTrips() {
    return this.trips.filter(t => {
      const d = new Date(t.startDate);
      return d.getMonth() === this.currentMonth && d.getFullYear() === this.currentYear;
    });
  }

  get weeks() {
    const firstDay = new Date(this.currentYear, this.currentMonth, 1);
    const lastDay = new Date(this.currentYear, this.currentMonth + 1, 0);
    const startPadding = firstDay.getDay();
    const totalDays = lastDay.getDate();
    const weeks: { num: number; isCurrentMonth: boolean; isToday: boolean; trips: Trip[] }[][] = [];
    let week: { num: number; isCurrentMonth: boolean; isToday: boolean; trips: Trip[] }[] = [];

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 0; i < startPadding; i++) {
      const prevDate = new Date(this.currentYear, this.currentMonth, -startPadding + i + 1);
      week.push({ num: prevDate.getDate(), isCurrentMonth: false, isToday: false, trips: [] });
    }

    for (let d = 1; d <= totalDays; d++) {
      const date = new Date(this.currentYear, this.currentMonth, d);
      const isToday = date.getTime() === today.getTime();
      const tripsOnDay = this.trips.filter(t => {
        const start = new Date(t.startDate);
        const end = new Date(t.endDate);
        start.setHours(0, 0, 0, 0);
        end.setHours(23, 59, 59, 999);
        return date >= start && date <= end;
      });
      week.push({ num: d, isCurrentMonth: true, isToday, trips: tripsOnDay });
      if (week.length === 7) {
        weeks.push(week);
        week = [];
      }
    }

    if (week.length > 0) {
      const remaining = 7 - week.length;
      for (let i = 1; i <= remaining; i++) {
        week.push({ num: i, isCurrentMonth: false, isToday: false, trips: [] });
      }
      weeks.push(week);
    }

    return weeks;
  }

  prevMonth() {
    if (this.currentMonth === 0) { this.currentMonth = 11; this.currentYear--; }
    else { this.currentMonth--; }
  }

  nextMonth() {
    if (this.currentMonth === 11) { this.currentMonth = 0; this.currentYear++; }
    else { this.currentMonth++; }
  }

  ngOnInit() {
    this.tripService.getMyTrips().subscribe({
      next: (res) => { this.trips = res.data || []; this.loading = false; },
      error: () => { this.loading = false; this.toast.error('Failed to load trips'); },
    });
  }
}
