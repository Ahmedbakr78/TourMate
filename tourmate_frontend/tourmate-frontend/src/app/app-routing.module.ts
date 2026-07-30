import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'auth', loadChildren: () => import('./features/auth/auth.module').then(m => m.AuthModule) },
  { path: 'places', loadChildren: () => import('./features/places/places.module').then(m => m.PlacesModule) },
  { path: 'trips', loadChildren: () => import('./features/trips/trips.module').then(m => m.TripsModule) },
  { path: 'profile', loadChildren: () => import('./features/profile/profile.module').then(m => m.ProfileModule) },
  { path: 'drivers', loadChildren: () => import('./features/driver/driver.module').then(m => m.DriverModule) },
  { path: 'guides', loadChildren: () => import('./features/guide/guide.module').then(m => m.GuideModule) },
  { path: 'vehicles', loadChildren: () => import('./features/vehicle/vehicle.module').then(m => m.VehicleModule) },
  { path: 'lost-item', loadChildren: () => import('./features/lost-item/lost-item.module').then(m => m.LostItemModule) },
  { path: 'notifications', loadChildren: () => import('./features/notifications/notifications.module').then(m => m.NotificationsModule) },
  { path: 'admin', loadChildren: () => import('./features/admin/admin.module').then(m => m.AdminModule) },
  { path: 'reviews', loadChildren: () => import('./features/reviews/reviews.module').then(m => m.ReviewsModule) },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
