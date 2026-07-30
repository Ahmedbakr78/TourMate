import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject, Subscription, debounceTime, distinctUntilChanged } from 'rxjs';
import { GuideService } from '../../../core/services/guide.service';
import { IGuide } from '../../../core/models/guide.model';

@Component({
  selector: 'app-guide-list',
  template: `
    <div class="page-header">
      <h1>Guides</h1>
      <a mat-raised-button color="primary" routerLink="/guides/become-a-guide">Become a guide</a>
    </div>

    <div class="filters">
      <mat-form-field appearance="outline">
        <mat-label>Filter by language</mat-label>
        <input matInput [(ngModel)]="languageFilter" (ngModelChange)="onFilterInput()" placeholder="English, Arabic...">
      </mat-form-field>
    </div>

    <app-loading *ngIf="loading"></app-loading>

    <div class="grid" *ngIf="!loading">
      <mat-card *ngFor="let guide of guides" class="guide-card">
        <h3>{{ guide.languages.join(', ') }}</h3>
        <p>{{ guide.experience }} years experience &middot; Rating: {{ guide.rating || 'N/A' }}</p>
        <mat-chip [color]="guide.verificationStatus === 'approved' ? 'primary' : 'warn'" selected>
          {{ guide.verificationStatus }}
        </mat-chip>
      </mat-card>
      <p *ngIf="guides.length === 0" class="empty">No guides match your filter.</p>
    </div>
  `,
  styles: [`
    .page-header { display: flex; justify-content: space-between; align-items: center; padding: 1.5rem 1.5rem 0; }
    .filters { padding: 0.5rem 1.5rem 0; }
    .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 1rem; padding: 1rem 1.5rem 1.5rem; }
    .empty { color: #888; }
  `]
})
export class GuideListComponent implements OnInit, OnDestroy {

  guides: IGuide[] = [];
  loading = false;
  languageFilter = '';

  private filterChange$ = new Subject<void>();
  private filterSub?: Subscription;

  constructor(private guideService: GuideService, private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.loadGuides();

    this.filterSub = this.filterChange$.pipe(
      debounceTime(400),
      distinctUntilChanged()
    ).subscribe(() => this.loadGuides());
  }

  ngOnDestroy(): void {
    this.filterSub?.unsubscribe();
  }

  onFilterInput(): void {
    this.filterChange$.next();
  }

  loadGuides(): void {
    this.loading = true;

    const request$ = this.languageFilter
      ? this.guideService.searchGuides({ language: this.languageFilter, page: 1, limit: 20 })
      : this.guideService.getGuides(1, 20);

    request$.subscribe({
      next: res => {
        this.loading = false;
        this.guides = res.data?.docs ?? [];
      },
      error: err => {
        this.loading = false;
        this.snackBar.open(err?.error?.error?.message || 'Failed to load guides', 'Close', { duration: 4000 });
      }
    });
  }
}
