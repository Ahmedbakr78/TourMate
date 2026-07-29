import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject, Subscription, debounceTime, distinctUntilChanged } from 'rxjs';
import { PlaceService } from 'src/app/core/services/place.service';
import { IPlace } from 'src/app/core/models/place.model';
import { AuthService } from 'src/app/core/services/auth.service';
import { RoleEnum } from 'src/app/core/models/enums';

@Component({
  selector: 'app-place-list',
  templateUrl: './place-list.component.html',
  styleUrls: ['./place-list.component.scss']
})
export class PlaceListComponent implements OnInit, OnDestroy {

  places: IPlace[] = [];
  loading = false;
  page = 1;
  limit = 9;
  totalDocs = 0;

  cityFilter = '';
  categoryFilter = '';

  roleEnum = RoleEnum;

  private filterChange$ = new Subject<void>();
  private filterSub?: Subscription;

  constructor(
    private placeService: PlaceService,
    private snackBar: MatSnackBar,
    public authService: AuthService
  ) { }

  ngOnInit(): void {
    this.loadPlaces();

    // Debounce so we don't fire a request on every keystroke
    this.filterSub = this.filterChange$.pipe(
      debounceTime(400),
      distinctUntilChanged()
    ).subscribe(() => {
      this.page = 1;
      this.loadPlaces();
    });
  }

  ngOnDestroy(): void {
    this.filterSub?.unsubscribe();
  }

  onFilterInput(): void {
    this.filterChange$.next();
  }

  loadPlaces(): void {
    this.loading = true;

    const hasFilters = !!(this.cityFilter || this.categoryFilter);

    const request$ = hasFilters
      ? this.placeService.searchPlaces({
          city: this.cityFilter || undefined,
          category: this.categoryFilter || undefined,
          page: this.page,
          limit: this.limit
        })
      : this.placeService.getPlaces(this.page, this.limit);

    request$.subscribe({
      next: res => {
        this.loading = false;
        this.places = res.data?.docs ?? [];
        this.totalDocs = res.data?.totalDocs ?? 0;
      },
      error: err => {
        this.loading = false;
        this.snackBar.open(err?.error?.error?.message || 'Failed to load places', 'Close', { duration: 4000 });
      }
    });
  }

  onPageChange(event: { pageIndex: number; pageSize: number }): void {
    this.page = event.pageIndex + 1;
    this.limit = event.pageSize;
    this.loadPlaces();
  }
}
