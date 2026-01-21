import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

import {Observable, Subject} from "rxjs";

import {map} from "rxjs/operators";
import {VariablesService} from '../../../variables.service';
import { FormControl, FormGroup } from '@angular/forms';
import * as _moment from 'moment';
// tslint:disable-next-line:no-duplicate-imports
import {default as _rollupMoment, Moment} from 'moment';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {ChangeDetectionStrategy,  ViewEncapsulation} from '@angular/core';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';

import {MatDatepicker, MatDatepickerModule} from '@angular/material/datepicker';

import { CanvasJS } from '../../../../assets/lib/canvasjs.angular.component';

const moment = _rollupMoment || _moment;
export const MY_FORMATS = {
    parse: {
      dateInput: 'MM/YYYY',
    },
    display: {
      dateInput: 'MM/YYYY',
      monthYearLabel: 'MMM YYYY',
      dateA11yLabel: 'LL',
      monthYearA11yLabel: 'MMMM YYYY',
    },
  };
@Component({
    selector: 'cus-applied-chart',
    templateUrl: './applied-chart.component.html',
    styleUrls: ['./applied-chart.component.scss'],
    providers: [
      
      ],
})
export class AppliedChartComponent implements OnInit {

    @Input() departmentlist:any =[]
    @Input() targetpoint:any =[]
    @Input() Parent:Subject<any> = new Subject();
    @Output() SendEvents : EventEmitter<any> = new EventEmitter();

    date = new FormControl(moment());
    veiw_type:string = 'M'
    divitionfilter:any = 0
    selectMonth:any = 2    
    selectYear:any = 2022
    selectMonthEnd:any = 3
    selectYearEnd:any = 2024

    wait_amonut = 0
    applied_amount =0
    reject_amount = 0
    wait_days_avg = 0
    applied_days_avg = 0


    wait_amonut_X =0
    applied_amount_X =0
    reject_amount_X = 0

    columnChartOptions = {
        animationEnabled: true,
        title: {
          text: 'Summary Applied Ideas',
        },
        zoomEnabled: true,
        height:450,
        width:700,
        legend :{
          verticalAlign: "top",
          horizontalAlign:"right"
         },
        axisX: {
          title:"",
          interval: 1,
          margin: 20,
          tickLength:1,
          labelAngle: -90
                        },
        data: [
          {
            // Change type to "doughnut", "line", "splineArea", etc.

            type: 'column',
            legendText: "Applied",   

            showInLegend: true,
            dataPoints: [
              { label: 'apple', y: 10 },
              { label: 'orange', y: 15 },
              { label: 'banana', y: 25 },
              { label: 'mango', y: 30 },
              { label: 'grape', y: 28 },
            ],
          },
          {
            // Change type to "doughnut", "line", "splineArea", etc.
            type: 'column',           
            legendText: "Not Applied",             
            showInLegend: true,
            dataPoints: [
              { label: 'apple', y: 10 },
              { label: 'orange', y: 15 },
              { label: 'banana', y: 25 },
              { label: 'mango', y: 30 },
              { label: 'grape', y: 28 },
            ],
          },
        ],
      };
    
      pieChartOptions = {
        animationEnabled: true,
        title: {
          text: 'Angular Pie Chart in Material UI Tabs',
        },
        theme: 'light2', // "light1", "dark1", "dark2"
        data: [
          {
            type: 'pie',
            dataPoints: [
              { label: 'apple', y: 10 },
              { label: 'orange', y: 15 },
              { label: 'banana', y: 25 },
              { label: 'mango', y: 30 },
              { label: 'grape', y: 28 },
            ],
          },
        ],
      };
    
      lineChartOptions = {
        animationEnabled: true,
        title: {
          text: 'Angular Line Chart in Material UI Tabs',
        },
        theme: 'light2', // "light1", "dark1", "dark2"
        data: [
          {
            type: 'line',
            dataPoints: [
              { label: 'apple', y: 10 },
              { label: 'orange', y: 15 },
              { label: 'banana', y: 25 },
              { label: 'mango', y: 30 },
              { label: 'grape', y: 28 },
            ],
          },
        ],
      };

