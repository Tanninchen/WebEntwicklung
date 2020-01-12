import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ConfigurationComponent } from './configuration/configuration.component';
import { ViewComponent } from './view/view.component';
import { HomeComponent } from './home/home.component';


const routes: Routes = [
  {path: 'configuration', component: ConfigurationComponent},
  {path: 'view', component: ViewComponent},
  {path: '**', component: HomeComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
