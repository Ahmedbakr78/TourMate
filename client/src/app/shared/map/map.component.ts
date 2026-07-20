import { Component, ElementRef, viewChild, input, output, afterNextRender, effect, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as L from 'leaflet';

export interface MapMarker {
  id: string;
  lat: number;
  lng: number;
  label?: string;
  icon?: 'place' | 'driver' | 'waypoint';
  color?: string;
}

export interface MapRoute {
  coordinates: [number, number][];
  color?: string;
  dashArray?: string;
}

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="map-wrap">
      <div #mapEl class="map-container" [class.loading]="!mapReady()">
        @if (!mapReady()) {
          <div class="map-loader">
            <div class="spinner"></div>
            <span>Loading map...</span>
          </div>
        }
      </div>
      <div class="map-attribution">OpenStreetMap contributors</div>
    </div>
  `,
  styles: [`
    .map-wrap { position: relative; width: 100%; height: 100%; min-height: 300px; border-radius: 12px; overflow: hidden; }
    .map-container { width: 100%; height: 100%; min-height: 300px; z-index: 1; }
    .map-container.loading { opacity: 0.5; }
    .map-loader { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 0.5rem; color: var(--tm-muted); z-index: 2; }
    .spinner { width: 32px; height: 32px; border: 3px solid var(--glass-border); border-top-color: var(--tm-primary); border-radius: 50%; animation: spin 0.7s linear infinite; }
    @keyframes spin { to { transform: rotate(360deg); } }
    .map-attribution { position: absolute; bottom: 4px; right: 6px; font-size: 0.6rem; color: rgba(255,255,255,0.4); background: rgba(0,0,0,0.4); padding: 2px 6px; border-radius: 4px; z-index: 1000; pointer-events: none; }
  `]
})
export class MapComponent {
  mapEl = viewChild<ElementRef<HTMLDivElement>>('mapEl');
  markers = input<MapMarker[]>([]);
  route = input<MapRoute | null>(null);
  center = input<[number, number]>([30.0444, 31.2357]);
  zoom = input<number>(12);
  clickEnabled = input(false);

  markerClick = output<string>();
  mapClick = output<{ lat: number; lng: number }>();
  mapReady = signal(false);

  private map?: L.Map;
  private layerGroup?: L.LayerGroup;
  private routeLayer?: L.Polyline;

  constructor() {
    afterNextRender(() => this.initMap());

    effect(() => {
      const ms = this.markers();
      if (this.map && ms) this.updateMarkers(ms);
    });

    effect(() => {
      const r = this.route();
      if (this.map && r) this.updateRoute(r);
    });
  }

  private initMap() {
    const el = this.mapEl()?.nativeElement;
    if (!el) return;

    const tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    const attribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>';

    this.map = L.map(el, {
      center: this.center(),
      zoom: this.zoom(),
      zoomControl: true,
      attributionControl: false,
    });

    L.tileLayer(tileUrl, { attribution, maxZoom: 19 }).addTo(this.map);

    this.layerGroup = L.layerGroup().addTo(this.map);

    if (this.clickEnabled()) {
      this.map.on('click', (e: L.LeafletMouseEvent) => {
        this.mapClick.emit({ lat: e.latlng.lat, lng: e.latlng.lng });
      });
    }

    setTimeout(() => this.map?.invalidateSize(), 200);
    this.mapReady.set(true);
    this.updateMarkers(this.markers());
    this.updateRoute(this.route());
  }

  private updateMarkers(markers: MapMarker[]) {
    if (!this.layerGroup) return;
    this.layerGroup.clearLayers();

    markers.forEach(m => {
      const icon = L.divIcon({
        className: 'custom-marker',
        html: this.markerHtml(m),
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      });
      const marker = L.marker([m.lat, m.lng], { icon }).on('click', () => this.markerClick.emit(m.id));
      this.layerGroup!.addLayer(marker);

      if (m.label) {
        const tooltip = L.tooltip({ permanent: false, direction: 'top', offset: [0, -16] })
          .setContent(`<span style="font-size:12px;font-weight:600">${m.label}</span>`);
        marker.bindTooltip(tooltip);
      }
    });
  }

  private markerHtml(m: MapMarker): string {
    const color = m.color || 'var(--tm-primary)';
    const iconSvg = {
      place: `<svg width="18" height="18" viewBox="0 0 24 24" fill="${color}" stroke="#fff" stroke-width="1.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3" fill="#fff"/></svg>`,
      driver: `<svg width="18" height="18" viewBox="0 0 24 24" fill="${color}" stroke="#fff" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><path d="M12 6v12M6 12h12" stroke="#fff" stroke-width="2"/></svg>`,
      waypoint: `<svg width="18" height="18" viewBox="0 0 24 24" fill="${color}" stroke="#fff" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3" fill="#fff"/></svg>`,
    };
    return `<div style="display:flex;align-items:center;justify-content:center;width:32px;height:32px">${iconSvg[m.icon || 'place']}</div>`;
  }

  private updateRoute(route: MapRoute | null) {
    if (this.routeLayer) { this.routeLayer.remove(); this.routeLayer = undefined; }
    if (!route || route.coordinates.length < 2) return;
    this.routeLayer = L.polyline(route.coordinates as any, {
      color: route.color || 'var(--tm-primary)',
      weight: 4,
      opacity: 0.8,
      dashArray: route.dashArray,
      lineCap: 'round',
      lineJoin: 'round',
    }).addTo(this.map!);
  }

  fitBounds(points: [number, number][]) {
    if (!this.map || points.length === 0) return;
    const bounds = L.latLngBounds(points.map(p => L.latLng(p[0], p[1])));
    this.map.fitBounds(bounds, { padding: [40, 40] });
  }

  setView(lat: number, lng: number, zoom?: number) {
    this.map?.setView([lat, lng], zoom);
  }
}
