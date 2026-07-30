import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TripBuilderComponent } from './trip-builder/trip-builder.component';
import { MyTripsComponent } from './my-trips/my-trips.component';
import { TripDetailComponent } from './trip-detail/trip-detail.component';
import { SharedTripComponent } from './shared-trip/shared-trip.component';
import { PaymentComponent } from './payment/payment.component';
import { AuthGuard } from '../../../../../shared/src/app/core/guards/auth.guard';

const routes: Routes = [
  { path: 'builder', component: TripBuilderComponent, canActivate: [AuthGuard] },
  { path: 'my-trips', component: MyTripsComponent, canActivate: [AuthGuard] },
  { path: 'shared', component: SharedTripComponent, canActivate: [AuthGuard] },
  { path: 'payment/:id', component: PaymentComponent, canActivate: [AuthGuard] },
  { path: ':id', component: TripDetailComponent, canActivate: [AuthGuard] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TripsRoutingModule { }
