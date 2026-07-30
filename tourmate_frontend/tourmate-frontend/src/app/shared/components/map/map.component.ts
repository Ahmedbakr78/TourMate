import { Component, ElementRef, EventEmitter, Input, OnChanges, OnDestroy, AfterViewInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import * as L from 'leaflet';

export interface IMapMarker {
  lat: number;
  lng: number;
  label?: string;
}

// Leaflet's default marker icon paths break under Angular/webpack bundling -
// point them at the copies of leaflet's own images we ship via angular.json's
// assets config (node_modules/leaflet/dist/images -> assets/leaflet/).
const defaultIcon = L.icon({
  iconUrl: 'assets/leaflet/marker-icon.png',
  iconRetinaUrl: 'assets/leaflet/marker-icon-2x.png',
  shadowUrl: 'assets/leaflet/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});
L.Marker.prototype.options.icon = defaultIcon;

/**
 * Free OpenStreetMap-based map, matching the SRS's "Leaflet.js (OpenStreetMap map
 * rendering)" requirement. No API key needed - the OSM tile server is free for
 * reasonable usage under their tile usage policy.
 *
 * mode="picker": tap the map (or use "current location") to choose a single point.
 * mode="view": read-only, shows one marker (lat/lng) or several (markers[]).
 */
@Component({
  selector: 'app-map',
  template: `
    <div class="map-wrapper">
      <button
        type="button"
        mat-stroked-button
        class="locate-btn"
        *ngIf="mode === 'picker'"
        (click)="useCurrentLocation()"
        [disabled]="locating">
        <mat-icon>{{ locating ? 'hourglass_top' : 'my_location' }}</mat-icon>
        {{ locating ? 'Locating...' : 'Use my current location' }}
      </button>
      <div #mapContainer class="map-container" [style.height]="height"></div>
      <p class="picker-hint" *ngIf="mode === 'picker'">Tap the map to fine-tune the exact spot.</p>
    </div>
  `,
  styles: [`
    .map-wrapper { display: flex; flex-direction: column; gap: 0.5rem; }
    .map-container { width: 100%; border-radius: 10px; overflow: hidden; border: 1px solid #e0ddd6; }
    .locate-btn { align-self: flex-start; }
    .picker-hint { margin: 0; font-size: 0.78rem; color: #8a8378; }
  `]
})
export class MapComponent implements AfterViewInit, OnChanges, OnDestroy {

  @Input() mode: 'picker' | 'view' = 'view';
  @Input() lat?: number;
  @Input() lng?: number;
  @Input() markers: IMapMarker[] = [];
  @Input() height = '280px';
  @Input() zoom = 13;

  @Output() locationSelected = new EventEmitter<{ lat: number; lng: number }>();

  @ViewChild('mapContainer') mapContainerRef!: ElementRef<HTMLDivElement>;

  locating = false;

  private map?: L.Map;
  private activeMarker?: L.Marker;
  private viewMarkers: L.Marker[] = [];
  private viewInitialized = false;

  // Cairo - sensible default center when nothing else is known yet
  private static readonly DEFAULT_CENTER: L.LatLngTuple = [30.0444, 31.2357];

  ngAfterViewInit(): void {
    const center: L.LatLngTuple = this.lat != null && this.lng != null
      ? [this.lat, this.lng]
      : MapComponent.DEFAULT_CENTER;

    this.map = L.map(this.mapContainerRef.nativeElement).setView(center, this.zoom);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19
    }).addTo(this.map);

    if (this.mode === 'picker') {
      if (this.lat != null && this.lng != null) {
        this.placePickerMarker(this.lat, this.lng);
      }
      this.map.on('click', (e: L.LeafletMouseEvent) => {
        this.placePickerMarker(e.latlng.lat, e.latlng.lng);
        this.locationSelected.emit({ lat: e.latlng.lat, lng: e.latlng.lng });
      });
    } else {
      this.renderViewMarkers();
    }

    this.viewInitialized = true;

    // Leaflet sizes itself based on the container's dimensions at creation time;
    // if the container was hidden (e.g. inside a not-yet-active mat-tab), fix it up shortly after.
    setTimeout(() => this.map?.invalidateSize(), 200);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!this.viewInitialized || !this.map) return;

    if (this.mode === 'view' && (changes['markers'] || changes['lat'] || changes['lng'])) {
      this.renderViewMarkers();
    }

    if (this.mode === 'picker' && (changes['lat'] || changes['lng']) && this.lat != null && this.lng != null) {
      this.placePickerMarker(this.lat, this.lng, /*recenter*/ true);
    }
  }

  ngOnDestroy(): void {
    this.map?.remove();
  }

  useCurrentLocation(): void {
    if (!navigator.geolocation) {
      this.locating = false;
      return;
    }
    this.locating = true;
    navigator.geolocation.getCurrentPosition(
      position => {
        this.locating = false;
        const { latitude, longitude } = position.coords;
        this.placePickerMarker(latitude, longitude, /*recenter*/ true);
        this.locationSelected.emit({ lat: latitude, lng: longitude });
      },
      () => {
        this.locating = false;
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }

  private placePickerMarker(lat: number, lng: number, recenter = false): void {
    if (!this.map) return;

    if (this.activeMarker) {
      this.activeMarker.setLatLng([lat, lng]);
    } else {
      this.activeMarker = L.marker([lat, lng], { draggable: true }).addTo(this.map);
      this.activeMarker.on('dragend', () => {
        const pos = this.activeMarker!.getLatLng();
        this.locationSelected.emit({ lat: pos.lat, lng: pos.lng });
      });
    }

    if (recenter) {
      this.map.setView([lat, lng], Math.max(this.map.getZoom(), this.zoom));
    }
  }

  private renderViewMarkers(): void {
    if (!this.map) return;

    this.viewMarkers.forEach(m => m.remove());
    this.viewMarkers = [];

    const points: IMapMarker[] = this.markers.length
      ? this.markers
      : (this.lat != null && this.lng != null ? [{ lat: this.lat, lng: this.lng }] : []);

    if (points.length === 0) return;

    points.forEach(point => {
      const marker = L.marker([point.lat, point.lng]).addTo(this.map!);
      if (point.label) marker.bindPopup(point.label);
      this.viewMarkers.push(marker);
    });

    if (points.length === 1) {
      this.map.setView([points[0].lat, points[0].lng], this.zoom);
    } else {
      const bounds = L.latLngBounds(points.map(p => [p.lat, p.lng] as L.LatLngTuple));
      this.map.fitBounds(bounds, { padding: [30, 30] });
    }
  }
}
