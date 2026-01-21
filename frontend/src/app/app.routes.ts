import { Routes,ActivatedRoute, RouterModule } from '@angular/router';
import {AppComponent} from './app.component'
import {RewardsComponent} from './rewards.component'
import { NgModule } from '@angular/core';
export const routes: Routes = [
    {
      path: "",
      component: AppComponent
  
  },
      {
          path: "home",
          component: AppComponent
  
      },
        {
          path: "rewards",
          component: RewardsComponent
  
      },
      /* {
          path: "**",
          redirectTo: '/'
      } */
    ];
      
      @NgModule({
        imports: [RouterModule.forRoot(routes)],
        exports: [RouterModule]
      })
      export class AppRoutingModule { }