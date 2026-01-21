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
import { ApiService } from '../../../api.service';
import { DatePipe } from '@angular/common';

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
    chartApplied = 'chartApplied'

    wait_amonut_X =0
    applied_amount_X =0
    reject_amount_X = 0

    columnChartOptions = {
        animationEnabled: true,
        title: {
          text: 'Summary Applied Ideas',
                       fontFamily: "roboto",
    fontSize: 20,
    fontColor: "#000000",
    fontWeight: "bold" // Optional
        },
    
        subtitles:[{ text:''  ,
                       fontFamily: "roboto",
    fontSize: 16,
    fontColor: "#000000",
    fontWeight: "bold" // Optional
        }],
        legend: {
  fontFamily: "roboto",
  fontSize: 12,
  fontColor: "#333",
  fontWeight: "normal",
          verticalAlign: "top",
          horizontalAlign:"right"
},
   axisY: {
            labelFontFamily: "roboto",
  labelFontSize: 12,
  labelFontColor: "#060606ff",
  labelFontWeight: "normal",
        
                        },
        axisX: {
            labelFontFamily: "roboto",
  labelFontSize: 12,
  labelFontColor: "#060606ff",
  labelFontWeight: "normal",
          title:"",
          interval: 1,
          margin: 20,
          tickLength:1,
          labelAngle: -90
                        },
        zoomEnabled: false,
        exportEnabled: true,
        
        height:450,
        width:700,

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
          this.AppliedFilterChange()
            
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
     chartBegin=false;

    ObjectTargetTotal:any ={}

    constructor(private VariablesService:VariablesService ,private API:ApiService ,private dateformat:DatePipe,) {
        
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
           if(!that.veiw_type){
            that.veiw_type = 'M'
           }
            switch (d.eventname) {
                case 'AppliedFilterChange':
                  //  that.Me.next(d)
    
                    break;
                case 'InitObjectTarget':
                                  
                that.selectMonth = new Date()
                that.selectMonth.setDate(that.selectMonth.getDate() - 356 )
                
                that.selectYear = new Date()
                that.selectYear.setDate(that.selectMonth.getDate() - 356 )
              
                that.selectMonthEnd = new Date()
                that.selectYearEnd = new Date() 
                  
               setTimeout(() => {               
                           
                  that.Me.next({eventname:'setPicker',MonthStart:that.selectMonth,MonthEnd:that.selectMonthEnd,YearStart:that.selectYear,YearEnd:that.selectYearEnd}) 
                   that.AppliedFilterChange()
                 }, 500);  
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
          this.chartBegin=true
        }, 500);    

     
    }

   AppliedFilterChange()  {
    const that = this;
 
            console.log('AppliedFilterChange:paremetyer=',{division:that.divitionfilter ,select_year:that.selectYear,select_month:that.selectMonth,select_year_end:that.selectYearEnd,select_month_end:that.selectMonthEnd})
          

              this.API.CallProcedure('fliter_summary_month',{division:that.divitionfilter ,select_year:that.selectYear,select_month:that.selectMonth,select_year_end:that.selectYearEnd,select_month_end:that.selectMonthEnd}).subscribe(function(rows:any){
            console.log('fliter_summary_month:',rows)
                   if(rows){
                      
                       that.ApprovalSummary['M'] = [].concat(rows['summary_amount']) 
                       that.ApprovalSummary['Y'] = [].concat(rows['summary_amount_year']) 
                       that.wait_amonut  = rows['wait_amonut']                  
                       that.applied_amount =rows['applied_amount'] 
                       that.reject_amount = rows['not_applied_amount'] 
                       that.wait_days_avg = rows['wait_days_avg'] 
                       that.applied_days_avg = rows['applied_days_avg'] 
                       
                       
                  that.columnChartOptions.data[0].dataPoints=[]
                  that.columnChartOptions.data[1].dataPoints=[]
                  console.log('that.ApprovalSummary[m]=',that.ApprovalSummary[that.veiw_type])
                  for (let index = 0; index < that.ApprovalSummary[that.veiw_type].length; index++) {
                    const element = that.ApprovalSummary[that.veiw_type][index];
                    let _Oneapproved = {label: element.day_num  , y: element.applied }
                    that.columnChartOptions.data[0].dataPoints.push(_Oneapproved)
                    let _Onerejected = {label: element.day_num , y: element.rejected }
                    that.columnChartOptions.data[1].dataPoints.push(_Onerejected)
                    
                    if(index == that.ApprovalSummary[that.veiw_type].length - 1) {
                     that.columnChartOptions['width'] = 1200;
                      that.columnChartOptions['height'] = 500; 
                      console.log('fliter_summary_month:',that.columnChartOptions)
                        let _division_text = that.departmentlist.filter(function(s:any){ return s.value == that.divitionfilter })[0]?.display                    
                      if (!_division_text){
                        _division_text = 'All'
                      }

                       that.columnChartOptions['subtitles'][0]['text'] =   ' From: ' + that.dateformat.transform(that.selectMonth,'YYYY-MM-dd') + ' To: ' + that.dateformat.transform(that.selectMonthEnd,'YYYY-MM-dd') +'   Division : ' + _division_text   ; 

                      var chart = new CanvasJS.Chart(that.chartApplied,  that.columnChartOptions)
                      chart.render();
    
                          
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
                    }
                  }
                  
                     
                   } else{
                     /* _table.snackBar.openSnackBar( 'not found user data!!',
                       'OK', 'center', 'top', 'snack-style'); */
                   }
                   
                 })
          

         
                   
              
                    
    }

    getTargetOption(index:number){
        return this.targetpoint(index)['report_option']
    }

    StatusFilterChange(event:any){
    //console.log(this.divitionfilter)
       
         this.AppliedFilterChange() 

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
           this.AppliedFilterChange() 
        
       }

       ChildEvent(event:any,viewtype:string){
        const that=this
    //console.log('ChildEvent:',event)

        switch (event.eventname) {
          case "MonthPickerSelected":
                
            if(event.sender=='MonthStart'){
              that.selectMonth = event.Value._d
              that.selectYear =  event.Value._d
            } else{
              that.selectMonthEnd = event.Value._d
              that.selectYearEnd =  event.Value._d
            }

            break;

      
        
          default:
            break;
        }
      
        
  this.AppliedFilterChange() 
       
      }
   

}
