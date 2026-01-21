import {ChangeDetectorRef, Component, EventEmitter, inject, Input, OnInit, Output, ViewChild} from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { FloatLabelType } from '@angular/material/form-field';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import {Observable, Subject} from "rxjs";
import {map} from "rxjs/operators";
import {toSignal} from '@angular/core/rxjs-interop';
import { ApiService } from '../../../api.service';
import { VariablesService } from '../../../variables.service';
import { _getEventTarget } from '@angular/cdk/platform';
import { UserDetailDialogComponent,UserDetailDialogData } from '../table-list-user/user-dialog.component';
import { ImporttingDialog } from './importting-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import * as XLSX from 'xlsx';
import { SnackBarService } from '../../../snack-bar/snack-bar.service';
import { DatePipe } from '@angular/common';

export interface UsersData {

  "running": string,
  "fullname": string,
  "division": string,  
  "level": string,
  "totalideas": string,
  "actions": string,
  
  }
  
  
export interface ImportUsersData {

  "seq": number,
  "emp_num": string,
  "status_detail": string,  
  "division": string,
  "location": string,
  "aprover": string,
  "job_level": string,
  "is_new_emp": string,
  "status_update": string,
  "location_update": string,
  "isapprover_update": string,
  "approver_update": string,
  "devision_update": string,
  "devision_new": string,
 
  
  }
 
  export interface ImportCoordinatorData {
 
    "Division": string,
    "MTP1": string,  
    "MTP2": string,
    "PPD": string,
    "BKK": string ,
    "detail": string ,
    
    }
   
    export interface ImportApproverData {
 
    "Division": string,
    "Location": string,
    "empCode": string,  
    "empApprover": string,
    "empName": string,
    "ApproverName": string ,
    "detail": string ,
    "id": number ,
    "isapprover_update": string ,
    
    }
   

@Component({
    selector: 'table-list-users',
    templateUrl: './table-list-users.component.html',
    styleUrls: ['./table-list-users.component.scss']
})
export class TableListUserComponent implements OnInit {

    @Input() Parent:Subject<any> =  new Subject<any>()  ;
    @Input() Size:string ='Large'  ;
    @Input() Name:string ='IdeasList'
    @Input() IsAdmin:boolean = false;
    @Output() SendEvents : EventEmitter<any> = new EventEmitter();
    oreginalWidth =523;
    oreginalHeigth =237;
    currentWidth =523;
    currentHeight =237;
    currentSize = 1
    listusers : UsersData[]  =[]
    filter = ''
    NumberOfPage = 20
    nextid = 0
    order_by='fullname'
    page_size=20
    page_select=1
    filterinput = ""
    filter_text='%%'
    desc=false
    detail_data!: UserDetailDialogData;  
    excelData:any;
    rowboderstyle='1px solid gray'
    displayedColumns: string[] = ['running', 'fullname', 'division' , 'level' , 'totalideas' , 'actions'];
    showImportAll=true
   /*  {
      "seq": 13,
      "emp_num": "TP00014",
      "emp_status": "Active",
      "location": "BKK",
      "aprover": "TP00980",
      "division": "HR",
      "job_level": "Management (M)",
      "has_error": null,
      "is_new_emp": "",
      "status_update": "",
      "location_update": "",
      "id": 128,
      "isapprover_update": null,
      "devision_update": null,
      "devision_new": null,
      "status_detail": ""
  } */

      ImportColumns: string[] = ['seq'
              , 'emp_num'
              ,'emp_name_en'
              , 'status_detail'
              , 'division' 
              , 'location' 
              , 'emp_status' 
              , 'approver'
              , 'job_level'
              , 'is_new_emp'
              , 'status_update'
              , 'isapprover_update'
              , 'approver_update'
              , 'devision_update'
              , 'devision_new'
              , 'location_update'
               , 'email_update'
              , 'name_update'
              
             ];

