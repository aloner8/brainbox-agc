import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

import {Observable, Subject} from "rxjs";

import {map} from "rxjs/operators";
import {VariablesService} from '../../../variables.service';
import { FormControl, FormGroup } from '@angular/forms';
import { ApiService } from '../../../api.service';
import { DatePipe } from '@angular/common';

export interface datalist {
    value:number;
    display: string;
    object: any;
  }

export interface targetData {

"seq": number,
"target": number,
"payout": number,  

}

@Component({
    selector: 'cus-object-target',
    templateUrl: './object-target.component.html',
    styleUrls: ['./object-target.component.scss']
})
export class ObjectTargetComponent implements OnInit {

    @Input() departmentlist:any =[]
    @Input() targetpoint:any =[]
    @Input() Parent:Subject<any> = new Subject();
    @Output() SendEvents : EventEmitter<any> = new EventEmitter();

    //@Input() dateRange:any = {start_date:'2017-01-02 00:00:00',end_date: new Date() }

 /*    readonly campaignOne = new FormGroup({
        start: new FormControl(new Date(this.dateRange?.start_date)),
        end: new FormControl(new Date()),
      }); */
      dateRange:any
    Me:Subject<any> = new Subject();
    HomePage:Subject<any> =  new Subject<any>()  ;
    currentScreenSize:string='small';
    captionlevelfontsize:string='small'
    RankingSize:string = 'Large';
    cols=2
    lightimg:boolean= false;
    totalNumber = 'large'
    totallabel = 'small'
    myIdeasRowSpan :number = 5
    target_amount:targetData[]=[]
    WelcomelabelfontSize ='32px'
    UserNamelabelfontSize ='25px'
    pathD = 'M51,93.5C51,54.6,82.6,23,121.5,23h372.1c11.6,0,17.4,0,21.8,2.3c3.5,1.9,6.4,4.8,8.3,8.3C526,38,526,43.8,526,55.4v38.1v38.1c0,11.6,0,17.4-2.3,21.8c-1.9,3.5-4.8,6.4-8.3,8.3c-4.4,2.3-10.2,2.3-21.8,2.3H121.5	C82.6,164,51,132.4,51,93.5z';
   
   daterangeStart:any
   daterangeEnd:any
   
    UserInfo:any = {};
    statuslist:any = []
   
    default_date_range:any
    filtertarget_year:number= 2025
    total_score:any =[]
    divitionfilter:number = 0
    list_target_year:datalist[] = []
    ObjectTargetTotal:any ={}

    constructor(private VariablesService:VariablesService , private api:ApiService  ,private dateformat:DatePipe) {
        
    }

    ngAfterViewInit(): void {
        //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
        //Add 'implements AfterViewInit' to the class.
       // console.log('ngAfterViewInit')

      }

    ngOnInit() {
      const  that = this
    ////  console.log('ngOnInit')
        this.total_score = []
        this.total_score.push({total: '750' ,rate:'↑',rate_percent:'6.07%'    })
        this.total_score.push({completed: '500' ,rate:'↑',rate_percent:'5.07%'    })
        this.total_score.push({payout: '20.00%' ,rate:'↑',rate_percent:'1.07%'    })
        this.total_score.push({implemented: '20' ,rate:'',rate_percent:'1.07%'    })

        this.UserInfo = this.VariablesService.getVariable('UserHome')
        let _ideas_filter = this.VariablesService.getVariable('datalistsources') 
        this.list_target_year = _ideas_filter['target_year_list']

        this.filtertarget_year = this.list_target_year.filter(function(d){ return d.value == new Date().getFullYear() })[0].value ;
      console.log('filtertarget_year',this.list_target_year.filter(function(d){ return d.value == new Date().getFullYear() }))
        this.statuslist = this.UserInfo['status_list']
        
        setTimeout(() => {
            this.TargetYearFilterChange({})
        }, 300);
      //  console.log(this.UserInfo['status_list'])
        this.Parent.subscribe(function(d){
        //console.log(d)
           if(d.target=='object_target' ){  

            switch (d.eventname) {
                case 'BinddingObjectTarget':
                  //  that.Me.next(d)
                    that.targetpoint =d.ObjectTarget
                    that.ObjectTargetTotal  =d.ObjectTargetTotal
                    if (that.ObjectTargetTotal['payout']) {
                        that.ObjectTargetTotal['payout'] = that.ObjectTargetTotal['payout'].toFixed(2)
                    }
                    that.ObjectTargetTotal['target_amount'] = that.target_amount

                    if(d.dateRange){
                    //console.log(d.dateRange)
                       // that.daterangeStart = new Date(d.dateRange.start_date) 
                        //that.daterangeEnd= new Date(d.dateRange.end_date) 
                       }
                       setTimeout(() => {
                        d['target'] = 'ccObjectTarget';
                        that.Me.next(d)
                       }, 100);
                       
                    break;
                case 'InitObjectTarget':
                   // that.Me.next(d)
                   // that.targetpoint =d.ObjectTarget
                   /*  if(d.dateRange){
                    //console.log(d.dateRange)
                        that.daterangeStart = new Date(d.dateRange.start_date) 
                        that.daterangeEnd= new Date(d.dateRange.end_date) 

                        setTimeout(() => {
                            that.SendEvents.emit({eventname:'object-target' ,sender:'object-target',divisionid: 0,daterangeStart:that.daterangeStart,daterangeEnd:that.daterangeEnd })
                           }, 1000);
                        } */
                    break;           
                default:
                    break;
            }
          }
        })
        this.cols=3
        setTimeout(() => {
            that.setScreenSize()
        }, 200);
      
       // this.divitionfilter =  that.UserInfo.department_master_id 

    }

    getTargetOption(index:number){
        return this.targetpoint(index)['report_option']
    }


    TargetYearFilterChange(event:any){
            const _table = this        
     
   
              this.api.Query("select period_ranges , configs from public.object_targets  where period_name =$1 order by period_name ",[this.filtertarget_year]).subscribe(function(rows:any){
       //console.log('object_targets:',rows)
              if(rows){
                  let _my_ideas = rows[0]
                    let _selectrange =_my_ideas['period_ranges']
                
                _table.daterangeStart = _selectrange.split(',')[0].replace('[','')
                _table.daterangeEnd = _selectrange.split(',')[1].replace(')','')
                //console.log( _table.daterangeStart , ' - ' ,_table.daterangeEnd )
                    _table.target_amount==_my_ideas['configs']
                    _table.StatusFilterChange({target_year:_table.filtertarget_year})
              } else{
                /* _table.snackBar.openSnackBar( 'not found user data!!',
                  'OK', 'center', 'top', 'snack-style'); */
              }
              
            })
          }

    StatusFilterChange(event:any){
    //console.log(this.divitionfilter)
       if (this.divitionfilter) {
        this.SendEvents.emit({eventname:'object-target' ,sender:'object-target',divisionid: this.divitionfilter,daterangeStart:this.daterangeStart,daterangeEnd:this.daterangeEnd,target_year:event.target_year })
       } else {
        this.SendEvents.emit({eventname:'object-target' ,sender:'object-target',divisionid: 0,daterangeStart:this.daterangeStart,daterangeEnd:this.daterangeEnd,target_year:event.target_year })
       }
        

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

    DateChange(event:any){

     //console.log('this.daterangeStart:',this.daterangeStart)
     //console.log('this.daterangeEnd:',this.daterangeEnd)
         
 
        
       }

}
