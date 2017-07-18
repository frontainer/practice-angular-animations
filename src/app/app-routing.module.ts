import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component'; // <- 追加

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full', // <- 追加
    children: [
      { // 追加ここから
        path: '',
        pathMatch: 'full',
        component: HomeComponent
      } // 追加ここまで
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }