import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';

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
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatMenuTrigger } from '@angular/material/menu';
import { Router } from '@angular/router';
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
    selector: 'cus-individual-records',
    templateUrl: './individual-records.component.html',
    styleUrls: ['./individual-records.component.scss'],
    providers: [
      
      ],
})
export class IndividualRecordsComponent implements OnInit {

    @Input() departmentlist:any =[]
    @Input() statuslist:any =[]
    @Input() targetpoint:any =[]
    @Input() Parent:Subject<any> = new Subject();
    @Output() SendEvents : EventEmitter<any> = new EventEmitter();

    date = new FormControl(moment());
    veiw_type:string = 'M'
    divitionfilter:string = 'ALL'
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

    displayedColumns:any=[]
    dataSource:any=[]
    listideanumber:any=[]
    wait_amonut_X =0
    applied_amount_X =0
    reject_amount_X = 0
    page_select = 0
    page_size =20
    order_by = ''
    desc = false
    excellData:any =[]
    DetailData:any =[]

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  @ViewChild(MatSort)  
  sort!: MatSort;
 @ViewChild(MatMenuTrigger) trigger!: MatMenuTrigger;
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

    constructor(private VariablesService:VariablesService,
        private API:ApiService,private dateformat:DatePipe,           
        private localVar:VariablesService ,
            private router:Router ) {
        
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
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        that.AppliedFilterChange()   
      }

