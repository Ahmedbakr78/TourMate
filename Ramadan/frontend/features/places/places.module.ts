import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { PlacesRoutingModule } from './places-routing.module';

import { PlaceListComponent } from './place-list/place-list.component';
import { PlaceDetailComponent } from './place-detail/place-detail.component';
import { PlaceFormComponent } from './place-form/place-form.component';

@NgModule({
  declarations: [
    PlaceListComponent,
    PlaceDetailComponent,
    PlaceFormComponent
  ],
  imports: [
    SharedModule,
    PlacesRoutingModule
  ]
})
export class PlacesModule { }
