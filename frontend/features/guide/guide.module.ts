import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { GuideListComponent } from './guide-list/guide-list.component';
import { GuideOnboardingComponent } from './guide-onboarding/guide-onboarding.component';
import { GuideDashboardComponent } from './guide-dashboard/guide-dashboard.component';
import { SharedModule } from 'src/app/shared/shared.module';

const routes: Routes = [
  { path: '', component: GuideListComponent },
  { path: 'onboarding', component: GuideOnboardingComponent },
  { path: 'dashboard', component: GuideDashboardComponent }
];

@NgModule({
  declarations: [
    GuideListComponent,
    GuideOnboardingComponent,
    GuideDashboardComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    SharedModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatProgressSpinnerModule
  ]
})
export class GuideModule { }