    ngOnInit() {
      const  that = this
      this.BaseHref = this.API.getBaseHref();
        this.UserInfo = this.VariablesService.getVariable('UserHome')
        this.statuslist = this.UserInfo['status_list']
 
       this.Parent.subscribe(function(d){
        //console.log(d)
              if(!that.veiw_type){
            that.veiw_type = 'M'
           }
            switch (d.eventname) {
                case 'ExportExcel':
                    if (d.activeView=='Individual Records'){                      
                      let _division_text = that.departmentlist.filter(function(s:any){ return s.value == that.divitionfilter })[0]?.display
                      let _param:any = [{division:_division_text,monthStart: that.dateformat.transform(that.selectMonth)  ,monthEnd:that.dateformat.transform(that.selectMonthEnd)}]                     
                      that.API.CallProcedure('export_individual_records',{division:that.divitionfilter=="ALL"?0:that.divitionfilter,select_year:that.selectMonth, select_month:that.selectMonth,select_year_end:that.selectMonthEnd,select_month_end:that.selectMonthEnd,status:that.statusfilter}).subscribe(function(rows:any){
        console.log('export_individual_records:',rows)
               if(rows){
                      that.DetailData = rows;

                      that.ExportExcel('', that.excellData,_param,that.DetailData);
               }
              })
                    }
                    
                    break;
                case 'selectedIndexChange':                  
                if (d.activeView=='Individual Records'){
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
 
      
    }
    ExportExcel(sheetname:string,ExcelData:any,param:any,DetailData:any,){
      const _table = this
        let _excel_header:any ={}
      const _label = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z']
      let x:number = 0;
      let y:number = 0;
      let z:number = 0;

     let _detail_herder:any ={}
_detail_herder


        for (let index = 0; index < this.displayedColumns.length; index++) {
          const element = this.displayedColumns[index];
          if (y==0) {
            _excel_header[_label[x]] = element;            
            x=x+1
            if (x == 22){
               y=y+1
               x=0
            }
          } else {
            _excel_header[_label[y-1].toString() + _label[x].toString()] = element;
            x=x+1
            if (x == 22){
              y=y+1
              x=0
           }
          }
          if( index == this.displayedColumns.length - 1){
            const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet([_excel_header],{header: [], skipHeader: true});

               const worksheetDetail: XLSX.WorkSheet = XLSX.utils.json_to_sheet([{ 
                    A: "Name",
                    B: "Division",           
                    C: "Idea No.",
                    D: "link",
                    E: "Leader.",
                    F: "Point",
                    G: "Title",
                    H: "Total Member",
                    I: "Status",
                    J: "Category",
                    K: "Sub Category",                   
                    L: "Implement Date",                    

              }],{header: [], skipHeader: true});
            const paramworksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(param,{header: [], skipHeader: false});
                
          
            XLSX.utils.sheet_add_json(worksheet, ExcelData, {skipHeader: true, origin: "A2"});
            XLSX.utils.sheet_add_json(worksheetDetail, DetailData, {skipHeader: true, origin: "A2"});
            XLSX.utils.sheet_add_json(paramworksheet, param, {skipHeader: true, origin: "A2"});
            //console.log(worksheet )
                
                // const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
               /*  const workbook: XLSX.WorkBook = {
                  Sheets: { Sheet1: worksheet },
                  SheetNames: [sheetname ],
                }; */
            
                const workbook: XLSX.WorkBook =  XLSX.utils.book_new() ;
        
                XLSX.utils.book_append_sheet(workbook,worksheet,sheetname)
                
               
                 const range = XLSX.utils.decode_range(worksheetDetail['!ref'] || 'A1:A1');
                const rowCount = range.e.r + 2; // e.r is the 0-indexed last row, so add 1

                 for (let wsi = 2; wsi < rowCount; wsi++) {
                                    const cellAddress = `D${wsi}`;
                                    console.log('cellAddress:',cellAddress)
                                    let _row =  XLSX.utils.encode_row(wsi);
                                    console.log('_row:',_row  )
                                    worksheetDetail[cellAddress].f =worksheetDetail[cellAddress].v
                                    console.log('worksheetDetail[cellAddress]:',worksheetDetail[cellAddress]  ) 
                                    
                                    if(wsi==rowCount-1){
                                     
                                     
                                      const fileName = 'report_sumary_point_'+  _table.dateformat.transform(new Date(),'YYYY_MM_dd@HH:mm:ss' ) +'.xlsx';
                
                                        XLSX.utils.book_append_sheet(workbook,worksheetDetail,'Detail')
                                     XLSX.utils.book_append_sheet(workbook,paramworksheet,'Condition')
                              
                                      XLSX.writeFile(workbook,fileName)
                
                                      
                                    }
                                  }
               // const fileName = sheetname  + " " +  this.dateformat.transform(new Date(),'YYYY_MM_dd@HH:mm:ss' ) +'.xlsx';
        
               /*  const excelBuffer: any = XLSX.write(workbook, {
                  bookType: 'xlsx',
                  type: 'array',
                });
            
                const data: Blob = new Blob([excelBuffer], { type: EXCEL_TYPE });
                const date = new Date();
                
            
                FileSaver.saveAs(data, fileName); */
        
             // XLSX.writeFile(workbook,fileName)
          }
          
        }

        
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
        this.FilterChange()
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

       
          this.API.CallProcedure('report_individual_records',{division:0,select_year:that.selectMonth, select_month:that.selectMonth,select_year_end:that.selectMonthEnd,select_month_end:that.selectMonthEnd,status:that.statusfilter}).subscribe(function(rows:any){
        //console.log('report_individual_records:',rows)
               if(rows){
                  
                 that.ApprovalSummary[that.veiw_type] = [].concat(rows['summary_amount']) 
             
                   //that.dataSource =that.ApprovalSummary[that.veiw_type]
                   that.displayedColumns = rows['arr_columns']
                   that.paginator.pageIndex = 0
                   that.paginator.length = that.ApprovalSummary[that.veiw_type].length           
                   that.paginator.showFirstLastButtons=true

                   //that.dataSource.paginator = that.paginator;
                 //  that.dataSource.sort = that.sort;

                   that.FilterChange ()
                 
               } else{
                 /* _table.snackBar.openSnackBar( 'not found user data!!',
                   'OK', 'center', 'top', 'snack-style'); */
               }
               
             })
         

      }

      paginatorChange(event:any){
        const _table = this        
   //console.log('paginatorChange:',event)
       if(_table.page_size !=event.pageSize){
        _table.page_select =0
       } else{
        _table.page_select = event.pageIndex 
       }
      
       _table.page_size =event.pageSize

       this.FilterChange ()
      }

      sortByKey(array:any, key:string) {
        return array.sort(function(a:any, b:any) {
          if (a[key] < b[key]) {
            return -1; // a comes before b
          } else if (a[key] > b[key]) {
            return 1;  // a comes after b
          } else {
            return 0;  // a and b are equal
          }
        });
      }
      sortByKeyDesc(array:any, key:string) {
        return array.sort(function(a:any, b:any) {
          if (a[key] > b[key]) {
            return -1; // a comes before b
          } else if (a[key] < b[key]) {
            return 1;  // a comes after b
          } else {
            return 0;  // a and b are equal
          }
        });
      }

      sortData (event:any){
        const _table = this        
    //console.log(event) 
        if(event.direction == 'desc'){
          _table.desc = true
        } else {
          _table.desc = false
        }
        _table.order_by = event.active
        this.FilterChange ()

      }
      FilterChange (){
        const _table = this  
        let _sortting = []
        let _division_select =[]
       // _table.dataSource =_table.ApprovalSummary[_table.veiw_type]
       if(!this.divitionfilter) {this.divitionfilter='ALL'}
       if(this.divitionfilter=='') {this.divitionfilter='ALL'}

        if (this.divitionfilter != 'ALL') {
          _division_select = _table.ApprovalSummary[_table.veiw_type].filter(function(d:any){ return d.division ==  _table.divitionfilter})
        } else {
          _division_select = _table.ApprovalSummary[_table.veiw_type]
        }
 
        _table.paginator.length =_division_select.length
        
        if(_table.desc){
          _sortting =_table.sortByKey(_division_select,_table.order_by)
        } else {
          _sortting =_table.sortByKeyDesc(_division_select,_table.order_by)
        }
        _table.excellData=_sortting;
        if(_sortting.length <= _table.page_size) {
          _table.dataSource = new MatTableDataSource(_sortting);  
          _table.paginator.firstPage()
      //console.log('_sortting:',_sortting)
        }else {
          //_sortting.slice(_table.page_select * _table.page_size ,_table.page_size);   
          //console.log('_sortting:_table.page_select',_table.page_select,':_table.page_size',_table.page_size,_table.page_select * _table.page_size  ,'>>',  _sortting.slice(_table.page_select * _table.page_size ,_table.page_size))
          
                 _table.dataSource = new MatTableDataSource(_sortting.slice(_table.page_select * _table.page_size , (_table.page_select * _table.page_size) +  _table.page_size));  
                  
        }
        

       
      }
          getListIdeaNumber(userid:number,monthindex:string){
      const _table = this
      return   new Promise((resolve, reject) => {
 
        this.API.QueryBG('SELECT public.get_idea_in_month_list($1,$2) ',[userid,monthindex]).subscribe(function(output){
      //console.log(output)
         if(output[0]){
           let _my_ideas = output[0]['get_idea_in_month_list'][0]
           _table.listideanumber =output[0]['get_idea_in_month_list']
           resolve(_my_ideas) 
           //_table.Me.next({eventname:'BinddingObjectTarget',ObjectTarget:_table.ObjectTarget})
 
         } else {
          resolve({})
         }
       })
      
      })

    
 
  }

  OpenIdeaDetail(ideanumber:string){
  
  console.log('OpenIdeaDetail idea_id:',ideanumber.trim())
  //this.localVar.AppVars.next({eventname:'DirectToIdeaDetail', target:'MenuLeft', id:ideanumber})
  this.router.navigate([this.BaseHref], {
  queryParams: { ideanumber: ideanumber.trim() }
});
}

}
