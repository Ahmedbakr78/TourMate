import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TripService } from '../../../core/services/trip.service';
import { PlaceService } from '../../../core/services/place.service';
import { GuideService } from '../../../core/services/guide.service';
import { DriverService } from '../../../core/services/driver.service';
import { VehicleService } from '../../../core/services/vehicle.service';
import { IPlace } from '../../../core/models/place.model';
import { IGuide } from '../../../core/models/guide.model';
import { IDriver } from '../../../core/models/driver.model';
import { IVehicle } from '../../../core/models/vehicle.model';

@Component({
  selector: 'app-trip-builder',
  templateUrl: './trip-builder.component.html',
  styleUrls: ['./trip-builder.component.scss']
})
export class TripBuilderComponent implements OnInit {

  loadingOptions = false;
  saving = false;

  availablePlaces: IPlace[] = [];
  availableGuides: IGuide[] = [];
  availableDrivers: IDriver[] = [];
  availableVehicles: IVehicle[] = [];

  selectedPlaceIds: string[] = [];

  form = this.fb.group({
    startDate: [null as Date | null, Validators.required],
    endDate: [null as Date | null, Validators.required],
    peopleCount: [1, [Validators.required, Validators.min(1)]],
    guideId: [null as string | null],
    driverId: [null as string | null],
    vehicleId: [null as string | null]
  });

  constructor(
    private fb: FormBuilder,
    private tripService: TripService,
    private placeService: PlaceService,
    private guideService: GuideService,
    private driverService: DriverService,
    private vehicleService: VehicleService,
    private router: Router,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.loadingOptions = true;
    this.placeService.getPlaces(1, 50).subscribe(res => (this.availablePlaces = res.data?.docs ?? []));
    this.guideService.getGuides(1, 50).subscribe(res => (this.availableGuides = res.data?.docs ?? []));
    this.driverService.getDrivers(1, 50).subscribe({
      next: res => (this.availableDrivers = (res.data as any)?.docs ?? (res.data as IDriver[]) ?? []),
      error: () => { }
    });
    this.vehicleService.getVehicles(1, 50).subscribe({
      next: res => {
        this.availableVehicles = res.data?.docs ?? [];
        this.loadingOptions = false;
      },
      error: () => (this.loadingOptions = false)
    });
  }

  togglePlace(id: string): void {
    const index = this.selectedPlaceIds.indexOf(id);
    if (index >= 0) {
      this.selectedPlaceIds.splice(index, 1);
    } else {
      this.selectedPlaceIds.push(id);
    }
  }

  isSelected(id: string): boolean {
    return this.selectedPlaceIds.includes(id);
  }

  get estimatedCost(): number {
    return this.availablePlaces
      .filter(p => this.selectedPlaceIds.includes(p._id))
      .reduce((sum, p) => sum + (p.price ?? 0), 0);
  }

  get selectedPlaceMarkers(): { lat: number; lng: number; label?: string }[] {
    return this.availablePlaces
      .filter(p => this.selectedPlaceIds.includes(p._id) && p.coordinates?.coordinates)
      .map(p => ({ lat: p.coordinates.coordinates[1], lng: p.coordinates.coordinates[0], label: p.name }));
  }

  onSubmit(): void {
    if (this.form.invalid || this.selectedPlaceIds.length === 0) {
      this.snackBar.open('Pick at least one place and fill in the required fields.', 'Close', { duration: 4000 });
      return;
    }

    this.saving = true;
    const raw = this.form.getRawValue();

    this.tripService.createTrip({
      places: this.selectedPlaceIds,
      startDate: new Date(raw.startDate!).toISOString(),
      endDate: new Date(raw.endDate!).toISOString(),
      peopleCount: raw.peopleCount!,
      guideId: raw.guideId ?? undefined,
      driverId: raw.driverId ?? undefined,
      vehicleId: raw.vehicleId ?? undefined
    }).subscribe({
      next: res => {
        this.saving = false;
        this.snackBar.open('Trip created as a draft!', 'Close', { duration: 3000 });
        this.router.navigate(['/trips', res.data?._id]);
      },
      error: err => {
        this.saving = false;
        this.snackBar.open(err?.error?.error?.message || 'Failed to create trip', 'Close', { duration: 4000 });
      }
    });
  }
}
