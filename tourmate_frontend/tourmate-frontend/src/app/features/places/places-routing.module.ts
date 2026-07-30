import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PlaceListComponent } from './place-list/place-list.component';
import { PlaceDetailComponent } from './place-detail/place-detail.component';
import { PlaceFormComponent } from './place-form/place-form.component';
import { AuthGuard } from 'src/app/core/guards/auth.guard';
import { RoleGuard } from 'src/app/core/guards/role.guard';
import { RoleEnum } from 'src/app/core/models/enums';

const routes: Routes = [
  { path: '', component: PlaceListComponent, canActivate: [AuthGuard] },
  { path: 'new', component: PlaceFormComponent, canActivate: [RoleGuard], data: { roles: [RoleEnum.ADMIN, RoleEnum.TOURIST] } },
  { path: ':id/edit', component: PlaceFormComponent, canActivate: [RoleGuard], data: { roles: [RoleEnum.ADMIN, RoleEnum.TOURIST] } },
  { path: ':id', component: PlaceDetailComponent, canActivate: [AuthGuard] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PlacesRoutingModule { }
