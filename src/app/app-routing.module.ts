import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DefaultComponent } from './default/default.component';
import { PolylineComponent } from './polyline/polyline.component';

const routes: Routes = [
  { path: 'default', component: DefaultComponent },
  { path: 'polyline', component: PolylineComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
