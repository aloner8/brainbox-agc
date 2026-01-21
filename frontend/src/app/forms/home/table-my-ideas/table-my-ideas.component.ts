import {ChangeDetectorRef, Component, EventEmitter, inject, Input, OnInit, Output, ViewChild} from '@angular/core';
import { FormBuilder } from '@angular/forms';
import {FormGroup, FormControl, FormsModule, ReactiveFormsModule} from '@angular/forms';
import { FloatLabelType } from '@angular/material/form-field';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import {Observable, Subject} from "rxjs";
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {AsyncPipe} from '@angular/common';
import {LiveAnnouncer} from '@angular/cdk/a11y';
import {map, startWith} from "rxjs/operators";
import {toSignal} from '@angular/core/rxjs-interop';
import { ApiService } from '../../../api.service';
import { VariablesService } from '../../../variables.service';
import { provideNativeDateAdapter } from '@angular/material/core';
import {JsonPipe} from '@angular/common';
import { DatePipe} from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { SnackBarService } from '../../../snack-bar/snack-bar.service';
import { ExporttingDialog } from '../../ideas/table-list-ideas/exportting-dialog.component';
import * as XLSX from 'xlsx';

export interface MyIdeasData {

  "running": string,
  "subideasname": string,
  "ideasname": string,  
  "create_by": string,
  "division": string,
  "currentstatus": string,
  "suggest_date": number,
  "pointideas": number
  }
  export interface datalist {
    value:number;
    display: string;
    object: any;
  }
  /* export interface MyIdeasData {
    "points": number,
    "project_id": number,
    "running": "20240690",
    "logo": string,
    "ideasname": string,
    "subideasname": string,
    "pointcategory": number,
    "create_by": string,
    "division": string,
    "currentstatus": string,
    "pointstatus": number,
    "suggest_date": number,
    "pointideas": number
    } */
  
  /** Constants used to fill up our data base. */
  const FRUITS: string[] = [
    'blueberry',
    'lychee',
    'kiwi',
    'mango',
    'peach',
    'lime',
    'pomegranate',
    'pineapple',
  ];
  const NAMES: string[] = [
    'Maia',
    'Asher',
    'Olivia',
    'Atticus',
    'Amelia',
    'Jack',
    'Charlotte',
    'Theodore',
    'Isla',
    'Oliver',
    'Isabella',
    'Jasper',
    'Cora',
    'Levi',
    'Violet',
    'Arthur',
    'Mia',
    'Thomas',
    'Elizabeth',
  ];

@Component({
    selector: 'table-my-ideas',
    templateUrl: './table-my-ideas.component.html',
    styleUrls: ['./table-my-ideas.component.scss']
})
export class TableMyIdeasComponent implements OnInit {

    @Input() Parent:Subject<any> =  new Subject<any>()  ;
    @Input() Size:string ='Large'  ;
    //@Input() statuslist:any=[];

     

     range = new FormGroup({
          start: new FormControl<Date | null>(null),
          end: new FormControl<Date | null>(null),
        });
        myhome:any
        stateChanges:Subject<any> =  new Subject<any>()  ;
        daterangeStart:any
        daterangeEnd:any
        blankList:datalist = {value:0,display:'-',object:{}}
        oreginalWidth =523;
        oreginalHeigth =237;
        currentWidth =523;
        currentHeight =237;
        currentSize = 1
        lightimg:boolean= false;
        captionlevelfontsize = 'large'
        captionsubfontsize = 'small'
        captioninfofontsize = 'small'
        iconinfofontsize = 'small'
        firstRow = '.'
        topcaptionstart =20
        pathD = 'M51,93.5C51,54.6,82.6,23,121.5,23h372.1c11.6,0,17.4,0,21.8,2.3c3.5,1.9,6.4,4.8,8.3,8.3C526,38,526,43.8,526,55.4v38.1v38.1c0,11.6,0,17.4-2.3,21.8c-1.9,3.5-4.8,6.4-8.3,8.3c-4.4,2.3-10.2,2.3-21.8,2.3H121.5	C82.6,164,51,132.4,51,93.5z';
        rowboderstyle='1px solid gray'
        displayedColumns: string[] = ['running', 'title', 'idea_by',  'current_status' , 'suggest_date' , 'pointideas'];
        listidieas:any = []
        statuslist:any = []
        categorylist:any = []
      approverlist:datalist[] = []
      coordinatorlist:datalist[] = []
        departmentlist:any = []
        statusfilter:string = '0'
        categoryfilter:string = '0'
        approverfilter:datalist=this.blankList;
        coordinafilter:datalist=this.blankList;
        divitionfilter:string = '0'
        datefilter:any
        filter = ''
        NumberOfPage = 20
        nextid = 0
        order_by='running'
        page_size=20
        page_select=1
        filterinput = ""
        filter_text='%%'
        desc=true
        daterange:any
            dialogRef:any
    exportPage:number =-1
    CurrentExportPage:number =-1
    interval:any=0
        ControlApprove_1 = new FormControl<datalist>(this.blankList);
        filteredApprove_1: Observable<datalist[]> =this.ControlApprove_1.valueChanges.pipe(
          startWith(''),
          map(value => {
            const display = typeof value === 'string' ? value : value?.display;
            return display ? this._filterApprove(display as string) : this.approverlist;
          }),
        ); 
      ControlCoordinator_1 = new FormControl<datalist>(this.blankList);
          filteredCoordinator_1: Observable<datalist[]> =this.ControlCoordinator_1.valueChanges.pipe(
            startWith(''),
            map(value => {
              const display = typeof value === 'string' ? value : value?.display;
              return display ? this._filterCoordinator(display as string) : this.coordinatorlist;
            }),
          ); 

  dataSource: MatTableDataSource<MyIdeasData> = new MatTableDataSource<MyIdeasData>;
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
  BaseHref=''
  
    constructor( private VariablesService:VariablesService 
      , private api:ApiService 
      ,  private changeDetectorRefs: ChangeDetectorRef
      ,private dialogExport: MatDialog ,
                    private snackBar:SnackBarService
                    ,private dateformat:DatePipe,) {

     
     
   
    }

    ngOnInit() {
        const that = this
        this.BaseHref = this.api.getBaseHref();
        
        setTimeout(() => {
           this.myhome = this.VariablesService.getVariable('UserHome')
       let _ideas_filter = this.VariablesService.getVariable('datalistsources') 
    this.StatusFilterChange(null);
     
          if(_ideas_filter){
            this.statuslist = [].concat(_ideas_filter['status_list']) 
            this.coordinatorlist = _ideas_filter['coordinator_list']
            this.categorylist = _ideas_filter['category_list']
            this.approverlist = _ideas_filter['appover_list']
            this.departmentlist = _ideas_filter['department_list']
            this._filterApprove('')
              this._filterCoordinator('')
          }
        }, 2000);
      
  
         
        this.Parent.subscribe(function(v){
         /* 
        that.myhome = that.VariablesService.getVariable('UserHome')
       let _ideas_filter = that.VariablesService.getVariable('datalistsources') 
   
     
          if(_ideas_filter){
            that.statuslist = [].concat(_ideas_filter['status_list']) 
            that.coordinatorlist = _ideas_filter['coordinator_list']
            that.categorylist = _ideas_filter['category_list']
            that.approverlist = _ideas_filter['appover_list']
            that.departmentlist = _ideas_filter['department_list']
          } */
           if(v.eventname == 'ExportExcel'){
            if(v.activeView == 0) {
              that.onExportExcel();
            }
           }
        })
           
        
    }
    ngAfterViewInit() {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }


      OpenDetail(runningnumber:string){
       //  console.log(runningnumber)
          // this.VariablesService.setVariable('CurrentPage','ideas-detail')
          // this.VariablesService.setVariable('CurrentProjectID',runningnumber)
          this.VariablesService.AppVars.next({eventname:'SelectIdeaDetail', target:'MenuLeft', id:runningnumber})
        }
    
        applyFilter(event: Event) {

          this.filter_text = '%' + this.filterinput.trim() + '%'
          this.StatusFilterChange( this.filter_text)
          /* const filterValue = (event.target as HTMLInputElement).value;
          this.dataSource.filter = filterValue.trim().toLowerCase();
      
          if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
            
          } */
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
        
        paginatorChange(event:any){
          const _table = this        
     //console.log('paginatorChange:',event)
         _table.page_select = event.pageIndex + 1
         _table.page_size =event.pageSize
         _table.StatusFilterChange('paginatorChange')  
        }
  
        DateChange(event:any){
         // console.log('this.range.controls.start.value:',this.range.controls.start.value)
         // console.log('this.range.controls.end.value:',this.range.controls.end.value)
      //console.log('this.range:',this.range)
      //console.log('this.daterange:',this.daterange)
      //console.log('this.daterangeStart:',this.daterangeStart)
      //console.log('this.daterangeEnd:',this.daterangeEnd)
          
  
         // if(this.range.value){
            //this.datefilter = [this.range.controls.start.value,this.range.controls.end.value]
            this.StatusFilterChange(this.range.value)
        //  }
        }
  
        StatusFilterChange(event:any){
          const _table = this    
  
          if(event != 'paginatorChange'){
            this.page_select = 1
          }
      //console.log(this.range)
          if(this.range.value.start  && this.range.value.end){
            
            _table.datefilter = "'" +   _table.dateformat.transform(this.range.value.start, 'yyyy-MM-dd hh:mm') + "' AND '" + _table.dateformat.transform(this.range.value.end, 'yyyy-MM-dd hh:mm') + "'"
          } else {
            delete this.datefilter
          }
          
      //console.log(this.datefilter)
          let _input_parameter =  {id:_table.myhome['id'], order_by:this.order_by && this.order_by != '' ?this.order_by:'running' ,page_size:this.page_size,page_select:this.page_select, order_by_desc:this.order_by && this.order_by != '' ?this.desc:true , filter_text:this.filter_text ,status_filter:this.statusfilter , approver_filter:this.approverfilter?.value ,coordinator_filter:this.coordinafilter?.value ,division_filter:this.divitionfilter?this.divitionfilter:0,date_filter:this.datefilter , category_filter:this.categoryfilter   }
      //console.log(_input_parameter)
      this.api.CallProcedure('fliter_my_ideas',_input_parameter).subscribe(function(rows:any){
     //console.log('fliter_ideas:',rows)
            if(rows){
                let _my_ideas = rows['rowvisible']
             // _table.listusers = [].concat(_my_ideas)  
              _table.myhome['my_ideas']=       
              _table.dataSource = new MatTableDataSource(_my_ideas);  
              _table.paginator.length = rows['rowcount']             
              _table.paginator.showFirstLastButtons=true
            } else{
              /* _table.snackBar.openSnackBar( 'not found user data!!',
                'OK', 'center', 'top', 'snack-style'); */
            }
            
          })
        }
        

      StatusFilterChangeOld(event:any){
        const _table = this
        this.api.Query('SELECT public.get_my_ideas($1,$2,$3,$4,$5) ',[_table.myhome['id'],this.statusfilter,this.categoryfilter,this.approverfilter,this.coordinafilter]).subscribe(function(output){
        //  console.log(output)
          if(output[0]){
            let _my_ideas = output[0]['get_my_ideas']

            _table.myhome['my_ideas'] = [].concat(_my_ideas)      
   
           // const users = Array.from({length:  _table.myhome['my_ideas'].length -1 }, (_, k) => _table.createNewUser(k + 1));
          //  console.log('myhome:',_table.myhome )
      
            // Assign the data to the data source for the table to render
            _table.dataSource = new MatTableDataSource(_my_ideas);
            _table.paginator.getNumberOfPages()
            _table.paginator._changePageSize(5)
            _table.paginator.length = _table.myhome['my_ideas'].length 
          //  _table.changeDetectorRefs.detectChanges();
            //_table.localVar.setVariable('UserHome',_userHome) 

            
          } else{
            /* _table.snackBar.openSnackBar( 'not found user data!!',
              'OK', 'center', 'top', 'snack-style'); */
          }
          
        })
      }
    setSize(){
        
        switch (this.Size) {
            case 'XLarge': 
                    this.currentSize=0.9;
                    this.captionlevelfontsize='larger';
                    this.captionsubfontsize='small';
                    this.captioninfofontsize='small';
                    this.iconinfofontsize='small';
                    this.firstRow='.';
                    this.topcaptionstart=20;
                     break;              
            case 'Large': 
                    this.currentSize=0.7 ;
                    this.captionlevelfontsize='large';
                    this.captionsubfontsize='small';
                    this.captioninfofontsize='small';
                    this.iconinfofontsize='small';
                    this.topcaptionstart=20;
                    this.firstRow='.'; 
                    break;
            case 'Medium': 
                    this.currentSize=0.6;
                    this.captionlevelfontsize='medium';
                    this.captionsubfontsize='x-small';
                    this.captioninfofontsize='x-small';
                    this.iconinfofontsize='x-small';
                    this.topcaptionstart=10;
                    this.firstRow='';  
                    break;
            case 'Small': 
                    this.currentSize=0.55; 
                    this.captionlevelfontsize='small'; 
                    this.captionsubfontsize='xx-small';
                    this.captioninfofontsize='xx-small';
                    this.iconinfofontsize='xx-small';
                    this.firstRow=''; 
                    this.topcaptionstart=10;
                    break;
            case 'XSmall': 
                    this.currentSize=0.3;
                    this.captionlevelfontsize='smaller'; 
                    this.captionsubfontsize='xx-small';
                    this.captioninfofontsize='xx-small';
                    this.iconinfofontsize='xx-small';
                    this.firstRow=''; 
                    break;
            
        
            default:
                break;
        }
        this.currentWidth =this.oreginalWidth *  this.currentSize;
        this.currentHeight =this.oreginalHeigth *  this.currentSize;
    }

    paginatorChangeOld(event:any){
      const _table = this
    //  console.log('paginatorChange:',event)
      _table.VariablesService.AppVars.next({
        "eventname": "VariablesChanging",
        "variablename": "MyIdeasSetPageSize",
        "value":  event
    })  
    }
       displayFn(user: datalist): string {
            return user && user.display ? user.display : '';
          }
      
          displayFnMember(user: datalist): string {
            return user && user.display && user.display.split(']')[1] && user.display.split(']')[1].split('[')[0]? user.display.split(']')[1].split('[')[0] : '';
            
            
          }
    createNewUser(id:number): MyIdeasData {
 

          const _myideas = this.myhome ["my_ideas"]
         
        return {
          running: _myideas[id].running ,
          subideasname: _myideas[id].subideasname,
          ideasname: _myideas[id].ideasname ,
          create_by: _myideas[id].create_by ,
          division: _myideas[id].division ,
          currentstatus: _myideas[id].currentstatus ,
          suggest_date: _myideas[id].suggest_date ,
          pointideas: _myideas[id].pointideas         
        };
      } 

      
            private _filterApprove(name: string): datalist[] {
              const filterValue = name.toLowerCase();      
            // console.log(this.approverlist)
              return this.approverlist.filter(option => option.display.toLowerCase().includes(filterValue));
            }
      
                private _filterCoordinator(name: string): datalist[] {
                  const filterValue = name.toLowerCase();      
               //  console.log(this.approverlist)
                  return this.coordinatorlist.filter(option => option.display.toLowerCase().includes(filterValue));
                }

 ExportOnePage(pagenumber:any){
        const _table = this    
        return   new Promise((resolve, reject) => {
     
        if(this.range.value.start  && this.range.value.end){          
          _table.datefilter = "'" +   _table.dateformat.transform(this.range.value.start, 'yyyy-MM-dd hh:mm') + "' AND '" + _table.dateformat.transform(this.range.value.end, 'yyyy-MM-dd hh:mm') + "'"
        } else {
          delete this.datefilter
        }
                
        let _input_parameter =  {id:_table.myhome['id'],order_by:this.order_by,page_size:this.page_size,page_select:pagenumber, order_by_desc:this.desc , filter_text:this.filter_text ,status_filter:this.statusfilter , approver_filter:this.approverfilter?.value ,coordinator_filter:this.coordinafilter?.value ,division_filter:this.divitionfilter?this.divitionfilter:0,date_filter:this.datefilter , category_filter:this.categoryfilter    }
      console.log('_input_parameter:',_input_parameter)
          this.api.CallProcedure('export_my_ideas_list',_input_parameter).subscribe(function(rows:any){
      console.log('export_ideas_list:',rows)
              if(rows){
                resolve(rows['rowvisible'])            
              } else{
                /* _table.snackBar.openSnackBar( 'not found user data!!',
                  'OK', 'center', 'top', 'snack-style'); */
              }
              
            })

        })
      }

      
      setTimer() {
        const _table = this
        
         const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet([{ 
        A:"Idea No.",
  B:"linkurl",
  c:"Name",
  D:"Division",
  E:"Title",
  F:"Date issued",
  G:"Status",
  H:"Active",
  I:"Category",
  K:"Members",
  L:"Total person",
  J:"Sub Category",
  M:"Group",
  N:"Present Situation",
  O:"Innovation Detail",
  P:"Expect Result",
  Q:"Ext. Partner",
  R:"Partner Name",
  S:"Calculation Text",
  T:"Investment Plan",
  U:"Investment Actual",
  V:"Cost Saving Plan",
  W:"Cost Saving Actual",
  X:"IG Expected Plan",
  Y:"IG Expected Actual",
  Z:"Note",
  AA:"Approver Level 1",
  AB:"Approve date 1",
  AC:"Approver Level 2",
  AD:"Approve date 2",
  AE:"Approver Level 3",
  AF:"Approve date 3",
  AG:"Implemented Date",
  AH:"Coordinator Level 1",
  AI:"Applied date by Coordinator L1",
  AJ:"Coordinator Level 2",
  AK:"Applied date by Coordinator L2",
  AL:"Coordinator Level 3",
  AM:"Applied date by Coordinator L3",
  AN:"Like",
  AO:"Score In Month(Points)",
  AP:"Score In Month(Date)",
  AQ:"Idea Score",
  AR:"Hard Saving",
  AS:"Soft Saving",
  AT:"MOC Ref",
  AU:"Work Instruction Ref",
  Av:"Other",
           

       }],{header: [], skipHeader: true}); 

 
  
  
  

        this.interval = setInterval(() => {
         // console.log(this.process_row,'||',this.current_row)
          if(this.exportPage !== this.CurrentExportPage){
            this.CurrentExportPage =this.exportPage
            this.ExportOnePage(this.CurrentExportPage).then(function(row:any){
              
              _table.dialogRef.componentInstance.data= {caption:'Export Ideas list ...',currentPageData: row, totalrow:_table.paginator.getNumberOfPages() , currentindex: _table.CurrentExportPage}
              let _rowbegin =  'A' + (((_table.CurrentExportPage-1) * _table.page_size) +2).toString()
          //console.log('_rowbegin:',_rowbegin)
              XLSX.utils.sheet_add_json(worksheet, row, {skipHeader: true, origin: _rowbegin});
 
              _table.exportPage = _table.exportPage +1
              if(_table.exportPage === _table.paginator.getNumberOfPages() +1 ){
               // worksheet['!B'][ALL].addHyperlink = { Target: 'value' , Tooltip: 'Go to Google' };
               // worksheet['!B'][ALL].addHyperlink = { Target: 'value' , Tooltip: 'Go to Google' };
                //worksheet['!B'].autoConvertFormulas = true;

                  const range = XLSX.utils.decode_range(worksheet['!ref'] || 'A1:A1');
                  const rowCount = range.e.r + 2; // e.r is the 0-indexed last row, so add 1
                console.log('rowCount:',rowCount  )

                  for (let wsi = 2; wsi < rowCount; wsi++) {
                    const cellAddress = `B${wsi}`;
                    console.log('cellAddress:',cellAddress)
                    let _row =  XLSX.utils.encode_row(wsi);
                    console.log('_row:',_row  )
                    worksheet[cellAddress].f =worksheet[cellAddress].v
                    console.log('worksheet[cellAddress]:',worksheet[cellAddress]  ) 
                    
                    if(wsi==rowCount -1){
                      const workbook: XLSX.WorkBook =  XLSX.utils.book_new() ;
                      
                      XLSX.utils.book_append_sheet(workbook,worksheet,'Ides List')            
                    
                      const fileName = 'IdesList_'+  _table.dateformat.transform(new Date(),'YYYY_MM_dd@HH:mm:ss' ) +'.xlsx';

                      _table.dialogRef.close()
              
                      XLSX.writeFile(workbook,fileName)

                      clearInterval(_table.interval);
                    }
                  }

                

              }
              //console.log(row)
            })
          }
        }, 0);
      }
    
    
      clearTimer() {
        clearInterval(this.interval);
        
      }
     onExportExcel(){
         //console.log(event)
 
               
                     this.dialogRef= this.dialogExport.open(ExporttingDialog, {
                       data: {caption:'start import  ',totalrow:0 , currentindex: 0},
                     });  
     
                     
                     this.dialogRef.afterOpened().subscribe(() => {
                      this.exportPage =1
                      this.CurrentExportPage =0


                       this.setTimer()
                        // console.log(this.ImportHRNext(_rowImport)) 
                        
                        // dialogRef._containerInstance._config.data= {caption:element['Employee Number'],totalrow:this.excelData.length , currentindex: index}
                         if(this.exportPage == this.paginator.getNumberOfPages()) {
                           this.dialogRef.close();
                         }
                     
                     })
                      
           }
       

}
