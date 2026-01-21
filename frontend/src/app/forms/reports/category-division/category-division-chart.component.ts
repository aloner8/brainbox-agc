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
    selector: 'cus-category-division-chart',
    templateUrl: './category-division-chart.component.html',
    styleUrls: ['./category-division-chart.component.scss'],
    providers: [
      
      ],
})
export class CategoryDivisionChartComponent implements OnInit {

    @Input() departmentlist:any =[]
    @Input() statuslist:any =[]
    @Input() targetpoint:any =[]
    @Input() Parent:Subject<any> = new Subject();
    @Output() SendEvents : EventEmitter<any> = new EventEmitter();

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
     chartBegin=false;

    columnChartOptions = {
        animationEnabled: true,
        title: {
          text: 'Category by Division',
        },
        subtitles:[{}],
        zoomEnabled: false,
        exportEnabled: true,
        
        height:600,
        width:700,
        axisY: {
          title:"Idea Amount",
          includeZero: true,
          suffix: "",
          labelFontSize: 12,
          labelAngle: 0,
        },
        axisX: {
          title:"",
          includeZero: true,
          interval: 1,
          margin: 20,
          tickLength:1,
          labelFontSize: 14,
                        },
        data: [
          {
            // Change type to "doughnut", "line", "splineArea", etc.

            type: 'bar',   
            indexLabel: "{y}",
            indexLabelPlacement: "inside",  
            indexLabelOrientation: "horizontal",     
            indexLabelFontColor: "lightgreen",                     
            indexLabelBorderColor: "green",
            indexLabelBorderThickness: 1 ,
            dataPoints: [
              { label: 'apple', y: 10 },
              { label: 'orange', y: 15 },
              { label: 'banana', y: 25 },
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

      }

    ngOnInit() {
      const  that = this
      this.BaseHref = this.API.getBaseHref();
        this.UserInfo = this.VariablesService.getVariable('UserHome')
        this.statuslist = this.UserInfo['status_list']
 
       this.Parent.subscribe(function(d){
        //console.log(d)
           
            switch (d.eventname) {
                case 'ExportExcel':
                    if (d.activeView=='Category by Division'){
                      let _excelData:any =[]

                      that.columnChartOptions.data[0].dataPoints.forEach(element => {
                        _excelData.push({'label':element['label'],value: element['y'].toString()})
                      });

                      let _param:any = [that.columnChartOptions['subtitles'][0]]
                  //console.log(' ExportExcel:' , _excelData, _param[0].text)
                      that.ExportExcel(that.columnChartOptions.title.text,  _excelData,_param);
                    }
                    
                    break;
                case 'selectedIndexChange':                  
                if (d.activeView=='Category by Division'){
                  let _excelData:any =[]

                  setTimeout(() => {
                    that.Me.next({eventname:'setPicker',MonthStart:that.selectMonth,MonthEnd:that.selectMonthEnd,YearStart:that.selectYear,YearEnd:that.selectYearEnd}) 
                    that.AppliedFilterChange() 
                  }, 200);
                }
                    break;           
                default:
                    break;
            }
                          setTimeout(() => {
          that.chartBegin=true
        }, 200); 
        })  

        this.cols=3
        setTimeout(() => {
            that.setScreenSize()
        }, 200);
      
       // this.divitionfilter =  that.UserInfo.department_master_id 


       that.selectMonth = new Date()
       that.selectMonth.setDate(that.selectMonth.getDate() - 356 )
       
       that.selectYear = new Date()
       that.selectYear.setDate(that.selectMonth.getDate() - 356 )
     
       that.selectMonthEnd = new Date()
       that.selectYearEnd = new Date() 

   
    }

    ExportJpg(){
      var chart = new CanvasJS.Chart("chartApplied",  this.columnChartOptions)
      chart.render();
      setTimeout(() => {
       chart.exportChart({format: "jpg"}); 
      }, 1000);
      
    }
    ExportExcel(sheetname:string,ExcelData:any,param:any){
     
        const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet([{ 
          A: "Category Name",
          B: "Idea Amount",           
		}],{header: [], skipHeader: true});

    const paramworksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(param,{header: [], skipHeader: false});
        
  
    XLSX.utils.sheet_add_json(worksheet, ExcelData, {skipHeader: true, origin: "A2"});
    XLSX.utils.sheet_add_json(paramworksheet, param, {skipHeader: false, origin: "A2"});
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
        that.AppliedFilterChange()   

       
      }
      AppliedFilterChange(){
        const that = this        
    //console.log(event)
        that.columnChartOptions.data[0].dataPoints=[]
          if(!that.veiw_type){
            that.veiw_type = 'M'
           }
          this.API.CallProcedure('report_category_by_division',{division:that.divitionfilter,select_year:that.selectMonth, select_month:that.selectMonth,select_year_end:that.selectMonthEnd,select_month_end:that.selectMonthEnd,status:that.statusfilter}).subscribe(function(rows:any){
        //console.log('report_category_by_division:',rows)
               if(rows){
                  
                 that.ApprovalSummary[that.veiw_type] = [].concat(rows) 
            
                  // that.ApprovalSummary[that.veiw_type] =ApprovalSummary[that.veiw_type]
                   that.columnChartOptions.data[0].dataPoints=[]
                 
                   for (let index = 0; index < that.ApprovalSummary[that.veiw_type].length; index++) {
                     const element = that.ApprovalSummary[that.veiw_type][index];
                     let _Oneapproved = {label: element.column  , y: element.value }
                     that.columnChartOptions.data[0].dataPoints.push(_Oneapproved)
                   
                     
                   }
 
                    
                 that.columnChartOptions['width'] = 1100;
                   that.columnChartOptions['height'] = 600; 
                   that.columnChartOptions['subtitles'] = [{From: that.dateformat.transform(that.selectMonth,'YYYY-MM-dd'),
                      To: that.dateformat.transform(that.selectMonthEnd,'YYYY-MM-dd') ,
                      Division: that.divitionfilter,
                      Status: that.statusfilter
                    }]; 

                    let _status_text = that.statuslist.filter(function(s:any){ return s.value == that.statusfilter })[0]?.display
                    let _division_text = that.departmentlist.filter(function(s:any){ return s.value == that.divitionfilter })[0]?.display
                    if (!_status_text){
                      _status_text = 'All'
                    }
                    if (!_division_text){
                      _division_text = 'All'
                    }
                    that.columnChartOptions['subtitles'] = [{ text: ' From: ' + that.dateformat.transform(that.selectMonth,'YYYY-MM-dd') + ' To: ' + that.dateformat.transform(that.selectMonthEnd,'YYYY-MM-dd') +'   Division : ' + _division_text  + '   Status : ' + _status_text   }]; 
                   

                   var chart = new CanvasJS.Chart("chartApplied",  that.columnChartOptions)
                   setTimeout(() => {
                    chart.render(); 
                   }, 100);
                   

                 
               } else{
                 /* _table.snackBar.openSnackBar( 'not found user data!!',
                   'OK', 'center', 'top', 'snack-style'); */
               }
               
             })
         

      }

}
