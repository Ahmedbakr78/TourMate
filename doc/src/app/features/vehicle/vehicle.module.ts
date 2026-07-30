import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../../../../shared/src/app/shared/shared.module';
import { AuthGuard } from '../../../../../shared/src/app/core/guards/auth.guard';
import { RoleGuard } from '../../../../../shared/src/app/core/guards/role.guard';
import { RoleEnum } from '../../../../../shared/src/app/core/models/enums';
import { VehicleFormComponent } from './vehicle-form/vehicle-form.component';
import { VehicleListComponent } from './vehicle-list/vehicle-list.component';

const routes: Routes = [
  { path: '', component: VehicleListComponent, canActivate: [AuthGuard] },
  { path: 'new', component: VehicleFormComponent, canActivate: [RoleGuard], data: { roles: [RoleEnum.DRIVER, RoleEnum.ADMIN] } }
];

@NgModule({
  declarations: [VehicleFormComponent, VehicleListComponent],
  imports: [SharedModule, RouterModule.forChild(routes)]
})
export class VehicleModule { }
