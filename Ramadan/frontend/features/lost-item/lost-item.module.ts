import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { AuthGuard } from 'src/app/core/guards/auth.guard';
import { LostItemListComponent } from './lost-item-list/lost-item-list.component';

const routes: Routes = [
  { path: 'my-items', component: LostItemListComponent, canActivate: [AuthGuard] }
];

@NgModule({
  declarations: [LostItemListComponent],
  imports: [SharedModule, RouterModule.forChild(routes)]
})
export class LostItemModule { }
