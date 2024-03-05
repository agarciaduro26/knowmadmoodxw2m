import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListComponent } from './list.component';
import { CommonsLibModule } from '@commons-lib';
import { DialogComponent } from './dialog/dialog.component';


const routes: Routes = [{ path: '', component: ListComponent }];

@NgModule({
  declarations: [ListComponent, DialogComponent],
  imports: [
    RouterModule.forChild(routes),
    CommonsLibModule
  ],
  providers: []
})
export class ListModule { }
