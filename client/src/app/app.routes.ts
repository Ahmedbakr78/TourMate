import { Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { ForgotComponent } from './auth/forgot/forgot.component';
import { DashboardComponent } from './admin/dashboard/dashboard.component';
import { UserManagementComponent } from './admin/user-management/user-management.component';
import { TripMonitoringComponent } from './admin/trip-monitoring/trip-monitoring.component';
import { roleGuard } from './core/guards/role.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'forgot', component: ForgotComponent },
  {
    path: 'app',
    component: LayoutComponent,
    children: [
      {
        path: 'admin',
        canActivate: [roleGuard(['admin'])],
        children: [
          { path: 'dashboard', component: DashboardComponent },
          { path: 'users', component: UserManagementComponent },
          { path: 'trips', component: TripMonitoringComponent },
          { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
        ],
      },
    ],
  },
  { path: '**', redirectTo: 'login' },
];