      changeView(e:any){
    //console.log(e)
        if(this.veiw_type == e.value){

        } else {
          this.veiw_type = e.value
          setTimeout(() => {
            if(this.veiw_type =='M'){
              this.SendEvents.emit({eventname:'MonthPickerSelected' ,sender:'applied',divisionid: this.divitionfilter,selectMonth: this.selectMonth ,selectYear: this.selectYear ,selectMonthEnd: this.selectMonthEnd ,selectYearEnd: this.selectYearEnd, veiwType: this.veiw_type })
            } else{
              this.SendEvents.emit({eventname:'MonthPickerSelected' ,sender:'applied',divisionid: this.divitionfilter,selectMonth: this.selectMonth ,selectYear: this.selectYear ,selectMonthEnd: this.selectMonthEnd ,selectYearEnd: this.selectYearEnd, veiwType: this.veiw_type })
            }

            
           }, 300);
        }
     

      }
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
                                WelcomelabelfontSize ='32px'
                            UserNamelabelfontSize ='25px'
    pathD = 'M51,93.5C51,54.6,82.6,23,121.5,23h372.1c11.6,0,17.4,0,21.8,2.3c3.5,1.9,6.4,4.8,8.3,8.3C526,38,526,43.8,526,55.4v38.1v38.1c0,11.6,0,17.4-2.3,21.8c-1.9,3.5-4.8,6.4-8.3,8.3c-4.4,2.3-10.2,2.3-21.8,2.3H121.5	C82.6,164,51,132.4,51,93.5z';
   
   daterangeStart:any
   daterangeEnd:any
   ApprovalSummary:any ={M:[],Y:[]}

    UserInfo:any = {};
    statuslist:any = []
   
    default_date_range:any

    total_score:any =[]
     

    ObjectTargetTotal:any ={}

    constructor(private VariablesService:VariablesService) {
        
    }

    setMonthAndYear(normalizedMonthAndYear: Moment, datepicker: MatDatepicker<Moment>) {
        const ctrlValue = this.date.value ?? moment();
        ctrlValue.month(normalizedMonthAndYear.month());
        ctrlValue.year(normalizedMonthAndYear.year());
        this.date.setValue(ctrlValue);
        datepicker.close();
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
        this.statuslist = this.UserInfo['status_list']
      //  console.log(this.UserInfo['status_list'])
        this.Parent.subscribe(function(d){
        //console.log(d)
           
            switch (d.eventname) {
                case 'AppliedFilterChange':
                  //  that.Me.next(d)

                  that.ApprovalSummary[that.veiw_type] = d.ApprovalSummary[that.veiw_type]
                  that.columnChartOptions.data[0].dataPoints=[]
                  that.columnChartOptions.data[1].dataPoints=[]
                  for (let index = 0; index < that.ApprovalSummary[that.veiw_type].length; index++) {
                    const element = that.ApprovalSummary[that.veiw_type][index];
                    let _Oneapproved = {label: element.day_num  , y: element.approved }
                    that.columnChartOptions.data[0].dataPoints.push(_Oneapproved)
                    let _Onerejected = {label: element.day_num , y: element.rejected }
                    that.columnChartOptions.data[1].dataPoints.push(_Onerejected)
                    
                  }

                   
                that.columnChartOptions['width'] = 1100;
                  that.columnChartOptions['height'] = 450; 
                  var chart = new CanvasJS.Chart("chartApplied",  that.columnChartOptions)

                  chart.render();
                  that.wait_amonut = d.wait_amonut
                  that.applied_amount =d.applied_amount                  
                  that.reject_amount = d.reject_amount
                  that.wait_days_avg =d.wait_days_avg
                  that.applied_days_avg = d.applied_days_avg
                       
                  if(that.wait_amonut<9999){
                    if(that.wait_amonut<999){
                      that.wait_amonut_X =30
                    } else {
                      if(that.wait_amonut<99){
                        that.wait_amonut_X =40
                      } else {
                        if(that.wait_amonut<10){
                          that.wait_amonut_X =50
                        } else {
                          that.wait_amonut_X =0
                        }
                      }
                    }
                  } else {
                    that.wait_amonut_X =0
                  }
                  if(that.applied_amount<9999){
                    if(that.applied_amount>999){
                      that.applied_amount_X =30
                    } else {
                      if(that.applied_amount>99){
                        that.applied_amount_X =40
                      } else {
                        if(that.applied_amount>9){
                          that.applied_amount_X =50
                        } else {
                          that.applied_amount_X =50
                        }
                      }
                    }
                  } else {
                    that.applied_amount_X =0
                  }
                  if(that.reject_amount<9999){
                    if(that.reject_amount>999){
                      that.reject_amount_X =30
                    } else {
                      if(that.reject_amount>99){
                        that.reject_amount_X =40
                      } else {
                        if(that.reject_amount>9){
                          that.reject_amount_X =50
                        } else {
                          that.reject_amount_X =50
                        }
                      }
                    }
                  } else {
                    that.reject_amount_X =0
                  }
                 
               

                  setTimeout(() => {
                    that.Me.next({eventname:'setPicker',MonthStart:that.selectMonth,MonthEnd:that.selectMonthEnd,YearStart:that.selectYear,YearEnd:that.selectYearEnd}) 
                    }, 200);
                    
                    break;
                case 'InitObjectTarget':
                  
                setTimeout(() => {
                  that.selectMonth = 2
                  that.selectYear =  2022
                  that.selectMonthEnd = 3
                  that.selectYearEnd =  2024     
                              
                  that.SendEvents.emit({eventname:'MonthPickerSelected' ,sender:'applied',divisionid: that.divitionfilter,selectMonth: that.selectMonth ,selectYear: that.selectYear,selectMonthEnd: that.selectMonthEnd ,selectYearEnd: that.selectYearEnd, veiwType: that.veiw_type })
                 }, 200);
                    break;           
                default:
                    break;
            }
        })
        this.cols=3
        setTimeout(() => {
            that.setScreenSize()
        }, 200);
      
       // this.divitionfilter =  that.UserInfo.department_master_id 
       
      
       setTimeout(() => {
        that.Me.next({eventname:'setMonthPicker',target:'MonthStart' , value:'03/2022'}) 
        }, 200);
        setTimeout(() => {
          that.Me.next({eventname:'setMonthPicker',target:'MonthEnd' , value:'04/2024'})
          }, 200);

          setTimeout(() => {
            that.Me.next({eventname:'setYearPicker',target:'YearStart' , value:'01/2017'}) 
            }, 400);
            setTimeout(() => {
              that.Me.next({eventname:'setYearPicker',target:'YearEnd' , value:'12/2025'})
              }, 400);
    }

