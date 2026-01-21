import { Component } from '@angular/core';
import {FormMatComponent} from '../form-mat/form-mat.component'
import {MatlibModule} from '../matlib.module'
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Subject, takeUntil } from 'rxjs';
Component({
  selector: 'app-pages-mat',
  standalone: true,
  imports: [MatlibModule,FormMatComponent],
  templateUrl: './pages-mat.component.html',
  styleUrl: './pages-mat.component.scss'
})
export class PagesMatComponent {

    constructor(breakpointObserver: BreakpointObserver  ) {
    breakpointObserver
    .observe([
      Breakpoints.XSmall,
      Breakpoints.Small,
      Breakpoints.Medium,
      Breakpoints.Large,
      Breakpoints.XLarge,
    ])
    .pipe(takeUntil(this.destroyed))
    .subscribe(result => {
      for (const query of Object.keys(result.breakpoints)) {
        if (result.breakpoints[query]) {
          this.currentScreenSize = this.displayNameMap.get(query) ?? 'Unknown';
        }
      }
    });
  }

  displayNameMap = new Map([
    [Breakpoints.XSmall, 'XSmall'],
    [Breakpoints.Small, 'Small'],
    [Breakpoints.Medium, 'Medium'],
    [Breakpoints.Large, 'Large'],
    [Breakpoints.XLarge, 'XLarge'],
  ]);
  
  ListPage = [
    {id:1,
      
    }
  ]
  destroyed = new Subject<void>();
  currentScreenSize: string = '';

   

}
