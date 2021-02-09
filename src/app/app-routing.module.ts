import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListSetComponent } from './list-set/list-set.component';


const routes: Routes = [
  {
    path: '', component: ListSetComponent,
    data: { headerTitle: 'To-do List', pageTitle: 'To-do List' },
},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
