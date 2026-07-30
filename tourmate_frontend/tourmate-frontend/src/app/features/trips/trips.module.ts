import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { TripsRoutingModule } from './trips-routing.module';

import { TripBuilderComponent } from './trip-builder/trip-builder.component';
import { MyTripsComponent } from './my-trips/my-trips.component';
import { TripDetailComponent } from './trip-detail/trip-detail.component';
import { SharedTripComponent } from './shared-trip/shared-trip.component';
import { PaymentComponent } from './payment/payment.component';

@NgModule({
  declarations: [
    TripBuilderComponent,
    MyTripsComponent,
    TripDetailComponent,
    SharedTripComponent,
    PaymentComponent
  ],
  imports: [
    SharedModule,
    TripsRoutingModule
  ]
})
export class TripsModule { }