             ImportColumnsApprover: string[] = [
  'empCode',
  'empName',
  'Location',
  'Division',
  'empApprover',
 // 'ApproverName',
  'detail',
  "isapprover_update"
];
                  /*  ImportColumnsApprover: string[] = [
                      "seq",
                      "Division",
                      "Location",
                      "empCode",  
                      "empApprover",
                      "empName",
                      "ApproverName",
                      "detail",
                      "id",
                   "isapprover_update"

                   ]; */

             ImportColumnsCoordinator: string[] = ['Division'
              , 'MTP1'
              , 'MTP2'
              , 'PPD' 
              , 'BKK' 
               ,'detail'
             ];

    modeImport:boolean = false
    modeImportApprover:boolean = false
    modeImportCoordinator:boolean = false
    current_row:number = -1
    process_row:number = 0
    importData:any
    importDataApprover:any
    importDataCoordinator:any
    input_search:any
  dataSource: MatTableDataSource<UsersData> = new MatTableDataSource<UsersData>;
  importDataSource: MatTableDataSource<ImportUsersData> = new MatTableDataSource<ImportUsersData>;
  importApproverDataSource: MatTableDataSource<ImportApproverData> = new MatTableDataSource<ImportApproverData>;
  importCoordinatorDataSource: MatTableDataSource<ImportCoordinatorData> = new MatTableDataSource<ImportCoordinatorData>;
  
  readonly hideRequiredControl = new FormControl(false);
  readonly floatLabelControl = new FormControl('auto' as FloatLabelType);
  readonly options = inject(FormBuilder).group({
    hideRequired: this.hideRequiredControl,
    floatLabel: this.floatLabelControl,
  });
  protected readonly hideRequired = toSignal(this.hideRequiredControl.valueChanges);
  protected readonly floatLabel = toSignal(
    this.floatLabelControl.valueChanges.pipe(map(v => v || 'auto')),
    {initialValue: 'auto'},
  );
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  @ViewChild(MatSort)
  sort!: MatSort;
  interval:any
  dialogRef:any
    constructor( private VariablesService: VariablesService 
                , private api:ApiService 
                , private changeDetectorRefs: ChangeDetectorRef
                ,private DetailDialog: MatDialog
              ,private dialogImport: MatDialog ,
              private snackBar:SnackBarService,
              private dateformat:DatePipe, 
             ) {

   
    }

    ngOnInit() {
        const that = this
        const _table = this

        let _ideas_filter = _table.VariablesService.getVariable('datalistsources') 
        
        //this.paginator.showFirstLastButtons=true
        this.StatusFilterChange(null)

        this.Parent.subscribe(function(d){
          //  var currentScreenSize=v['currentScreenSize'].toString()
           console.log(that.Size)
            console.log(d) 
          switch (d.eventname) {
                case 'ExportExcel':
                    console.log(d)  
                    if (that.modeImport){                      
                      let _changeUser = that.importDataSource.data.filter((item:any) => item.status_detail != '' )
                      that.ExportExcel('Import Users', _changeUser,{});
                    }
                    
                    break;
                        
                default:
                    break;
            }
             
        })

    }
    ngAfterViewInit() {
   
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;

        this.SendEvents.emit({eventname:'InitComplete',Name:this.Name})

      }
    
      applyFilter(event: Event) {
       // const filterValue = (event.target as HTMLInputElement).value;
      //  this.dataSource.filter = filterValue.trim().toLowerCase();
    //console.log(this.filterinput)
        this.filter_text = '%' + this.filterinput + '%'
        this.StatusFilterChange(null)
        this.paginator.firstPage();
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
        _table.StatusFilterChange(null)

      }

