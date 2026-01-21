import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';

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

import { CanvasJS,CanvasJSChart } from '../../../../assets/lib/canvasjs.angular.component';
// import { CanvasJSAngularChartsModule,CanvasJS   } from '@canvasjs/angular-charts';
import { ApiService } from '../../../api.service';

import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
import { DatePipe } from '@angular/common';
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';

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
    selector: 'cus-total-person-chart',
    templateUrl: './total-person-chart.component.html',
    styleUrls: ['./total-person-chart.component.scss'],
    providers: [
      
      ],
})
export class TotalPersonChartComponent implements OnInit {

    @Input() departmentlist:any =[]
    @Input() statuslist:any =[]
    @Input() targetpoint:any =[]
    @Input() Parent:Subject<any> = new Subject();
    @Output() SendEvents : EventEmitter<any> = new EventEmitter();

    
    //@ViewChild('chartTotalPerson') myChart: any;
    
    chartTotalPerson = 'chartTotalPerson'

    date = new FormControl(moment());
    veiw_type:string = 'M'
    divitionfilter:any = 0
    statusfilter:any = 0
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
          text: 'Total Ideas & Ideas/Person',
        },
        subtitles:[{}],
        zoomEnabled: false,
        exportEnabled: true,
        
        height:600,
        width:1400,
        axisY:{
          titleFontSize: 20,
          title : "จำนวนไอเดียสะสม",
          labelFontSize: 14,
         },
        axisX: {
          title:"",
          interval: 1,
          margin: 20,
          tickLength:1,
          labelFontSize: 14,
          labelAngle: -90
                        },
                        axisY2:{
                          labelFontSize: 14,
                          titleFontSize: 20,
                          title : "จำนวนไอเดียเฉลี่ยต่อคนในแผนก",
                          maximum:50.999,
                          minimum:0.001,
                          		scaleBreaks: {
			type: "wavy",
			customBreaks: [
				{
					startValue: 3.001,
					endValue: 30.999
				},
				{
					startValue: 31.001,
					endValue: 50.999
				}
		]}
                         },
        data: [
          {
            // Change type to "doughnut", "line", "splineArea", etc.

            type: 'column',   
            indexLabel: "{y}",
            indexLabelPlacement: "inside",  
            indexLabelOrientation: "horizontal",     
            indexLabelFontColor: "lightgreen",                     
            indexLabelBorderColor: "green",
            indexLabelBorderThickness: 1 ,
            indexLabelFontSize: 12,
            dataPoints: [
              { label: 'apple', y: 10.00 },
              { label: 'orange', y: 15.00 },
              { label: 'banana', y: 25.00 },
              { label: 'mango', y: 30.00 },
              { label: 'grape', y: 28.00 },
            ],
          },
          {
            // Change type to "doughnut", "line", "splineArea", etc.

            type: 'line',   
            axisYType: "secondary",
            indexLabel: "{y}",
            indexLabelPlacement: "inside",  
            indexLabelOrientation: "horizontal",     
            indexLabelFontColor: "orange",                     
            indexLabelBorderColor: "green",
            indexLabelBorderThickness: 1 ,
            yValueFormatString: "#0.00",
            indexLabelFontSize: 12,            
            dataPoints: [ 
              { label: 'apple', y: 10 },
              { label: 'orange', y: 15},
              { label: 'banana', y: 25},
              { label: 'mango', y: 30 },
              { label: 'grape', y: 28 },
            ],
          }
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
        /* if(this.veiw_type == e.value){

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
      */

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
    
    BaseHref=''
    default_date_range:any

    total_score:any =[]
     
    chartBegin=false;

    ObjectTargetTotal:any ={}

    constructor(private VariablesService:VariablesService,private API:ApiService,private dateformat:DatePipe,  ) {
        
    }


    setMonthAndYear(normalizedMonthAndYear: Moment, datepicker: MatDatepicker<Moment>) {
        const ctrlValue = this.date.value ?? moment();
        ctrlValue.month(normalizedMonthAndYear.month());
        ctrlValue.year(normalizedMonthAndYear.year());
        this.date.setValue(ctrlValue);
        datepicker.close();
      }
    
      
    ngAfterViewInit(): void {
      const  that = this
        //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
        //Add 'implements AfterViewInit' to the class.
       // console.log('ngAfterViewInit')
 this.Parent.subscribe(function(d){
        //console.log(d)
              if(!that.veiw_type){
            that.veiw_type = 'M'
           }
            switch (d.eventname) {
                case 'ExportExcel':
                    if (d.activeView=='Total Ideas & Ideas/Person'){
                      let _excelData:any =[]

                      that.columnChartOptions.data[0].dataPoints.forEach(element => {
                        let _person =  that.columnChartOptions.data[1].dataPoints.filter(function(p){ return p.label == element.label})[0]
                        _excelData.push({'label':element['label'],value: element['y'].toString(),person: _person?_person.y:0.00})
                      });

                      let _param:any = [that.columnChartOptions['subtitles'][0]]
                  //console.log(' ExportExcel:' , _excelData, _param[0].text)
                      that.ExportExcel('Total Idea and Idea per Person',  _excelData,_param);
                    }
                    
                    break;
                case 'selectedIndexChange':                  
                if (d.activeView=='Total Ideas & Ideas/Person'){
                  let _excelData:any =[]

                    setTimeout(() => {
                    that.Me.next({eventname:'setPicker',MonthStart:that.selectMonth,MonthEnd:that.selectMonthEnd,YearStart:that.selectYear,YearEnd:that.selectYearEnd}) 
                    that.AppliedFilterChange() 
                  }, 300);  
                }
                    break;           
                default:
                    break;
            }
        })  

        setTimeout(() => {
          this.chartBegin=true
        }, 200);  
      }

    ngOnInit() {
      const  that = this
      this.BaseHref = this.API.getBaseHref();
        this.UserInfo = this.VariablesService.getVariable('UserHome')
        this.statuslist = this.UserInfo['status_list']
 
      

/*         this.cols=3
        setTimeout(() => {
            that.setScreenSize()
        }, 200); */
      
       // this.divitionfilter =  that.UserInfo.department_master_id 


       that.selectMonth = new Date()
       that.selectMonth.setDate(that.selectMonth.getDate() - 356 )
       
       that.selectYear = new Date()
       that.selectYear.setDate(that.selectMonth.getDate() - 356 )
     
       that.selectMonthEnd = new Date()
       that.selectYearEnd = new Date() 
        
    

       
    }

    ExportJpg(){
      var chart = new CanvasJS.Chart("chartTotalPerson",  this.columnChartOptions)
      chart.render();
      setTimeout(() => {
       chart.exportChart({format: "jpg"}); 
      }, 1000);
      
    }
    ExportExcel(sheetname:string,ExcelData:any,param:any){
     
        const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet([{ 
          A: "Division ",
          B: "Idea Amount",           
          C: "Avg Per Person",           
		}],{header: [], skipHeader: true});

    const paramworksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(param,{header: [], skipHeader: true});
        
  
    XLSX.utils.sheet_add_json(worksheet, ExcelData, {skipHeader: true, origin: "A2"});
    XLSX.utils.sheet_add_json(paramworksheet, param, {skipHeader: true, origin: "A1"});
    //console.log(worksheet )
        
        // const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
       /*  const workbook: XLSX.WorkBook = {
          Sheets: { Sheet1: worksheet },
          SheetNames: [sheetname ],
        }; */
    
        const workbook: XLSX.WorkBook =  XLSX.utils.book_new() ;

        XLSX.utils.book_append_sheet(workbook,worksheet,sheetname)
        XLSX.utils.book_append_sheet(workbook,paramworksheet,'Condition')
       
        const fileName = sheetname  + " " +  this.dateformat.transform(new Date(),'YYYY_MM_dd@HH:mm:ss' ) +'.xlsx';

       /*  const excelBuffer: any = XLSX.write(workbook, {
          bookType: 'xlsx',
          type: 'array',
        });
    
        const data: Blob = new Blob([excelBuffer], { type: EXCEL_TYPE });
        const date = new Date();
        
    
        FileSaver.saveAs(data, fileName); */

      XLSX.writeFile(workbook,fileName)
    }
    /* ExportExcel(sheetname:string,ExcelData:any,param:any){
     
      const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(ExcelData);
      const param_worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(param);

  //console.log(worksheet,param_worksheet)
      

      const workbook: XLSX.WorkBook = {
        Sheets: { Sheet1: worksheet,Sheet2: param_worksheet},
        SheetNames: [sheetname,'Parameter'],
      };
  

      const excelBuffer: any = XLSX.write(workbook, {
        bookType: 'xlsx',
        type: 'array',
      });
  
      const data: Blob = new Blob([excelBuffer], { type: EXCEL_TYPE });
      const date = new Date();
      const fileName = sheetname  +  this.dateformat.transform(new Date(),'YYYY_MMM_DD_HH:mm:ss' ) +'.xlsx';
  
      FileSaver.saveAs(data, fileName);
    
  } */
    getTargetOption(index:number){
        return this.targetpoint(index)['report_option']
    }

    StatusFilterChange(event:any){
    //console.log(this.divitionfilter)
         this.AppliedFilterChange()
        /* if( this.veiw_type=='M'){
          this.SendEvents.emit({eventname:'MonthPickerSelected' ,sender:'applied',divisionid: this.divitionfilter,selectMonth: this.selectMonth ,selectYear: this.selectYear ,selectMonthEnd: this.selectMonthEnd ,selectYearEnd: this.selectYearEnd, veiwType: this.veiw_type })
        } else {
          this.SendEvents.emit({eventname:'MonthPickerSelected' ,sender:'applied',divisionid: this.divitionfilter,selectMonth: this.selectMonth ,selectYear: this.selectYear ,selectMonthEnd: this.selectMonthEnd ,selectYearEnd: this.selectYearEnd, veiwType: this.veiw_type })
        } */
        
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
    //console.log('MonthStart:',event)

        switch (event.eventname) {
          case "MonthPickerSelected":
            if(event.sender=='MonthStart'){
              that.selectMonth = event.Value._d
              that.selectYear =  event.Value._d
            } else{
              that.selectMonthEnd = event.Value._d
              that.selectYearEnd =  event.Value._d
            }    
             that.AppliedFilterChange()   
      /*       setTimeout(() => {


              that.SendEvents.emit({eventname:'MonthPickerSelected' ,sender:'applied',divisionid: that.divitionfilter,selectMonth: that.selectMonth ,selectYear: that.selectYear ,selectMonthEnd: that.selectMonthEnd ,selectYearEnd: that.selectYearEnd, veiwType: that.veiw_type })
             }, 300); */
            break;

            case "YearPickerSelected":
              if(event.sender=='YearStart'){
                that.selectMonth = 0
                that.selectYear =  event.Value._d.getYear() + 1900
              } else{
                that.selectMonthEnd = 11
                that.selectYearEnd =  event.Value._d.getYear() + 1900
              }
             /*  setTimeout(() => {

               
                that.SendEvents.emit({eventname:'YearPickerSelected' ,sender:'applied',divisionid: that.divitionfilter,selectMonth: that.selectMonth ,selectYear: that.selectYear ,selectMonthEnd: that.selectMonthEnd ,selectYearEnd: that.selectYearEnd, veiwType: that.veiw_type })
                
               }, 300); */
            break;
        
          default:
            break;

        }
      
    //console.log({division:that.divitionfilter,select_year:that.selectYear,select_month:that.selectMonth,select_year_end:that.selectYearEnd,select_month_end:that.selectMonthEnd,status:0})
     //   that.AppliedFilterChange()   

       
      }
 interpolateColor(value:number, min:number, max:number) {
  const ratio = (value - min) / (max - min);
  const r = Math.floor(255 * (1 - ratio));
  const g = Math.floor(255 * ratio);
  return `rgb(${r},${g},100)`;
}

      AppliedFilterChange(){
        const that = this        
    //console.log(event)

        that.columnChartOptions.data[0].dataPoints=[]
        that.columnChartOptions.data[1].dataPoints=[]
          this.API.CallProcedure('report_total_person',{division:that.divitionfilter,select_year:that.selectMonth, select_month:that.selectMonth,select_year_end:that.selectMonthEnd,select_month_end:that.selectMonthEnd,status:that.statusfilter}).subscribe(function(rows:any){
        //console.log('report_total_person:',rows)
               if(rows){
                  
                 that.ApprovalSummary[that.veiw_type] = [].concat(rows) 
            
                  // that.ApprovalSummary[that.veiw_type] =ApprovalSummary[that.veiw_type]
                   that.columnChartOptions.data[0].dataPoints=[]
                   that.columnChartOptions.data[1].dataPoints=[]
                 
 

var values = that.ApprovalSummary[that.veiw_type].map((item: { value: number; }) => item.value);
var min = Math.min(...values);
var max = Math.max(...values);

                   for (let index = 0; index < that.ApprovalSummary[that.veiw_type].length; index++) {
                     const element = that.ApprovalSummary[that.veiw_type][index];
                     if(element.value>0){
                      let _Oneapproved = {label: element.column  , y: element.value,  color: that.interpolateColor(element.value, min, max)}
                      that.columnChartOptions.data[0].dataPoints.push(_Oneapproved)
                      let _avgOne = element.value / element.person
                      let _OnePerson = {label: element.column  , y: _avgOne }
                      that.columnChartOptions.data[1].dataPoints.push(_OnePerson)
                     }
                     
                   
                     
                   }
 
                    
                 that.columnChartOptions['width'] = 1400;
                   that.columnChartOptions['height'] =600; 
               

               
                    that.columnChartOptions['subtitles'] = [{ text: ' From: ' + that.dateformat.transform(that.selectMonth,'YYYY-MM-dd') + ' To: ' + that.dateformat.transform(that.selectMonthEnd,'YYYY-MM-dd')     }]; 
                   
                //console.log(that.columnChartOptions)

                   
                   setTimeout(() => {
                    //this.chartTotalPerson
        var chart = new CanvasJS.Chart(that.chartTotalPerson,  that.columnChartOptions)
                            chart.render(); 
                
                    
                   }, 200);
                   

                 
               } else{
                 /* _table.snackBar.openSnackBar( 'not found user data!!',
                   'OK', 'center', 'top', 'snack-style'); */
               }
               
             })
         

      }

}