    getTargetOption(index:number){
        return this.targetpoint(index)['report_option']
    }

    StatusFilterChange(event:any){
    //console.log(this.divitionfilter)
       
        if( this.veiw_type=='M'){
          this.SendEvents.emit({eventname:'MonthPickerSelected' ,sender:'applied',divisionid: this.divitionfilter,selectMonth: this.selectMonth ,selectYear: this.selectYear ,selectMonthEnd: this.selectMonthEnd ,selectYearEnd: this.selectYearEnd, veiwType: this.veiw_type })
        } else {
          this.SendEvents.emit({eventname:'MonthPickerSelected' ,sender:'applied',divisionid: this.divitionfilter,selectMonth: this.selectMonth ,selectYear: this.selectYear ,selectMonthEnd: this.selectMonthEnd ,selectYearEnd: this.selectYearEnd, veiwType: this.veiw_type })
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

       ChildEvent(event:any,viewtype:string){
        const that=this
    //console.log('ChildEvent:',event)

        switch (event.eventname) {
          case "MonthPickerSelected":
            if(event.sender=='MonthStart'){
              that.selectMonth = event.Value._d.getMonth()
              that.selectYear =  event.Value._d.getYear() + 1900
            } else{
              that.selectMonthEnd = event.Value._d.getMonth()
              that.selectYearEnd =  event.Value._d.getYear() + 1900
            }    
            setTimeout(() => {


              that.SendEvents.emit({eventname:'MonthPickerSelected' ,sender:'applied',divisionid: that.divitionfilter,selectMonth: that.selectMonth ,selectYear: that.selectYear ,selectMonthEnd: that.selectMonthEnd ,selectYearEnd: that.selectYearEnd, veiwType: that.veiw_type })
             }, 300);
            break;

            case "YearPickerSelected":
              if(event.sender=='YearStart'){
                that.selectMonth = 0
                that.selectYear =  event.Value._d.getYear() + 1900
              } else{
                that.selectMonthEnd = 11
                that.selectYearEnd =  event.Value._d.getYear() + 1900
              }
              setTimeout(() => {

               
                that.SendEvents.emit({eventname:'YearPickerSelected' ,sender:'applied',divisionid: that.divitionfilter,selectMonth: that.selectMonth ,selectYear: that.selectYear ,selectMonthEnd: that.selectMonthEnd ,selectYearEnd: that.selectYearEnd, veiwType: that.veiw_type })
                
               }, 300);
            break;
        
          default:
            break;
        }
      
        

       
      }
   

}
