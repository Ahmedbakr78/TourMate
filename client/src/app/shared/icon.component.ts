import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

export type IconName =
  | 'bag' | 'bank' | 'cash' | 'doc' | 'glass' | 'plug' | 'flag'
  | 'calendar' | 'box' | 'wallet' | 'run' | 'food' | 'lock' | 'medkit'
  | 'scan' | 'phone' | 'shield' | 'shirt' | 'sun' | 'bulb' | 'search'
  | 'heart' | 'wrench' | 'bell' | 'user' | 'gear' | 'menu' | 'home'
  | 'map' | 'trip' | 'share' | 'star' | 'check' | 'x' | 'plus' | 'arrow-right'
  | 'clock' | 'globe' | 'location' | 'image' | 'upload' | 'download'
  | 'eye' | 'trash' | 'edit' | 'filter' | 'sort' | 'refresh' | 'pin' | 'compass';

const PATHS: Record<IconName, { p: string; f?: boolean; s?: boolean }> = {
  bag: { p: 'M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4zM3 6h18M16 10a4 4 0 0 1-8 0' },
  bank: { p: 'M3 21h18M3 10h18M5 6l7-3 7 3M5 10v11M19 10v11M9 10v11M15 10v11' },
  cash: { p: 'M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6' },
  doc: { p: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6M8 13h8M8 17h8M8 9h2' },
  plug: { p: 'M12 22v-5M9 8V2M15 8V2M7 8h10v6a5 5 0 0 1-10 0z' },
  flag: { p: 'M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1zM4 22v-7' },
  calendar: { p: 'M3 4h18v18H3zM3 10h18M8 2v4M16 2v4', f: true },
  box: { p: 'M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16zM3.27 6.96 12 12l8.73-5.04M12 22V12', f: true },
  wallet: { p: 'M21 12V7H5a2 2 0 0 1 0-4h14v4M3 5v14a2 2 0 0 0 2 2h16v-5M18 12a2 2 0 0 0 0 4h1v-4z' },
  run: { p: 'M13 4a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM4 20l4-8 3 2 2 6M11 14l4-3 3 2' },
  food: { p: 'M3 2v7a3 3 0 0 0 6 0V2M6 2v20M16 2c-2 2-3 5-3 9a3 3 0 0 0 6 0c0-4-1-7-3-9zM16 22v-3' },
  lock: { p: 'M5 11h14v10H5zM8 11V7a4 4 0 0 1 8 0v4', f: true },
  medkit: { p: 'M9 2h6a2 2 0 0 1 2 2v2h4a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4V4a2 2 0 0 1 2-2zM9 11h2M11 9v4M13 11h2', f: true },
  scan: { p: 'M3 7V5a2 2 0 0 1 2-2h2M17 3h2a2 2 0 0 1 2 2v2M21 17v2a2 2 0 0 1-2 2h-2M7 21H5a2 2 0 0 1-2-2v-2M3 12h18' },
  phone: { p: 'M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z' },
  shield: { p: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z', f: true },
  shirt: { p: 'M20 6 12 2 4 6l2 4 2-2v12h8V8l2 2 2-4z' },
  sun: { p: 'M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42M12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10z' },
  bulb: { p: 'M9 18h6M10 22h4M12 2a7 7 0 0 0-4 12.7c.6.5 1 1.3 1 2.3h6c0-1 .4-1.8 1-2.3A7 7 0 0 0 12 2z' },
  search: { p: 'M11 11m-8 0a8 8 0 1 0 16 0 8 8 0 1 0-16 0M21 21l-4.35-4.35', s: true },
  heart: { p: 'M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z', f: true },
  wrench: { p: 'M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z' },
  bell: { p: 'M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0' },
  user: { p: 'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z' },
  gear: { p: 'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z' },
  glass: { p: 'M8 22h8M12 11v11M12 11a5 5 0 0 1-5-5c0-3 2-6 5-6s5 3 5 6a5 5 0 0 1-5 5z' },
  menu: { p: 'M3 12h18M3 6h18M3 18h18' },
  home: { p: 'M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2zM9 22V12h6v10' },
  map: { p: 'M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0zM12 10m-3 0a3 3 0 1 0 6 0 3 3 0 1 0-6 0' },
  trip: { p: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6M8 13h8M8 17h8M8 9h2' },
  share: { p: 'M18 5m-3 0a3 3 0 1 0 6 0 3 3 0 1 0-6 0M6 12m-3 0a3 3 0 1 0 6 0 3 3 0 1 0-6 0M18 19m-3 0a3 3 0 1 0 6 0 3 3 0 1 0-6 0M8.59 13.51 15.42 17.49M15.41 6.51 8.59 10.49' },
  star: { p: 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z', f: true },
  check: { p: 'M20 6 9 17l-5-5', s: true },
  x: { p: 'M18 6 6 18M6 6l12 12', s: true },
  plus: { p: 'M12 5v14M5 12h14', s: true },
  'arrow-right': { p: 'M5 12h14M12 5l7 7-7 7' },
  clock: { p: 'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM12 6v6l4 2' },
  globe: { p: 'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z' },
  location: { p: 'M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0zM12 10m-3 0a3 3 0 1 0 6 0 3 3 0 1 0-6 0' },
  image: { p: 'M3 5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2zM8.5 11a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zM21 15l-5-5L5 21' },
  upload: { p: 'M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12' },
  download: { p: 'M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3' },
  eye: { p: 'M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8zM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z' },
  trash: { p: 'M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6' },
  edit: { p: 'M12 20h9M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4z' },
  filter: { p: 'M22 3H2l8 9.46V19l4 2v-8.54z' },
  sort: { p: 'M11 5h10M11 9h7M11 13h4M3 17l3 3 3-3M6 4v16' },
  refresh: { p: 'M21 12a9 9 0 1 1-3-6.7L21 8M21 3v5h-5' },
  pin: { p: 'M12 21s7-6.5 7-12a7 7 0 1 0-14 0c0 5.5 7 12 7 12zM12 10m-2.5 0a2.5 2.5 0 1 0 5 0 2.5 2.5 0 1 0-5 0', f: true },
  compass: { p: 'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM16.24 7.76l-2.12 6.36-6.36 2.12 2.12-6.36z', f: true },
};

@Component({
  selector: 'app-icon',
  standalone: true,
  imports: [CommonModule],
  template: `
    <svg [attr.width]="size" [attr.height]="size" viewBox="0 0 24 24" [attr.stroke]="color"
      [attr.fill]="filled ? color : 'none'" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
      [class.icon-spin]="spin" aria-hidden="true">
      <path [attr.d]="path"></path>
    </svg>
  `,
  styles: [`
    :host { display: inline-flex; line-height: 0; }
    svg { display: block; }
    .icon-spin { animation: icon-spin 1s linear infinite; }
    @keyframes icon-spin { to { transform: rotate(360deg); } }
  `],
})
export class IconComponent implements OnChanges {
  @Input() name: IconName = 'star';
  @Input() size = 20;
  @Input() color = 'currentColor';
  @Input() spin = false;

  path = '';
  filled = false;

  ngOnChanges(_: SimpleChanges) {
    const def = PATHS[this.name] || PATHS['star'];
    this.path = def.p;
    this.filled = !!def.f;
  }
}
