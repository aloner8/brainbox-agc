import {ChangeDetectorRef, Component, HostListener, Input, OnInit} from '@angular/core';

import {Observable, Subject} from "rxjs";

import {map} from "rxjs/operators";
import {AppService} from '../app.service'
import { Router , RouterOutlet} from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { VariablesService } from '../variables.service';
import { ApiService } from '../api.service';


@Component({
    selector: 'menu-left',
    templateUrl: './menu-left.component.html',
    styleUrls: ['./menu-left.component.scss']
})
export class MenuLeftComponent implements OnInit {

    @HostListener('window:scroll', ['$event'])
  onWindowScroll(event: Event) {
    console.log('Window scrolled!', event);
    // Perform actions based on scroll position, e.g., show/hide elements
  }
    leftmenuSelected = 'home'
    BaseHref = ''


    HomePage:Subject<any> =  new Subject<any>()  ;
    // currentScreenSize:string;
    // captionlevelfontsize
    RankingSize:string = 'Large';
    cols=2
    lightimg:boolean= false;
    totalNumber = 'large'
    totallabel = 'small'
                                WelcomelabelfontSize ='32px'
                            UserNamelabelfontSize ='25px'
    pathD = 'M51,93.5C51,54.6,82.6,23,121.5,23h372.1c11.6,0,17.4,0,21.8,2.3c3.5,1.9,6.4,4.8,8.3,8.3C526,38,526,43.8,526,55.4v38.1v38.1c0,11.6,0,17.4-2.3,21.8c-1.9,3.5-4.8,6.4-8.3,8.3c-4.4,2.3-10.2,2.3-21.8,2.3H121.5	C82.6,164,51,132.4,51,93.5z';
    constructor(private VarService:VariablesService
               ,private api:ApiService    
    ) {
                
    }

    ngAfterViewInit(): void {
        //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
        //Add 'implements AfterViewInit' to the class.
   //   //  console.log('ngAfterViewInit')
      }

    ngOnInit() {
      const  that = this
   // //  console.log('ngOnInit')
/*       this.Parent.subscribe(function(s){
      //  console.log(s)
        that.leftmenuSelected =s.replace('/','')   
       // that.cd.detectChanges();
      }) */
       
        this.cols=3
        this.BaseHref = this.api.getBaseHref();
        
        this.VarService.AppVars.subscribe(function(vars){

          if(vars['target'] =='MenuLeft'){
            if(vars['eventname'])
              switch (vars['eventname']) {
                case 'VariablesChanging':
              
                  break;
              
                  case "GetUserInfoComplete":
                  //  console.log(vars.users)
                  
                  break;
                  case "SelectIdeaDetail":
                // console.log(vars)
                   // that.VarService.setVariable('MyIdeasSelectID',vars['id'])
                   that.SelectMenu('ideas')  
                    setTimeout(() => {
                     
                      that.VarService.AppVars.next({eventname:'SelectIdeaDetail',target:'Ideas' ,id: vars['id'] })
                    }, 1000);
                    
    
                  /*   setTimeout(() => {
                      that.VarService.AppVars.next(vars)
                    }, 2000); */
                  break;
                case "DirectToIdeaDetail":
                // console.log(vars)
                   // that.VarService.setVariable('MyIdeasSelectID',vars['id'])
                   that.SelectMenu('ideas')  
                    setTimeout(() => {
                     
                      that.VarService.AppVars.next({eventname:'DirectToIdeaDetail',target:'Ideas' ,id: vars['id'] })
                    }, 1000);
                    
    
                  /*   setTimeout(() => {
                      that.VarService.AppVars.next(vars)
                    }, 2000); */
                  break;
                  
                  case "OpenNewIdeas":
                 //  console.log(vars)
                    that.VarService.setVariable('MyIdeasSelectID','OpenNew')
                    that.SelectMenu('ideas') 
                    setTimeout(() => {
                       
                      that.VarService.AppVars.next({eventname:'OpenNewIdeas',target:'Ideas'})
                    }, 1000);
                    
    
                  /*   setTimeout(() => {
                      that.VarService.AppVars.next(vars)
                    }, 2000); */
                  break;   
                  
                default:
                  that.SelectMenu('home' )
                  break;
              }
          }


        })

    }

    SelectMenu(menuname:string){
      if(menuname=='hall-of-fame'){
        setTimeout(() => {
        window.open(this.api.getBaseHref() + '?rewards=2025', '');
        }, 500);
        
      } else {
      this.leftmenuSelected=menuname
      this.VarService.setVariable('LeftMenuSelected',menuname)
      }
      
    }

    getSelect(){
        return this.leftmenuSelected
    }
    getisactiveMenuText(menu:string){
        let _selected = this.leftmenuSelected
       // console.log('isactiveMenuText:' , this.isactiveMenuText , '==' ,menu )
        return _selected.indexOf(menu) >-1 ;
      }
      getNotactiveMenu(menu:string){
        let _selected = this.leftmenuSelected
      ////  console.log('isactiveMenuText:' , this.isactiveMenuText , '==' ,menu )
        return _selected.indexOf(menu) <0;
      }

}
