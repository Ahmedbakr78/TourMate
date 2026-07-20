import { Injectable, signal, effect } from '@angular/core';
import { User } from '../models/user.model';

export type FontSize = 'sm' | 'md' | 'lg';
export type Density = 'comfortable' | 'compact';

@Injectable({ providedIn: 'root' })
export class AppStore {
  sidebarOpen = signal(true);
  theme = signal<'dark' | 'light'>('dark');
  unreadNotifications = signal(0);
  fontSize = signal<FontSize>('md');
  density = signal<Density>('comfortable');
  highContrast = signal(false);
  reduceMotion = signal(false);

  private _user = signal<User | null>(null);
  user = this._user.asReadonly();
  isAuthenticated = () => this._user() !== null;
  userRole = () => this._user()?.role || null;

  constructor() {
    const saved = localStorage.getItem('tm_sidebar');
    if (saved) this.sidebarOpen.set(saved === 'true');
    this.fontSize.set((localStorage.getItem('tm_font') as FontSize) || 'md');
    this.density.set((localStorage.getItem('tm_density') as Density) || 'comfortable');
    this.highContrast.set(localStorage.getItem('tm_contrast') === 'true');
    this.reduceMotion.set(localStorage.getItem('tm_motion') === 'true');
    this.applyAccessibility();
  }

  setUser(user: User | null) { this._user.set(user); }

  toggleSidebar() {
    this.sidebarOpen.update(v => {
      const next = !v;
      localStorage.setItem('tm_sidebar', String(next));
      return next;
    });
  }

  setTheme(t: 'dark' | 'light') {
    this.theme.set(t);
    document.documentElement.setAttribute('data-theme', t);
    localStorage.setItem('tm_theme', t);
  }

  setFontSize(s: FontSize) { this.fontSize.set(s); localStorage.setItem('tm_font', s); this.applyAccessibility(); }
  setDensity(d: Density) { this.density.set(d); localStorage.setItem('tm_density', d); this.applyAccessibility(); }
  toggleContrast() { this.highContrast.update(v => { const n = !v; localStorage.setItem('tm_contrast', String(n)); this.applyAccessibility(); return n; }); }
  toggleMotion() { this.reduceMotion.update(v => { const n = !v; localStorage.setItem('tm_motion', String(n)); this.applyAccessibility(); return n; }); }

  private applyAccessibility() {
    const root = document.documentElement;
    root.setAttribute('data-font', this.fontSize());
    root.setAttribute('data-density', this.density());
    root.classList.toggle('high-contrast', this.highContrast());
    root.classList.toggle('reduce-motion', this.reduceMotion());
  }
}