      StatusFilterChange(event:any){
        const _table = this        
    //console.log({order_by:this.order_by,page_size:this.page_size,page_select:this.page_select, order_by_desc:this.desc , filter_text:this.filter_text  })
    this.api.CallProcedure('fliter_users',{order_by:this.order_by,page_size:this.page_size,page_select:this.page_select, order_by_desc:this.desc , filter_text:this.filter_text}).subscribe(function(rows:any){
   //console.log('fliter_users:',rows)
          if(rows){
              let _my_ideas = rows['rowvisible']
            _table.listusers = [].concat(_my_ideas)         
            _table.dataSource = new MatTableDataSource(_my_ideas);  
            _table.paginator.length = rows['rowcount']             
            _table.paginator.showFirstLastButtons=true
          } else{
            /* _table.snackBar.openSnackBar( 'not found user data!!',
              'OK', 'center', 'top', 'snack-style'); */
          }
          
        })
      }
 ExportExcel(sheetname:string,ExcelData:any,param:any){
      
         let _excel_header:any =Object.keys(ExcelData[0])

       const _label = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z']
       let x:number = 0;
       let y:number = 0;
       let z:number = 0;
 
      
 
         for (let index = 0; index <  _excel_header.length; index++) {
           const element = _excel_header[index];
           
           if( index == this.ImportColumns.length - 1){
             const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet([_excel_header],{header: [], skipHeader: true});
  
           
             XLSX.utils.sheet_add_json(worksheet, ExcelData, {skipHeader: true, origin: "A2"});
            
             //console.log(worksheet )
                 
                 // const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
                /*  const workbook: XLSX.WorkBook = {
                   Sheets: { Sheet1: worksheet },
                   SheetNames: [sheetname ],
                 }; */
             
                 const workbook: XLSX.WorkBook =  XLSX.utils.book_new() ;
         
                 XLSX.utils.book_append_sheet(workbook,worksheet,sheetname)
                
                
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
 
         
     }
      changeshowImportAll(){
        const _table = this
        let _editOnly = _table.importData.filter(function(e:any){ return e.status_detail != '' })
if(_table.showImportAll){
  _table.importDataSource = new MatTableDataSource(_table.importData);  
  _table.paginator.length = _table.importData.length             
  _table.paginator.showFirstLastButtons=true
} else {
  _table.importDataSource = new MatTableDataSource(_editOnly);  
  _table.paginator.length = _editOnly.length             
  _table.paginator.showFirstLastButtons=true
}


      }

      CancelImport(){
        this.modeImport = false;
        this.modeImportApprover = false;
        this.modeImportCoordinator = false;

      }
    paginatorChange(event:any){
      const _table = this
      
 //console.log('paginatorChange:',event)
     _table.page_select = event.pageIndex + 1
     _table.page_size =event.pageSize
     _table.StatusFilterChange(null)
 /*      _table.VariablesService.AppVars.next({
        "eventname": "VariablesChanging",
        "variablename": "MyIdeasSetPageSize",
        "value":  event
    })  */ 
    }

    ImportpaginatorChange(event:any){
      const _table = this
      
 //console.log('paginatorChange:',event)
     _table.page_select = event.pageIndex + 1
     _table.page_size =event.pageSize
     _table.StatusFilterChange(null)
 /*      _table.VariablesService.AppVars.next({
        "eventname": "VariablesChanging",
        "variablename": "MyIdeasSetPageSize",
        "value":  event
    })  */ 
    }

    OpenDetail(userid:string){
      const _list = this
      this.api.QueryBG('SELECT public.get_user_profile($1) ',[userid]).subscribe(function(result){
    //console.log(result)             
        if(result[0]){
          _list.detail_data = result[0]['get_user_profile'][0]
          _list.detail_data['IsAdmin'] =_list.IsAdmin
          
          const dialogRef = _list.DetailDialog.open(UserDetailDialogComponent, {
            data: _list.detail_data,
          });            
          dialogRef.afterClosed().subscribe(result => {
            if(result){
          //console.log(result)
              _list.api.CallProcedure('public.update_user_detail',result).subscribe(function(updated){
            //console.log('update_user_detail:',updated)                        
                if(!updated['id']){
                  _list.snackBar.openSnackBar( 'not update user data!!',
                    'OK', 'center', 'top', 'snack-style');  
                }else{
                  _list.snackBar.openSnackBar(JSON.stringify( updated)  ,
                    'OK', 'center', 'top', 'snack-style');  
                }
              })
            } else {

            }
          })

        }           
        })
 
     


    }
    createNewUser(id:number): UsersData {
 

          const _myideas = this.listusers
         
        return {
          running: _myideas[id].running ,
          fullname: _myideas[id].fullname,
          division: _myideas[id].division ,
          level: _myideas[id].level , 
          totalideas: _myideas[id].totalideas ,
          actions: _myideas[id].actions ,
          
        };
      } 
      onSelect(event:any){
    //console.log(event)
        if(event.addedFiles[0]){
          const file = event.addedFiles[0];
          const reader = new FileReader();
          reader.onload = (e: any) => {
            const workbook = XLSX.read(e.target.result, { type: 'binary' });
            const firstSheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[firstSheetName];
            //worksheet['!rows']
            this.excelData = XLSX.utils.sheet_to_json(worksheet, { raw: false });
             if(this.excelData[0]['BKK'] && 
              this.excelData[0]['MTP1'] &&
              this.excelData[0]['MTP2'] &&
              this.excelData[0]['__EMPTY'] 
              ){
                let _jsonstr =  JSON.stringify(this.excelData).replace(/"__EMPTY":/g,'"Division":').replace(/"PPD1,2":/g,'"PPD":')

                this.importDataCoordinator = JSON.parse(_jsonstr)
            //console.log('Excel data:', this.importDataCoordinator);  
                this.modeImportCoordinator=true
                this.importCoordinatorDataSource = new MatTableDataSource(this.importDataCoordinator);  
                this.paginator.length = this.importDataCoordinator.length             
                this.paginator.showFirstLastButtons=true

            } else {
              alert('Invalid file format!')
            } 
            //console.log('Excel data:', this.excelData);
          };
          reader.readAsBinaryString(file);         
        }    
      }

       onSelectApprover(event:any){
        const _table = this;
    console.log(event)
        if(event.addedFiles[0]){
          const file = event.addedFiles[0];
          const reader = new FileReader();
          reader.onload = (e: any) => {
            const workbook = XLSX.read(e.target.result, { type: 'binary' });
            const firstSheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[firstSheetName];
            //worksheet['!rows']
            this.excelData = XLSX.utils.sheet_to_json(worksheet, { raw: false });
           // console.log(this.excelData);  
             if(this.excelData[0]['Employee Number'] && 
              this.excelData[0]['Employee Name EN'] &&
              this.excelData[0]['Location'] &&
              this.excelData[0]['(Division) Description (Label)'] &&
              this.excelData[0]['Default Approver'] 
              ){
                let _DataApprover:any = []
                let _approver_list:any = []

                

                      this.api.Query('SELECT public.get_appover_default() ',[]).subscribe(function(result){
    //console.log(result)             
        if(result[0]){
          _approver_list = result[0]['get_appover_default']
          console.log(_approver_list)

           _table.excelData .forEach((element:any, index:number) => {    
            let _approverCurrent = _approver_list.filter((item:any) => item.emp_code == element['Employee Number'] && item.empapprover==element['Default Approver'] )[0]
                  let _importRow =  {
                    id: index + 1,
                    Division: element['(Division) Description (Label)'],
                    Location: element['Location'],
                    empApprover: element['Default Approver'],
                    empCode: element['Employee Number'],
                    empName: element['Employee Name EN'],
                    ApproverName: '',
                    detail: _approverCurrent ?'':element['Default Approver']  ?'update approver default to ' + element['Default Approver'] : '',        
                    isapprover_update:  _approverCurrent ? 'N':element['Default Approver']  ?'Y':'N',             
                  };
                  



                  _DataApprover.push(_importRow)

                });
              _table.importDataApprover = [].concat(_DataApprover)
              console.log('Excel data:', _table.importDataApprover);  
                  
                  _table.importApproverDataSource = new MatTableDataSource(_table.importDataApprover);  
                  _table.paginator.length = _table.importDataApprover.length             
                  _table.paginator.showFirstLastButtons=true
                  _table.modeImportApprover=true
        }
      });


               

                //console.log(_jsonstr) 
                

            } else {
              alert('Invalid file format!')
            } 
            //console.log('Excel data:', this.excelData);
          };
          reader.readAsBinaryString(file);         
        }    
      }

      onSelectNext(event:any){
    //console.log(event)
        if(event.addedFiles[0]){
          const file = event.addedFiles[0];
          const reader = new FileReader();
          reader.onload = (e: any) => {
            const workbook = XLSX.read(e.target.result, { type: 'binary' });
            const firstSheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[firstSheetName];
            //worksheet['!rows']
            this.excelData = XLSX.utils.sheet_to_json(worksheet, { raw: false });
            console.log(this.excelData);

            
            if(this.excelData[0]['Employee Number'] && 
              this.excelData[0]['Employee Status'] &&
              this.excelData[0]['Location'] &&
              this.excelData[0]['(Division) Description (Label)']  
              ){
          
                this.dialogRef= this.dialogImport.open(ImporttingDialog, {
                  data: {caption:'start import  ',totalrow:0 , currentindex: 0},
                });  

                
                this.dialogRef.afterOpened().subscribe(() => {
               
                  this.current_row =  -1
                  this.process_row = 0
                  this.setTimer()
                   // console.log(this.ImportHRNext(_rowImport)) 
                   
                   // dialogRef._containerInstance._config.data= {caption:element['Employee Number'],totalrow:this.excelData.length , currentindex: index}
                    if(this.process_row == this.excelData.length - 1) {
                      this.dialogRef.close();
                    }
                
                })
                
            } else {
              alert('Invalid file format!')
            }
            //console.log('Excel data:', this.excelData);
          };
          reader.readAsBinaryString(file);         
        }     
      }

      ImportHRNext(excelDataRow:any){

        return   new Promise((resolve, reject) => {
           
          let _rowImport = {
           emp_num : excelDataRow['Employee Number'],
           emp_status : excelDataRow['Employee Status'],
           location : excelDataRow['Location'],
           approver : excelDataRow['Default Approver'],
           division : excelDataRow['(Division) Description (Label)'],
           job_level : excelDataRow['Job Category (Picklist Label)'],
           emp_name_en : excelDataRow['Employee Name EN'],
           emp_name_th : excelDataRow['Employee Name TH'],           
           business_email : excelDataRow['Business Email'],    
           seq:this.current_row,
          }

         

          this.api.QueryBG('SELECT public.check_users_import_hr_next_line($1) ',[_rowImport]).subscribe(function(result){
        //console.log(result)             
            if(result[0]){
              resolve(result[0]['check_users_import_hr_next_line']) 
            } else{
              resolve({}) 
            }             
            })
        })

      }

      UpdateImportHRNext(_rowImport:any){

        return   new Promise((resolve, reject) => {

          this.api.CallProcedure('public.update_user_import',_rowImport).subscribe(function(updated){
        //console.log(updated)             
            if(updated){
              resolve(updated) 
            } else{
              resolve({}) 
            }             
            })
        })

      }
           


       ImportApprover(excelDataRow:any){

        return   new Promise((resolve, reject) => {
           
          let _rowImport = {
           emp_num : excelDataRow['Employee Number'], 
           location : excelDataRow['Location'],
           approver : excelDataRow['Default Approver'],
           division : excelDataRow['(Division) Description (Label)'],    
           emp_name_en : excelDataRow['Employee Name EN'],
           emp_name_th : excelDataRow['Employee Name TH'],                     
           seq:this.current_row,
          }
          this.api.QueryBG('SELECT public.check_users_import_aprover_line($1) ',[_rowImport]).subscribe(function(result){
        //console.log(result)             
            if(result[0]){
              resolve(result[0]['check_users_import_aprover_line']) 
            } else{
              resolve({}) 
            }             
            })
        })

      }

      UpdateImportApprover(_rowImport:any){

        return   new Promise((resolve, reject) => {
           
                 this.api.CallProcedure('public.update_approver_default_import',_rowImport).subscribe(function(updated){
        console.log(updated)             
            if(updated){
              resolve(updated) 
            } else{
              resolve({}) 
            }             
            })
             
            
     
        })

      }

      UpdateImportCoordinator(_rowindex:number){

        return   new Promise((resolve, reject) => {

          this.api.CallProcedure('public.update_coordinator_import',this.importDataCoordinator[_rowindex]).subscribe(function(updated){
        //console.log(updated)             
            if(updated){             
              resolve(updated) 

            } else{
              resolve({}) 
            }             
            })
        })

      }


      setTimer() {
        const _table = this
        this.modeImport=true;
        this.importData = []
        this.interval = setInterval(() => {
         // console.log(this.process_row,'||',this.current_row)
          if(this.process_row !== this.current_row){
            this.current_row =this.process_row
            this.ImportHRNext(this.excelData[this.current_row]).then(function(row){
              _table.importData.push(row)
              _table.dialogRef.componentInstance.data= {caption:_table.excelData[_table.current_row]['Employee Number'],totalrow:_table.excelData.length , currentindex: _table.current_row}
              _table.process_row = _table.process_row +1
              if(_table.process_row >= _table.excelData.length ){
               
                
                _table.dialogRef.close()
                _table.importDataSource = new MatTableDataSource(_table.importData);  
                //_table.paginator.length = _table.importData['rowcount']             
                //_table.paginator.showFirstLastButtons=true
               //  _table.StatusFilterChange(null)
       
                clearInterval(_table.interval);
              }
              //console.log(row)
            })
          }
        }, 0);
      }
    ApproversetTimer() {
        const _table = this
        this.modeImport=true;
        this.importData = []
        this.interval = setInterval(() => {
         // console.log(this.process_row,'||',this.current_row)
          if(this.process_row !== this.current_row){
            this.current_row =this.process_row
            this.ImportApprover(this.excelData[this.current_row]).then(function(row){
              _table.importData.push(row)
              _table.dialogRef.componentInstance.data= {caption:_table.excelData[_table.current_row]['Employee Number'],totalrow:_table.excelData.length , currentindex: _table.current_row}
              _table.process_row = _table.process_row +1
              if(_table.process_row >= _table.excelData.length ){
               
                
                _table.dialogRef.close()
                _table.importDataSource = new MatTableDataSource(_table.importData);  
                //_table.paginator.length = _table.importData['rowcount']             
                //_table.paginator.showFirstLastButtons=true
               //  _table.StatusFilterChange(null)
       
                clearInterval(_table.interval);
              }
              //console.log(row)
            })
          }
        }, 0);
      }
    
      clearTimer() {
        clearInterval(this.interval);
        
      }
    
    

      ConfirmImportCoordinator(){
               
        this.current_row =  -1
        this.process_row = 0
        this.ConfirmImportCoordinatorsetTimer()
      }
            ConfirmImportApprover(){
              let _update = this.importDataApprover.filter((item:any) => item.isapprover_update == 'Y' )  
                for (let index = 0; index < _update.length; index++) {
                  const element = _update[index];
                  console.log(element)  
                  this.UpdateImportApprover(element).then(function(row:any){
                    console.log(row)
                  })
                  if(index == _update.length -1){
                    setTimeout(() => {
                      window.location.reload()
                     // _table.StatusFilterChange(null)
                    }, 1000); 
                  }
                  
                }
      }
      ConfirmImport(){
       
        this.dialogRef= this.dialogImport.open(ImporttingDialog, {
          data: {caption:'start import  ',totalrow:0 , currentindex: 0},
        });  

        
        this.dialogRef.afterOpened().subscribe(() => {
       
          this.current_row =  -1
          this.process_row = 0
          this.ConfirmImportsetTimer()
           // console.log(this.ImportHRNext(_rowImport)) 
           
           // dialogRef._containerInstance._config.data= {caption:element['Employee Number'],totalrow:this.excelData.length , currentindex: index}
            if(this.process_row == this.excelData.length - 1) {
              this.dialogRef.close();
            }
        
        })

       
      }

      ConfirmImportsetTimer() {
        const _table = this
        this.modeImport=true;    
        let _changeUser = _table.importDataSource.data.filter((item:any) => item.status_detail != '' )
        _table.importData = _changeUser
        this.interval = setInterval(() => {
         // console.log(this.process_row,'||',this.current_row)
          if(this.process_row !== this.current_row){
            this.current_row =this.process_row
            this.UpdateImportHRNext(_table.importData[this.current_row]).then(function(row:any){
            //console.log(_table.importData[_table.current_row].emp_num ,row)
              _table.dialogRef.componentInstance.data= {caption:_table.importData[_table.current_row].emp_num ,totalrow:_table.importData.length , currentindex: _table.current_row}
              _table.process_row = _table.process_row +1
              if(_table.process_row === _table.importData.length ){
               
                
                _table.dialogRef.close()
 
                clearInterval(_table.interval);
                _table.modeImport=false;   
                       setTimeout(() => {
                  window.location.reload()
                 // _table.StatusFilterChange(null)
                }, 1000);

              }
              //console.log(row)
            })
          }
        }, 0);
      }
    
      ConfirmImportApproversetTimer() {
        const _table = this
        this.modeImport=true;    
        this.interval = setInterval(() => {
         // console.log(this.process_row,'||',this.current_row)
          if(this.process_row !== this.current_row){
            this.current_row =this.process_row
            this.UpdateImportApprover(_table.importData[this.current_row]).then(function(row:any){
            //console.log(_table.importData[_table.current_row].emp_num ,row)
              _table.dialogRef.componentInstance.data= {caption:_table.importData[_table.current_row].emp_num ,totalrow:_table.importData.length , currentindex: _table.current_row}
              _table.process_row = _table.process_row +1
              if(_table.process_row === _table.importData.length ){
               
                
                _table.dialogRef.close()
 
                clearInterval(_table.interval);
                _table.modeImport=false;   
                       setTimeout(() => {
                  window.location.reload()
                 // _table.StatusFilterChange(null)
                }, 1000);

              }
              //console.log(row)
            })
          }
        }, 0);
      }

    ConfirmImportCoordinatorsetTimer() {
        const _table = this
        this.modeImportCoordinator=true;    
        this.interval = setInterval(() => {
         // console.log(this.process_row,'||',this.current_row)
          if(this.process_row !== this.current_row){
            this.current_row =this.process_row
            this.UpdateImportCoordinator(this.current_row).then(function(row:any){
            //console.log(_table.importDataCoordinator[_table.current_row] ,row)
                _table.importDataCoordinator[_table.current_row]['detail'] = row.status + row.detail
                _table.importCoordinatorDataSource = _table.importDataCoordinator
              _table.process_row = _table.process_row +1
              
              if(_table.process_row === _table.importDataCoordinator.length ){
                
                clearInterval(_table.interval);
                //_table.StatusFilterChange(null)
                // _table.modeImportCoordinator=true;   
                _table.modeImportCoordinator=true;   
                
                setTimeout(() => {
                  window.location.reload()
                 // _table.StatusFilterChange(null)
                }, 1000);
              }
              //console.log(row)
            })
          }
        }, 0);
      }
      ConfirmImportclearTimer() {
        clearInterval(this.interval);
        
      }


}
