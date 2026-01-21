import { Component,AfterViewInit, HostListener } from '@angular/core';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { ApiService } from './api.service';
import { VariablesService } from './variables.service';
import { DeviceDetectorService, OS } from 'ngx-device-detector';
import { SnackBarService } from './snack-bar/snack-bar.service';
import { BreakpointObserver } from '@angular/cdk/layout';
import { Subject } from 'rxjs';
import { UserService } from './user/user.service';
import { Router  } from '@angular/router';
import { MatIconRegistry } from "@angular/material/icon";
import { DomSanitizer } from "@angular/platform-browser";
import { datalist } from './forms/dialogs/confirm-status-dialog.component';

export interface Tile {
  color: string;
  cols: number;
  rows: number;
  text: string;
}

@Component({
  selector: 'app-rewards',
  templateUrl: './rewards.component.html',
  styleUrls: ['./rewards.component.scss'],
 
  
})
export class RewardsComponent {



  constructor(private breakpointObserver: BreakpointObserver
    ,private deviceService: DeviceDetectorService
    ,private api:ApiService               
              ,private snackBar: SnackBarService
              ,private localVar:VariablesService 
              ,private user:UserService
              ,private router_active:ActivatedRoute
              ,private router:Router
              ,private matIconRegistry: MatIconRegistry,
              private domSanitizer: DomSanitizer
    ) {
      const _app=this
      router_active.queryParams.subscribe(function(s){
    console.log(s)

      /*   if(s['year']){
          
          setTimeout(() => {

            localVar.AppVars.next({eventname:'DirectToIdeaDetail', target:'MenuLeft', id:s['year']})
            router.navigate([_app.BaseHref])
            
          }, 2000);
        } else {
          setTimeout(() => {
            router.navigate([_app.BaseHref])
          }, 2000);
        } */
      })

      this.matIconRegistry.addSvgIcon(
        "iconJpg",
        this.domSanitizer.bypassSecurityTrustResourceUrl(_app.BaseHref + "assets/img/ICON - jpg-1523.svg")
      );
      this.matIconRegistry.addSvgIcon(
        "iconExcel",
        this.domSanitizer.bypassSecurityTrustResourceUrl(_app.BaseHref + "assets/img/ICON - excel-4954.svg")
      );

    }

    title = 'ttsMat';
    AppConfig = this.api.getAppConfig();
    BaseHref = this.api.getBaseHref();
    UserInfo = {};
    ConnectServerApi =false;
    UserAutherized =false;
    deviceInfo:any;
    show_main_rewards = true;
    show_sub_rewards =[false,false,false]; 
    Me:Subject<any> = new Subject();

      checklistSelection :any
    
      fristLoad =true;
      list_years :datalist[] =[]
      select_year :datalist=this.list_years[0];
    rewardsOfYear:any ={};      
    root_rewards:any =[];      
     sub_rewards:any =[];  
    CaptionRewards = '';
  currentScreenSize: string = 'Small';
  tiles: Tile[] = [
    {text: 'One', cols: 3, rows: 1, color: 'lightblue'},
    {text: 'Two', cols: 1, rows: 2, color: 'lightgreen'},
    {text: 'Three', cols: 1, rows: 1, color: 'lightpink'},
    {text: 'Four', cols: 2, rows: 1, color: '#DDBDF1'},
  ];

  typesOfPage: any = [{Caption: "WWW Page" , PageType:1 }
    ,{Caption: "One Form" , PageType:2 }
    ,{Caption: "Multi Form with Tab" , PageType:3 }
    ,{Caption: "Multi Form with Expansion Panel" , PageType:4 }
    ,{Caption: "Multi Form with Stepper" , PageType:5 }
    ,{Caption: "Multi Form with Gellary" , PageType:6 }
  ];

  ngAfterOnInit(){
   
  }

  
  ngOnInit()  {
    const _this = this
    this.getListYear()
  this.select_year = this.list_years[0];
    this.getStructureOfYear(new Date().getFullYear().toString()).then(function(_rewards:any){
  console.log('_rewards:',_rewards)
  _this.rewardsOfYear = _rewards;
  _this.root_rewards = Object.keys(_rewards);
  _this.sub_rewards = _rewards[_this.root_rewards[0]];
 _this.select_year= _this.list_years.filter(function(y){ return y.value == new Date().getFullYear()  })[0];
  //_this.CaptionRewards= _this.getSubRewardsTitle(0) + ' ' + _this.select_year.value.toString();
  
 })
     
  }
getListYear(){
    const _this = this
    this.api.Query('select hof_year from hof_entry order by hof_year',[]  ).subscribe(function(rows:any){
      console.log('getListYear:',rows)
          if(rows){
              let _years = rows
               _this.list_years = []
              _years.forEach((_year:any) => {
                let _year_data:datalist = {value:_year.hof_year , display: _year.hof_year ,object:_year  }
                _this.list_years.push( _year_data)
              });
              console.log('list_years:',_this.list_years)
          } else{
            /* _table.snackBar.openSnackBar( 'not found user data!!',
              'OK', 'center', 'top', 'snack-style'); */
          }
    })
  }

    getStructureOfYear(year:string){
    const _this = this
    return   new Promise((resolve, reject) => {
    this.api.Query('select rewards from hof_entry  where hof_year = $1 limit 1', [year] ).subscribe(function(rows:any){
      console.log('rewards:',rows)
          if(rows){
              let _rewards = rows[0].rewards     

              
                resolve(_rewards)
               
          } else{
             resolve([])
          }
    })
  })
  }

YearChange(event:any){
  console.log('YearChange:',event)
  const _this = this
 this.getStructureOfYear(event.value.value).then(function(_rewards:any){
  console.log('_rewards:',_rewards)
  _this.rewardsOfYear = _rewards;
  _this.root_rewards = Object.keys(_rewards);
  _this.sub_rewards = _rewards[_this.root_rewards[0]];
  
 })

}
ShowSubOf(root:number){
   this.sub_rewards = this.rewardsOfYear[this.root_rewards[root]] ; 
    this.show_main_rewards = false;
    this.show_sub_rewards = [false,false,false];
    this.show_sub_rewards[root] = true;
    console.log('_this.sub_rewards:',this.sub_rewards)
    this.CaptionRewards= this.root_rewards[root] + ' ' + this.select_year.value.toString();
}

getSubRewardsTitle(subindex:number){
  if ( Object.keys(this.sub_rewards)[subindex].indexOf('Admire Winner')){
        return Object.keys(this.sub_rewards)[subindex];
  } else {
    return Object.keys(this.sub_rewards)[subindex];
  }
  
}
getSubRewardsTitleAll(){
  return Object.keys(this.sub_rewards);
}
getSubRewardsIdea(subindex:number){
  
  return  this.sub_rewards[this.getSubRewardsTitle(subindex)].idea_title;
}
getSubRewardsIdeaumber(subindex:number){
  return  this.sub_rewards[this.getSubRewardsTitle(subindex)].idea_number;
}
OpenIdeaDetail(subindex:number){
  const idea_id = this.sub_rewards[this.getSubRewardsTitle(subindex)].idea_number;
  console.log('OpenIdeaDetail idea_id:',idea_id)
  this.localVar.AppVars.next({eventname:'DirectToIdeaDetail', target:'MenuLeft', id:idea_id})
  this.router.navigate([this.BaseHref], {
  queryParams: { ideanumber: idea_id }
});
}
}
