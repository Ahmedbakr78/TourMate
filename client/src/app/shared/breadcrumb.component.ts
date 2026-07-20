import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, ActivatedRoute, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { TranslationService } from '../core/services/translation.service';

interface Crumb {
  label: string;
  url: string;
}

const KEY_MAP: Record<string, string> = {
  app: 'ui.app',
  home: 'ui.home',
  admin: 'nav.admin',
  dashboard: 'nav.dashboard',
  users: 'nav.users',
  guides: 'nav.guides',
  drivers: 'nav.drivers',
  trips: 'ui.trips',
  vehicles: 'ui.vehicles',
  'trip': 'ui.trips',
  list: 'ui.list',
  new: 'ui.newTrip',
  calendar: 'nav.calendar',
  shared: 'ui.shared',
  tools: 'ui.tools',
  favorites: 'ui.favorites',
  tips: 'ui.tips',
  places: 'ui.places',
  notifications: 'ui.notifications',
  'lost-items': 'ui.lostFound',
  profile: 'ui.profile',
  settings: 'ui.settings',
  'change-password': 'ui.changePassword',
  driver: 'ui.driver',
  guide: 'ui.guide',
  login: 'ui.login',
  register: 'ui.register',
  forgot: 'ui.forgotPassword',
  'verify-email': 'ui.verifyEmail',
};

@Component({
  selector: 'app-breadcrumb',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <nav class="tm-breadcrumb" aria-label="Breadcrumb">
      <a class="tm-breadcrumb-link" routerLink="/app/home">{{ translation.t('ui.home') }}</a>
      @for (crumb of crumbs; track crumb.url; let last = $last) {
        <span class="tm-breadcrumb-sep" aria-hidden="true">/</span>
        @if (last) {
          <span class="tm-breadcrumb-current">{{ crumb.label }}</span>
        } @else {
          <a class="tm-breadcrumb-link" [routerLink]="crumb.url">{{ crumb.label }}</a>
        }
      }
    </nav>
  `,
  styles: [`
    :host { display: block; }
    .tm-breadcrumb {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 0.4rem;
      font-size: 0.62rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.2em;
      color: var(--tm-muted, #6b7280);
      margin-bottom: 1rem;
    }
    .tm-breadcrumb-sep { opacity: 0.5; }
    .tm-breadcrumb-link {
      color: var(--tm-muted, #6b7280);
      text-decoration: none;
      transition: color 0.15s;
    }
    .tm-breadcrumb-link:hover { color: var(--tm-ink, #111); }
    .tm-breadcrumb-current { color: var(--tm-ink, #111); }
  `],
})
export class BreadcrumbComponent implements OnInit {
  private router = inject(Router);
  translation = inject(TranslationService);
  private activatedRoute = inject(ActivatedRoute);

  crumbs: Crumb[] = [];

  ngOnInit() {
    this.build();
    this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe(() => this.build());
  }

  private build() {
    const url = this.router.url.split('?')[0];
    const segments = url.split('/').filter(Boolean);
    const crumbs: Crumb[] = [];
    let acc = '';
    for (const seg of segments) {
      acc += '/' + seg;
      const key = KEY_MAP[seg];
      let label = key ? this.translation.t(key) : this.humanize(seg);
      if (label.startsWith('ui.')) label = this.translation.t(label);
      crumbs.push({ label, url: acc });
    }
    this.crumbs = crumbs;
  }

  private humanize(seg: string): string {
    if (/^[\w-]*\d[\w-]*$/.test(seg)) return 'ui.details';
    return seg
      .replace(/-/g, ' ')
      .replace(/\b\w/g, (c) => c.toUpperCase());
  }
}
