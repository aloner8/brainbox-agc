import {Component, OnInit} from '@angular/core';

import {Observable, Subject} from "rxjs";

import {map} from "rxjs/operators";
import {VariablesService} from '../../../variables.service';
import { ApiService } from '../../../api.service';

@Component({
    selector: 'dashboard-my-idea',
    templateUrl: './my-idea.component.html',
    styleUrls: ['./my-idea.component.scss']
})
export class DashboardMyIdeaComponent implements OnInit {

   
    HomePage:Subject<any> =  new Subject<any>()  ;
    currentScreenSize:string='small';
    captionlevelfontsize:string='small'
    RankingSize:string = 'Large';
    cols=2
    lightimg:boolean= false;
    totalNumber = 'large'
    totallabel = 'small'
    myIdeasRowSpan :number = 5
                                WelcomelabelfontSize ='32px'
                            UserNamelabelfontSize ='25px'
    pathD = 'M51,93.5C51,54.6,82.6,23,121.5,23h372.1c11.6,0,17.4,0,21.8,2.3c3.5,1.9,6.4,4.8,8.3,8.3C526,38,526,43.8,526,55.4v38.1v38.1c0,11.6,0,17.4-2.3,21.8c-1.9,3.5-4.8,6.4-8.3,8.3c-4.4,2.3-10.2,2.3-21.8,2.3H121.5	C82.6,164,51,132.4,51,93.5z';
   
    BaseHref = ''
    UserInfo:any = {};
    statuslist:any = []
    constructor(private VariablesService:VariablesService , private api:ApiService) {
        
    }

    ngAfterViewInit(): void {
        //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
        //Add 'implements AfterViewInit' to the class.
       // console.log('ngAfterViewInit')
      }

    ngOnInit() {
      const  that = this
    ////  console.log('ngOnInit')
    this.BaseHref = this.api.getBaseHref();
        this.UserInfo = this.VariablesService.getVariable('UserHome')
        this.statuslist = this.UserInfo['status_list']
      //  console.log(this.UserInfo['status_list'])
        this.VariablesService.AppVars.subscribe(function(v){
          //  console.log(v)
            that.UserInfo = that.VariablesService.getVariable('UserHome')
            that.statuslist = that.UserInfo['status_list']
          //  console.log(that.UserInfo['status_list'])
            switch (v.eventname) {
                case 'ChangeScreenSize':
                    that.currentScreenSize=v['value'].toString()
                    // //  console.log(that.currentScreenSize)
                       that.setScreenSize()
                    break;
                case 'VariablesChanging':
                    switch (v.variablename) {
                        case 'UserHome':
                            that.UserInfo=v.value
                          //  console.log(that.UserInfo)

                            break;
                            case 'MyIdeasSetPageSize':
                                that.myIdeasRowSpan= (v.value['pageSize'] /3) -2
                              //  console.log(that.UserInfo)
    
                                break;                   
                            
                        default:
                            break;
                    }                  

                    break;
                            
                default:
                    break;
            }

        })
        this.cols=3
        setTimeout(() => {
            that.setScreenSize()
        }, 200);
      
    }

    OpenNewIdeas(){
        
        // this.VariablesService.setVariable('CurrentPage','ideas-detail')
        // this.VariablesService.setVariable('CurrentProjectID',runningnumber)
        this.VariablesService.AppVars.next({eventname:'OpenNewIdeas',target:'MenuLeft'})
      }

    getScoreByidStatus(statusid:number){
        const _status = this.UserInfo.my_idea_status.filter(function(s:any){ return s.id == statusid })
        if(_status[0]){
            return _status[0].count_idea
        } else {
            return 0
        }
    }

    setScreenSize(){
       const that=this 
        switch (that.currentScreenSize) {
            case 'XLarge': 
                    that.cols=3;              
                    break;
            case 'Large': 
                    that.cols=3 ;
                    that.captionlevelfontsize='large';
                    that.RankingSize= 'Large'; 
                    that.totalNumber = 'large'
                    that.totallabel = 'x-small'
                    that.WelcomelabelfontSize ='32px'
                    that.UserNamelabelfontSize ='25px'
                    break;
            case 'Medium': 
                    that.cols=3;that.captionlevelfontsize='medium';
                    that.RankingSize= 'Medium';  
                    that.totalNumber = 'small'
                    that.totallabel = 'xx-small'
                    that.WelcomelabelfontSize ='25px'
                    that.UserNamelabelfontSize ='20px'
                    break;
            case 'Small': 
                    that.cols=3; that.captionlevelfontsize='medium'; 
                    that.RankingSize= 'Small'; 
                    that.totalNumber = 'x-small'
                    that.totallabel = 'xx-small'
                    that.WelcomelabelfontSize ='25px'
                    that.UserNamelabelfontSize ='20px'
                    break;
            case 'XSmall': 
                    that.cols=1;that.captionlevelfontsize='Smaller'; 
                    that.RankingSize= 'Large';                             
                    that.WelcomelabelfontSize ='32px'
                    that.UserNamelabelfontSize ='25px'
                    break;
            
        
            default:
                break;
        }
        setTimeout(() => {
            
            that.HomePage.next({eventname:'ChangeScreenSize',value:{RankingSize:that.RankingSize} })
        }, 200);
    }
    lightOpend (ev:any,open:boolean){
       // console.log(open)
        this.lightimg=open;    
        
    }

   

}
