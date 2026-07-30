import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PlaceService } from 'src/app/core/services/place.service';

@Component({
  selector: 'app-place-form',
  templateUrl: './place-form.component.html',
  styleUrls: ['./place-form.component.scss']
})
export class PlaceFormComponent implements OnInit {

  isEdit = false;
  placeId: string | null = null;
  loading = false;
  saving = false;

  pickedLat?: number;
  pickedLng?: number;

  form = this.fb.group({
    osmId: [null as number | null, Validators.required],
    name: ['', Validators.required],
    city: ['', Validators.required],
    category: ['', Validators.required],
    description: [''],
    price: [null as number | null]
  });

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private placeService: PlaceService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.placeId = this.route.snapshot.paramMap.get('id');
    this.isEdit = !!this.placeId;

    if (this.isEdit && this.placeId) {
      this.loading = true;
      this.placeService.getPlaceById(this.placeId).subscribe({
        next: res => {
          this.loading = false;
          const place = res.data;
          if (!place) return;
          this.form.patchValue({
            osmId: place.osmId,
            name: place.name,
            city: place.city,
            category: place.category,
            description: place.description,
            price: place.price ?? null
          });
          this.pickedLng = place.coordinates?.coordinates?.[0];
          this.pickedLat = place.coordinates?.coordinates?.[1];
          // osmId cannot be changed once created
          this.form.get('osmId')?.disable();
        },
        error: err => {
          this.loading = false;
          this.snackBar.open(err?.error?.error?.message || 'Failed to load place', 'Close', { duration: 4000 });
        }
      });
    }
  }

  onLocationPicked(point: { lat: number; lng: number }): void {
    this.pickedLat = point.lat;
    this.pickedLng = point.lng;
  }

  onSubmit(): void {
    if (this.form.invalid || this.pickedLat == null || this.pickedLng == null) {
      this.snackBar.open('Pick a location on the map first.', 'Close', { duration: 3000 });
      return;
    }
    this.saving = true;

    const raw = this.form.getRawValue();
    const coordinates = { type: 'Point' as const, coordinates: [this.pickedLng, this.pickedLat] as [number, number] };

    if (this.isEdit && this.placeId) {
      this.placeService.updatePlace(this.placeId, {
        name: raw.name!, city: raw.city!, category: raw.category!,
        description: raw.description ?? undefined, price: raw.price ?? undefined, coordinates
      }).subscribe({
        next: () => {
          this.saving = false;
          this.snackBar.open('Place updated', 'Close', { duration: 3000 });
          this.router.navigate(['/places', this.placeId]);
        },
        error: err => {
          this.saving = false;
          this.snackBar.open(err?.error?.error?.message || 'Update failed', 'Close', { duration: 4000 });
        }
      });
    } else {
      this.placeService.createPlace({
        osmId: raw.osmId!, name: raw.name!, city: raw.city!, category: raw.category!,
        description: raw.description ?? undefined, price: raw.price ?? undefined, coordinates
      }).subscribe({
        next: res => {
          this.saving = false;
          this.snackBar.open('Place created', 'Close', { duration: 3000 });
          this.router.navigate(['/places', res.data?._id]);
        },
        error: err => {
          this.saving = false;
          this.snackBar.open(err?.error?.error?.message || 'Creation failed', 'Close', { duration: 4000 });
        }
      });
    }
  }
}
