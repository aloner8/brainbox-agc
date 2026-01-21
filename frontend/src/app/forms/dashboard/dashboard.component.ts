import {Component, OnInit, viewChild} from '@angular/core';
import {Observable, Subject} from "rxjs";
import {map} from "rxjs/operators";
import {VariablesService} from '../../variables.service'
import { ApiService } from '../../api.service';
import { UserService } from '../../user/user.service';
import { MatAccordion } from '@angular/material/expansion';
import { DatePipe } from '@angular/common';
import * as XLSX from 'xlsx';


@Component({
    selector: 'cus-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

    selectedIndex:number = 0
    departmentlist:any = []
    ObjectTarget:any =[]
    ObjectTargetExcel:any =[]
    ObjectTargetCustom:any =[]
    target_year:string ='2021'
    ApprovalSummary:any =[]
    ObjectTargetTotal:any ={}
    ObjectTargetCustomTotal:any ={}
    Me:Subject<any> = new Subject();
    divitionfilter:any
    accordion = viewChild.required(MatAccordion);
    default_date_range:any
    UserInfo:any
    constructor(private AppService:VariablesService , private API:ApiService,private user:UserService  ,private dateformat:DatePipe, ) {
        
    }

    ngAfterViewInit(): void {
        //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
        //Add 'implements AfterViewInit' to the class.
      //  console.log('ngAfterViewInit')
      this.accordion().openAll()
      
      }

    ngOnInit() {
      const  that = this
      console.log('ngOnInit')
      this.UserInfo = this.AppService.getVariable('UserHome')
    
        this.AppService.AppVars.subscribe(function(v:any){

                   switch (v.eventname) {
                       
                            case 'ExportExcel':
                              console.log('ExportExcel event received in DashboardComponent:', v)
                              if(v['target']){
                                if(  v['target'].toLowerCase() =='dashboard'){
                                        v['activeView'] =   that.selectedIndex
                                          if(v['target']){
                                            if(  v['target'].toLowerCase() =='dashboard'){
                                                    v['activeView'] =   that.selectedIndex          
                                                                      that.ObjectTargetGetExport(null)
                                              }
                                            }
                                          }
                                        }

                                break;  
                                    
                        default:
                            break;
                    }
        })
        let _ideas_filter = that.AppService.getVariable('datalistsources') 
        if(_ideas_filter){
     
          that.departmentlist = _ideas_filter['department_list']
      //console.log(that.UserInfo)
          this.getDateRange().then(function(dd){
            // that.BinddingObjectTarget( that.UserInfo.department_master_id,that.default_date_range.start_date,that.default_date_range.end_date)
            that.default_date_range=dd
            let datefilter = "'" +   that.dateformat.transform(that.default_date_range.start_date, 'yyyy-MM-dd hh:mm') + "' AND '" + that.dateformat.transform(that.default_date_range.end_date, 'yyyy-MM-dd hh:mm') + "'"
            //that.ObjectTargetFilterChange({division:0,date_range:datefilter})
            that.Me.next({eventname:'InitObjectTarget',target:'object_target_custom' ,dateRange:that.default_date_range  })
            that.Me.next({eventname:'InitObjectTarget', target:'object_target',dateRange:that.default_date_range  })

            // that.ApprovalFilterChange({division:0,selectYear:2022,selectMonth:2,selectYearEnd:2024,selectMonthEnd:2,viewtype:'M'})
            // that.AppliedFilterChange({division:0,selectYear:2022,selectMonth:2,selectYearEnd:2024,selectMonthEnd:2,viewtype:'M'})

          }) ;

         
        }
           
    }

    selectedIndexChange(event:any){
        const _table = this
   
    }
    StatusFilterChange(event:any) {

    }
   
    BinddingObjectTarget(division:number,start_date:string,end_date:string){
      const _table = this
  //console.log('BinddingObjectTarget:' ,division)
      if(division > 0){
       // this.API.Query('SELECT public.get_dashboard($1,$2,$3) ',[division,null,null]).subscribe(function(output){
        this.API.Query('SELECT public.get_dashboard($1,$2,$3) ',[division,null,null]).subscribe(function(output){
      //console.log(output)
         if(output[0]){
           let _my_ideas = output[0]['get_dashboard'][0]
           _table.ObjectTarget =_my_ideas['target_point']
           _table.Me.next({eventname:'BinddingObjectTarget',target:'object_target_custom',ObjectTarget:_table.ObjectTarget ,dateRange:_table.default_date_range  })

         }
       })
      } else {
       // this.API.Query('SELECT public.get_dashboard($1,$2,$3) ',[0,null,null]).subscribe(function(output){
        this.API.Query('SELECT public.get_dashboard($1,$2,$3) ',[0,null,null]).subscribe(function(output){
      //console.log(output)
         if(output[0]){
           let _my_ideas = output[0]['get_dashboard'][0]
           _table.ObjectTarget =_my_ideas['target_point']
           _table.Me.next({eventname:'BinddingObjectTarget',target:'object_target_custom',ObjectTarget:_table.ObjectTarget ,dateRange:_table.default_date_range  })

         }
       })
      }
        

    }

    getDateRange(){
      const _table = this
      return   new Promise((resolve, reject) => {
 
        this.API.Query('SELECT id,  period_ranges 	FROM public.object_targets 	where period_name = EXTRACT(YEAR FROM NOW())::text ',[]).subscribe(function(output){
      //console.log(output)
         if(output[0]){
           let _my_ideas = output[0]
           console.log('getDateRange',_my_ideas)
           resolve(_my_ideas) 
           //_table.Me.next({eventname:'BinddingObjectTarget',ObjectTarget:_table.ObjectTarget})
 
         } else {
          resolve({})
         }
       })
      
      })

    
 
  }

    ChildEvent(events:any){
    console.log(events)
     var datefilter = "'" +   this.dateformat.transform(events.daterangeStart, 'yyyy-MM-dd hh:mm') + "' AND '" + this.dateformat.transform(events.daterangeEnd, 'yyyy-MM-dd hh:mm') + "'"
    switch (events.sender) {
      case 'object-target':
             
           this.ObjectTargetFilterChange({division:events.divisionid,date_range:datefilter,target_year:events.target_year})
       
        break;
       case 'object-target-custom':
                   // let datefilter = "'" +   this.dateformat.transform(events.daterangeStart, 'yyyy-MM-dd hh:mm') + "' AND '" + this.dateformat.transform(events.daterangeEnd, 'yyyy-MM-dd hh:mm') + "'"
           this.ObjectTargetCustomFilterChange({division:events.divisionid,daterangeStart:events.daterangeStart,daterangeEnd:events.daterangeEnd,target_year:events.target_year})
       
        break;   
      default:
        break;
    }
     /*    if(events.sender=='object-target'){
           // this.BinddingObjectTarget(events.divisionid,this.default_date_range.start_date,this.default_date_range.end_date)
      
           let datefilter = "'" +   this.dateformat.transform(events.daterangeStart, 'yyyy-MM-dd hh:mm') + "' AND '" + this.dateformat.transform(events.daterangeEnd, 'yyyy-MM-dd hh:mm') + "'"
           this.ObjectTargetFilterChange({division:events.divisionid,date_range:datefilter,target_year:events.target_year})
        }
        if(events.sender=='object-target-custom'){
           // this.BinddingObjectTarget(events.divisionid,this.default_date_range.start_date,this.default_date_range.end_date)
      
           let datefilter = "'" +   this.dateformat.transform(events.daterangeStart, 'yyyy-MM-dd hh:mm') + "' AND '" + this.dateformat.transform(events.daterangeEnd, 'yyyy-MM-dd hh:mm') + "'"
           this.ObjectTargetCustomFilterChange({division:events.divisionid,date_range:datefilter,target_year:events.target_year})
        } */

      /*   if(events.sender=='approval'){
          this.ApprovalFilterChange({division:events.divisionid,veiwType:events.veiwType,selectYear:events.selectYear,selectMonth:events.selectMonth,selectYearEnd:events.selectYearEnd,selectMonthEnd:events.selectMonthEnd})
           
        }
        if(events.sender=='applied'){
          this.AppliedFilterChange({division:events.divisionid,veiwType:events.veiwType,selectYear:events.selectYear,selectMonth:events.selectMonth,selectYearEnd:events.selectYearEnd,selectMonthEnd:events.selectMonthEnd})
           
        } */
        
    }

          ObjectTargetFilterChange(event:any){
            const _table = this        
        //console.log(event)
        this.API.CallProcedure('fliter_object_target',{division:event.division,date_range:event.date_range,target_year:event.target_year?event.target_year:'2021'}).subscribe(function(rows:any){
       console.log('fliter_object_target:',rows)
              if(rows){
                  let _category_list = rows['category_list']
                  let _TotalCountIdea = rows['totalcountidea']
                  _table.target_year=event.target_year
                _table.ObjectTarget = [].concat(_category_list)         
                _table.ObjectTargetTotal = _TotalCountIdea;  
                _table.Me.next({eventname:'BinddingObjectTarget',target:'object_target',ObjectTarget:_table.ObjectTarget , ObjectTargetTotal: _table.ObjectTargetTotal })
              } else{
                /* _table.snackBar.openSnackBar( 'not found user data!!',
                  'OK', 'center', 'top', 'snack-style'); */
              }
              
            })
          }
              ObjectTargetCustomFilterChange(event:any){
            const _table = this        
        //console.log(event)
        let  period_ranges =  "['" + this.dateformat.transform(event.daterangeStart, 'yyyy-MM-dd') + "','" + this.dateformat.transform(event.daterangeEnd, 'yyyy-MM-dd') + "')"
        let _yearBegin = new Date(event.daterangeStart).getFullYear();
        this.API.CallProcedure('fliter_object_target_custom',{division:event.division,date_range:period_ranges,target_year : event.target_year}).subscribe(function(rows:any){
       console.log('fliter_object_target_custom:',rows)
              if(rows){
                  let _category_list = rows['category_list']
                  let _TotalCountIdea = rows['totalcountidea']
                _table.ObjectTargetCustom = [].concat(_category_list)         
                _table.ObjectTargetCustomTotal = _TotalCountIdea;  
                _table.Me.next({eventname:'BinddingObjectTarget',target:'object_target_custom',ObjectTarget:_table.ObjectTargetCustom , ObjectTargetTotal: _table.ObjectTargetCustomTotal })
              } else{
                /* _table.snackBar.openSnackBar( 'not found user data!!',
                  'OK', 'center', 'top', 'snack-style'); */
              }
              
            })
          }

      ObjectTargetGetExport(event:any){
            const _table = this        
        //console.log(event)
        this.API.CallProcedure('export_object_target',{target_year:_table.target_year}).subscribe(function(rows:any){
       console.log('export_object_target:',rows)
              if(rows){
                  let _category_list = rows['category_list']
                  let _TotalCountIdea = rows['totalcountidea']
                  _category_list.forEach((l:any) => {
                    if(l['actually']<0){
                      l['actually'] =  l['actually'] * -1 
                      l['payout'] = ""  
                       l['target'] = ""  
                    }
                  });
                _table.ObjectTargetExcel = [].concat(_category_list)         
               // _table.ObjectTargetCustomTotal = _TotalCountIdea;  
               // _table.Me.next({eventname:'BinddingObjectTarget',target:'object_target_custom',ObjectTarget:_table.ObjectTargetCustom , ObjectTargetTotal: _table.ObjectTargetCustomTotal })
                _table.ExportExcel('Object Target',_table.ObjectTargetExcel,{}) 
              } else{
                /* _table.snackBar.openSnackBar( 'not found user data!!',
                  'OK', 'center', 'top', 'snack-style'); */
              }
              
            })
          }

          ApprovalFilterChange(event:any){
            const _table = this        
        //console.log(event)

            

            if(event.veiwType=='M'){
              this.API.CallProcedure('fliter_summary_month',{division:event.division,select_year:event.selectYear,select_month:event.selectMonth,select_year_end:event.selectYearEnd,select_month_end:event.selectMonthEnd}).subscribe(function(rows:any){
            //console.log('fliter_summary_month:',rows)
                   if(rows){
                      
                       _table.ApprovalSummary[event.veiwType] = [].concat(rows['summary_amount']) 
                       let _wait_amonut  = rows['wait_amonut']                  
                       let _approval_amount =rows['approval_amount'] 
                       let _reject_amount = rows['not_approval_amount'] 
                       let _wait_days_avg = rows['wait_days_avg'] 
                       let _applied_days_avg = rows['applied_days_avg'] 

                     _table.Me.next({eventname:'ApprovalFilterChange',ApprovalSummary:_table.ApprovalSummary,wait_amonut:_wait_amonut ,approval_amount:_approval_amount,reject_amount:_reject_amount ,wait_days_avg:_wait_days_avg,applied_days_avg:_applied_days_avg  })
                   } else{
                     /* _table.snackBar.openSnackBar( 'not found user data!!',
                       'OK', 'center', 'top', 'snack-style'); */
                   }
                   
                 })
            } else {
              this.API.CallProcedure('fliter_summary_year',{division:event.division,select_year:event.selectYear,select_month:event.selectMonth,select_year_end:event.selectYearEnd,select_month_end:event.selectMonthEnd}).subscribe(function(rows:any){
            //console.log('fliter_summary_month:',rows)
                   if(rows){
                      
                       _table.ApprovalSummary[event.veiwType] = [].concat(rows['summary_amount']) 
                       let _wait_amonut  = rows['wait_amonut']                  
                       let _approval_amount =rows['approval_amount'] 
                       let _reject_amount = rows['not_approval_amount'] 
                       let _wait_days_avg = rows['wait_days_avg'] 
                       let _applied_days_avg = rows['applied_days_avg'] 
                     _table.Me.next({eventname:'ApprovalFilterChange',ApprovalSummary:_table.ApprovalSummary,wait_amonut:_wait_amonut ,approval_amount:_approval_amount,reject_amount:_reject_amount ,wait_days_avg:_wait_days_avg,applied_days_avg:_applied_days_avg  })
                   } else{
                     /* _table.snackBar.openSnackBar( 'not found user data!!',
                       'OK', 'center', 'top', 'snack-style'); */
                   }
                   
                 })
            }

          }
          AppliedFilterChange(event:any){
            const _table = this        
        //console.log(event)

            

            if(event.veiwType=='M'){
              this.API.CallProcedure('fliter_summary_month',{division:event.division,select_year:event.selectYear,select_month:event.selectMonth,select_year_end:event.selectYearEnd,select_month_end:event.selectMonthEnd}).subscribe(function(rows:any){
            //console.log('fliter_summary_month:',rows)
                   if(rows){
                      
                       _table.ApprovalSummary[event.veiwType] = [].concat(rows['summary_amount']) 
                       let _wait_amonut  = rows['wait_amonut']                  
                       let _applied_amount =rows['applied_amount'] 
                       let _reject_amount = rows['not_applied_amount'] 
                       let _wait_days_avg = rows['wait_days_avg'] 
                       let _applied_days_avg = rows['applied_days_avg'] 
                       
                     _table.Me.next({eventname:'AppliedFilterChange',ApprovalSummary:_table.ApprovalSummary,wait_amonut:_wait_amonut ,applied_amount:_applied_amount,reject_amount:_reject_amount ,wait_days_avg:_wait_days_avg,applied_days_avg:_applied_days_avg })
                   } else{
                     /* _table.snackBar.openSnackBar( 'not found user data!!',
                       'OK', 'center', 'top', 'snack-style'); */
                   }
                   
                 })
            } else {
              this.API.CallProcedure('fliter_summary_year',{division:event.division,select_year:event.selectYear,select_month:event.selectMonth,select_year_end:event.selectYearEnd,select_month_end:event.selectMonthEnd}).subscribe(function(rows:any){
            //console.log('fliter_summary_month:',rows)
                   if(rows){
                      
                       _table.ApprovalSummary[event.veiwType] = [].concat(rows['summary_amount']) 
                       let _wait_amonut  = rows['wait_amonut']                  
                       let _applied_amount =rows['applied_amount'] 
                       let _reject_amount = rows['not_applied_amount'] 
                       let _wait_days_avg = rows['wait_days_avg'] 
                       let _applied_days_avg = rows['applied_days_avg'] 

                     _table.Me.next({eventname:'AppliedFilterChange',ApprovalSummary:_table.ApprovalSummary,wait_amonut:_wait_amonut ,applied_amount:_applied_amount,reject_amount:_reject_amount,wait_days_avg:_wait_days_avg,applied_days_avg:_applied_days_avg })
                   } else{
                     /* _table.snackBar.openSnackBar( 'not found user data!!',
                       'OK', 'center', 'top', 'snack-style'); */
                   }
                   
                 })
            }

          }

          ExportExcel(sheetname:string,ExcelData:any,param:any){
               
                  const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet([{ 
                    A: "period",
                    B: "Category",  
                    C: "Divisions",    
                    D: "Payout",   
                    E: "Target",   
                    F: "Actually", 
                    G: "CompleteIdiea", 
                    H: "ImplementIdiea",  
                    I: "NotImplementIdiea",        
              }],{header: [], skipHeader: true});
          
            //  const paramworksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(param,{header: [], skipHeader: true});
                  
            
              XLSX.utils.sheet_add_json(worksheet, ExcelData, {skipHeader: true, origin: "A2"});
             let allrows = worksheet['!ref']?.split(':');

              for (let i = 2; i <= parseInt(allrows![1].replace(/[^\d]/g, '')); i++) {
                
                if (worksheet['E' + i].v != "") {   
                  console.log(worksheet['E' + i].v)  
                  console.log(worksheet['B' + i]) 
                       
                  if (worksheet['B' + i]) {
  worksheet['B' + i].s = {
    fill: {
      patternType: 'solid',
      fgColor: { rgb: 'BDD7EE' } // light blue color
    }
  };
}

                   if (!worksheet[`A${i}`].s) {
                        worksheet[`A${i}`].s = {};
                      }
                       worksheet[`A${i}`].s.fill = { fgColor: { rgb: "BDD7EE" } };

                /*    if (!worksheet['B' + i].s) {
                        worksheet['B' + i].s = {fill:{}};
                      }
                       worksheet['B' + i].s.fill = { fgColor: { rgb: "BDD7EE" } };
                      */
                   if (!worksheet[`C${i}`].s) {
                        worksheet[`C${i}`].s = {};
                      }
                       worksheet[`C${i}`].s.fill = { fgColor: { rgb: "BDD7EE" } };
                                   
                   if (!worksheet[`D${i}`].s) {
                        worksheet[`D${i}`].s = {};
                      }
                       worksheet[`D${i}`].s.fill = { fgColor: { rgb: "BDD7EE" } };
                                         
                   if (!worksheet[`E${i}`].s) {
                        worksheet[`E${i}`].s = {};
                      }
                       worksheet[`E${i}`].s.fill = { fgColor: { rgb: "BDD7EE" } };
                                        
                   if (!worksheet[`F${i}`].s) {
                        worksheet[`F${i}`].s = {};
                      }
                       worksheet[`F${i}`].s.fill = { fgColor: { rgb: "BDD7EE" } };
                                          
                   if (!worksheet[`G${i}`].s) {
                        worksheet[`G${i}`].s = {};
                      }
                       worksheet[`G${i}`].s.fill = { fgColor: { rgb: "BDD7EE" } };
                                        
                   if (!worksheet[`H${i}`].s) {
                        worksheet[`H${i}`].s = {};
                      }
                       worksheet[`H${i}`].s.fill = { fgColor: { rgb: "BDD7EE" } };
                                          
                   if (!worksheet[`I${i}`].s) {
                        worksheet[`I${i}`].s = {};
                      }
                       worksheet[`I${i}`].s.fill = { fgColor: { rgb: "BDD7EE" } };

                /*   const range = `A${i}:I${i}`;
                    if (worksheet[range]) { // Check if the cell exists
                      if (!worksheet[range].s) {
                        worksheet[range].s = {};
                      }
                      worksheet[range].s.fill = { fgColor: { rgb: "BDD7EE" } };
                    } */
                   
                }
              }

             // XLSX.utils.sheet_add_json(paramworksheet, param, {skipHeader: true, origin: "A1"});
              //console.log(worksheet )
                  
                  // const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
                 /*  const workbook: XLSX.WorkBook = {
                    Sheets: { Sheet1: worksheet },
                    SheetNames: [sheetname ],
                  }; */
              
                  const workbook: XLSX.WorkBook =  XLSX.utils.book_new() ;
          
                  XLSX.utils.book_append_sheet(workbook,worksheet,sheetname)
                 // XLSX.utils.book_append_sheet(workbook,paramworksheet,'Condition')
                 
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
   

}
