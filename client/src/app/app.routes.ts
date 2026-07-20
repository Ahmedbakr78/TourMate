import { Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { ForgotComponent } from './auth/forgot/forgot.component';
import { VerifyEmailComponent } from './auth/verify-email/verify-email.component';
import { ChangePasswordComponent } from './auth/change-password/change-password.component';
import { roleGuard } from './core/guards/role.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', loadComponent: () => import('./auth/login/login.component').then(m => m.LoginComponent) },
  { path: 'register', loadComponent: () => import('./auth/register/register.component').then(m => m.RegisterComponent) },
  { path: 'forgot', loadComponent: () => import('./auth/forgot/forgot.component').then(m => m.ForgotComponent) },
  { path: 'verify-email', loadComponent: () => import('./auth/verify-email/verify-email.component').then(m => m.VerifyEmailComponent) },
  { path: 'change-password', canActivate: [roleGuard(['tourist', 'driver', 'guide', 'admin'])], loadComponent: () => import('./auth/change-password/change-password.component').then(m => m.ChangePasswordComponent) },
  {
    path: 'app',
    component: LayoutComponent,
    children: [
      { path: 'home', loadComponent: () => import('./home/home.component').then(m => m.HomeComponent) },
      {
        path: 'admin',
        canActivate: [roleGuard(['admin'])],
        children: [
          { path: 'dashboard', loadComponent: () => import('./admin/dashboard/dashboard.component').then(m => m.DashboardComponent) },
          { path: 'users', loadComponent: () => import('./admin/user-management/user-management.component').then(m => m.UserManagementComponent) },
          { path: 'guides', loadComponent: () => import('./admin/guide-management/guide-management.component').then(m => m.GuideManagementComponent) },
          { path: 'drivers', loadComponent: () => import('./admin/driver-management/driver-management.component').then(m => m.DriverManagementComponent) },
          { path: 'trips', loadComponent: () => import('./admin/trip-monitoring/trip-monitoring.component').then(m => m.TripMonitoringComponent) },
          { path: 'vehicles', loadComponent: () => import('./admin/vehicle-management/vehicle-management.component').then(m => m.VehicleManagementComponent) },
          { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
        ],
      },
      { path: 'trip/list', canActivate: [roleGuard(['tourist', 'admin'])], loadComponent: () => import('./trip/trip-list/trip-list.component').then(m => m.TripListComponent) },
      { path: 'trip/new', canActivate: [roleGuard(['tourist', 'admin'])], loadComponent: () => import('./trip/trip-new/trip-new.component').then(m => m.TripNewComponent) },
      { path: 'trip/calendar', canActivate: [roleGuard(['tourist', 'admin'])], loadComponent: () => import('./trip/trip-calendar/trip-calendar.component').then(m => m.TripCalendarComponent) },
      { path: 'trip/shared', canActivate: [roleGuard(['tourist', 'admin'])], loadComponent: () => import('./trip/shared-trips/shared-trips.component').then(m => m.SharedTripsComponent) },
      { path: 'trip/:id', canActivate: [roleGuard(['tourist', 'admin'])], loadComponent: () => import('./trip/trip-detail/trip-detail.component').then(m => m.TripDetailComponent) },
      { path: 'tools', canActivate: [roleGuard(['tourist', 'admin'])], loadComponent: () => import('./tools/tools.component').then(m => m.ToolsComponent) },
      { path: 'favorites', canActivate: [roleGuard(['tourist', 'admin'])], loadComponent: () => import('./favorites/favorites.component').then(m => m.FavoritesComponent) },
      { path: 'tips', loadComponent: () => import('./tips/tips.component').then(m => m.TipsComponent) },
      { path: 'places', loadComponent: () => import('./place/place-list/place-list.component').then(m => m.PlaceListComponent) },
      { path: 'places/:id', loadComponent: () => import('./place/place-detail/place-detail.component').then(m => m.PlaceDetailComponent) },
      { path: 'notifications', canActivate: [roleGuard(['tourist', 'driver', 'guide', 'admin'])], loadComponent: () => import('./notification/notification-center/notification-center.component').then(m => m.NotificationCenterComponent) },
      { path: 'lost-items', loadComponent: () => import('./lost-item/lost-item-list/lost-item-list.component').then(m => m.LostItemListComponent) },
      { path: 'profile', loadComponent: () => import('./user/profile/profile.component').then(m => m.ProfileComponent) },
      { path: 'settings', loadComponent: () => import('./settings/settings.component').then(m => m.SettingsComponent) },
      { path: 'change-password', canActivate: [roleGuard(['tourist', 'driver', 'guide', 'admin'])], loadComponent: () => import('./auth/change-password/change-password.component').then(m => m.ChangePasswordComponent) },
      { path: 'driver', canActivate: [roleGuard(['driver'])], loadComponent: () => import('./driver-app/driver-dashboard/driver-dashboard.component').then(m => m.DriverDashboardComponent) },
      { path: 'driver/profile', canActivate: [roleGuard(['driver'])], loadComponent: () => import('./driver-app/driver-profile/driver-profile.component').then(m => m.DriverProfileComponent) },
      { path: 'guide', canActivate: [roleGuard(['guide'])], loadComponent: () => import('./guide-app/guide-dashboard/guide-dashboard.component').then(m => m.GuideDashboardComponent) },
      { path: 'guide/profile', canActivate: [roleGuard(['guide'])], loadComponent: () => import('./guide-app/guide-profile/guide-profile.component').then(m => m.GuideProfileComponent) },
      { path: '', redirectTo: 'home', pathMatch: 'full' },
    ],
  },
  { path: '**', redirectTo: 'login' },
];
