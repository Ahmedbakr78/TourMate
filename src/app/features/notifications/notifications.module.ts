import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../../../../shared/src/app/shared/shared.module';
import { AuthGuard } from '../../../../../shared/src/app/core/guards/auth.guard';
import { NotificationsComponent } from './notifications.component';

const routes: Routes = [
  { path: '', component: NotificationsComponent, canActivate: [AuthGuard] }
];

@NgModule({
  declarations: [NotificationsComponent],
  imports: [SharedModule, RouterModule.forChild(routes)]
})
export class NotificationsModule { }
