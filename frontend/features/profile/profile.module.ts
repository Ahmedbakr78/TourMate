import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { AuthGuard } from 'src/app/core/guards/auth.guard';
import { ProfileComponent } from './profile.component';

const routes: Routes = [
  { path: '', component: ProfileComponent, canActivate: [AuthGuard] }
];

@NgModule({
  declarations: [ProfileComponent],
  imports: [SharedModule, RouterModule.forChild(routes)]
})
export class ProfileModule { }
