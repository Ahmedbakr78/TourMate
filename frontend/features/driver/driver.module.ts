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
import { DriverListComponent } from './driver-list/driver-list.component';
import { DriverOnboardingComponent } from './driver-onboarding/driver-onboarding.component';
import { DriverDashboardComponent } from './driver-dashboard/driver-dashboard.component';
import { SharedModule } from 'src/app/shared/shared.module';

const routes: Routes = [
  { path: '', component: DriverListComponent },
  { path: 'onboarding', component: DriverOnboardingComponent },
  { path: 'dashboard', component: DriverDashboardComponent }
];

@NgModule({
  declarations: [
    DriverListComponent,
    DriverOnboardingComponent,
    DriverDashboardComponent
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
export class DriverModule { }
