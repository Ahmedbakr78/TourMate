import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../../../../shared/src/app/shared/shared.module';
import { RoleGuard } from '../../core/guards/role.guard';
import { RoleEnum } from '../../../../../shared/src/app/core/models/enums';

import { AdminDashboardComponent } from './dashboard/admin-dashboard.component';
import { AdminUsersComponent } from './users/admin-users.component';
import { AdminVerificationsComponent } from './verifications/admin-verifications.component';
import { AdminTripManagementComponent } from './trip-management/admin-trip-management.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [RoleGuard],
    data: { roles: [RoleEnum.ADMIN] },
    children: [
      { path: '', component: AdminDashboardComponent },
      { path: 'users', component: AdminUsersComponent },
      { path: 'verifications', component: AdminVerificationsComponent },
      { path: 'trips', component: AdminTripManagementComponent }
    ]
  }
];

@NgModule({
  declarations: [
    AdminDashboardComponent,
    AdminUsersComponent,
    AdminVerificationsComponent,
    AdminTripManagementComponent
  ],
  imports: [SharedModule, RouterModule.forChild(routes)]
})
export class AdminModule { }
