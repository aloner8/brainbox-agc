import {ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, inject, Input, NgZone, OnInit, Output, ViewChild} from '@angular/core';
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
import { TargetSettingDetailDialogComponent,LevelDetailDialogData, datalist } from './target-setting-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import { provideNativeDateAdapter } from '@angular/material/core';


export interface targetData {

  "seq": number,
  "target": number,
  "payout": number,  
  
  }
  
  

@Component({
    selector: 'target-setting',
    templateUrl: './target-setting.component.html',
    styleUrls: ['./target-setting.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [provideNativeDateAdapter()],
})
export class TargetSettingComponent implements OnInit {

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
    target_amount_row : targetData[]  =[]
    filter = 2016
    NumberOfPage = 20
    nextid = 0
    order_by='fullname'
    page_size=20
    page_select=1
    filterinput = ""
    filter_text='%%'
    desc=false
    list_target_year:datalist[] = []
    daterangeStart:any =''
    daterangeEnd:any =''
    id:number =0
    rowboderstyle='1px solid gray'
    displayedColumns: string[] = ['running', 'fullname',  'level' ,  'actions'];
    CurrentRange:Date = new Date()
    hasedit:boolean = false
  dataSource: MatTableDataSource<targetData> = new MatTableDataSource<targetData>;
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
  detail_data!: LevelDetailDialogData;  
  
    constructor( private VariablesService: VariablesService 
                , private api:ApiService 
                , private changeDetectorRefs: ChangeDetectorRef
                , private dateformat:DatePipe
                ,private DetailDialog: MatDialog
              ,private ngZone: NgZone ) {

   
    }

    ngOnInit() {
        const that = this
        const _table = this

        let _ideas_filter = _table.VariablesService.getVariable('datalistsources') 
        this.list_target_year = _ideas_filter['target_year_list']
        this.filter = this.list_target_year[this.list_target_year.length -1].value
        this.StatusFilterChange({})
      this.StatusFilterChange(null)
  /* 
        this.Parent.subscribe(function(v){
          //  var currentScreenSize=v['currentScreenSize'].toString()
          //  console.log(that.Size)
             
        }) */

    }
    ngAfterViewInit() {
   
      /*   this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;

        this.SendEvents.emit({eventname:'InitComplete',Name:this.Name})
 */
      }
    
      applyFilter(event: Event) {
        if(event.target){
       const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();
    
        if (this.dataSource.paginator) {
          this.dataSource.paginator.firstPage();
          
        }
        }
 
      }

      StatusFilterChange(event:any){
        const _table = this        
    //console.log({order_by:this.order_by,page_size:this.page_size,page_select:this.page_select, order_by_desc:this.desc , filter_text:this.filter_text  })
                            _table.target_amount_row =[]
        // this.api.Query("select id as running , description as fullname , minimum_point::text || ' - ' || maximum_point:text as level  , active as action  from public.level_masters",[]).subscribe(function(rows:any){
        _table.getData().then(function(r:any){
          _table.target_amount_row  = r['configs']
          console.log( _table.target_amount_row)
           let _array_date =  r.period_ranges.replace(')','').replace('[','').split(',')
           
            _table.id =  r.id
           // _table.dataSource = new MatTableDataSource(r);    
          //  _table.daterangeStart = new Date(_array_date[0]) 
          //  _table.daterangeEnd= new Date(_array_date[1]) 
          _table.changeDetectorRefs.detectChanges()
        }) 
        
      }
 
getData(){
        const _table = this       
    return   new Promise((resolve, reject) => { 
     this.api.QueryBG("select * from public.object_targets  where period_name =$1 order by period_name ",[this.filter]).subscribe(function(rows:any){
   //console.log('object_targets:',rows)
          if(rows){

                 _table.ngZone.run(() => {
      resolve(rows[0])
              let _my_ideas = rows[0]
              let _array_date =  _my_ideas.period_ranges.replace(')','').replace('[','').split(',')
           
          //  _table.id =  _my_ideas.id
            _table.dataSource = new MatTableDataSource(_my_ideas);    
            _table.daterangeStart = new Date(_array_date[0]) 
            _table.daterangeEnd= new Date(_array_date[1]) 
            //_table.dataSource._updateChangeSubscription()
            // _table.paginator._changePageSize(_table.page_size)
            // _table.paginator.length = rows['rowcount']             
                  
           // _table.target_amount_row = rows[0]['configs'] ; // triggers change detection
      });
         
          } else{
            /* _table.snackBar.openSnackBar( 'not found user data!!',
              'OK', 'center', 'top', 'snack-style'); */
              resolve([])
          }
          
        })
    });
      }
    paginatorChange(event:any){
      const _table = this
      
    //  console.log('paginatorChange:',event)
      _table.VariablesService.AppVars.next({
        "eventname": "VariablesChanging",
        "variablename": "MyIdeasSetPageSize",
        "value":  event
    })  
    }

    OpenDetail(row:any){
      const parent = this
  //console.log(row)
      if(row.id){

        parent.api.QueryBG("select * from public.level_masters where id =$1 ",[row.id]).subscribe(function(rows:any){
      //console.log('level_masters:',rows)
             if(rows){
                 let _my_ideas = rows[0]
                 _my_ideas['IsAdmin'] = parent.IsAdmin                 
                 const dialogRef = parent.DetailDialog.open(TargetSettingDetailDialogComponent, {
                  data: _my_ideas,
                });
            
                dialogRef.afterClosed().subscribe(result => {
                })  
               
             } else{
               /* _table.snackBar.openSnackBar( 'not found user data!!',
                 'OK', 'center', 'top', 'snack-style'); */
             }
             
           })
         }
       
    }
    OpenNewDetail(){
      const parent = this
      let row={
        "id": "6",
        "description": "*New Level",
        "minimum_point": 0,
        "maximum_point": 0,
        "active": 1,
        "created_at": "2021-03-12T03:47:48.000Z",
        "updated_at": "",
        "IsAdmin": parent.IsAdmin
    }
   
                 let _my_ideas = row 
                                
                 const dialogRef = parent.DetailDialog.open(TargetSettingDetailDialogComponent, {
                  data: _my_ideas,
                });
            
                dialogRef.afterClosed().subscribe(result => {
                })  
               
             
       
    }

    DateChange(ev:any){
  //console.log( ev)
  //console.log(this.daterangeStart,',',this.daterangeEnd)
      this.hasedit=true;

    }

    Save(){
      this.hasedit=false;       
      const _table = this    
      

      let  period_ranges =  "['" + this.dateformat.transform(this.daterangeStart, 'yyyy-MM-dd') + "','" + this.dateformat.transform(this.daterangeEnd, 'yyyy-MM-dd') + "')"

  //console.log({id:this.id,period_name:this.filter,period_ranges: period_ranges , configs: this.target_amount_row })
  this.api.CallProcedure('update_config_object_target',{id:this.id,period_name:this.filter,period_ranges: period_ranges.toString().replace(']',')') , configs: this.target_amount_row }).subscribe(function(rows:any){
 //console.log('update_config_object_target:',rows)
        if(rows){
         _table.StatusFilterChange('')
         
        } else{
          /* _table.snackBar.openSnackBar( 'not found user data!!',
            'OK', 'center', 'top', 'snack-style'); */
        }
        
      })
    }
    New(){

      

      let _lastyear = this.list_target_year[this.list_target_year.length -1].value
      
      _lastyear =  parseInt(_lastyear.toString())  +1
      let _answer = window.prompt('Please input period name.',_lastyear.toString())
      
      

  //console.log(_answer)
      if (_answer){
        this.filter =this.list_target_year[this.list_target_year.length -1].value
        this.StatusFilterChange('')
        setTimeout(() => {
          this.list_target_year.push({display:_lastyear.toString(),value:_lastyear,object:{}})
          this.filter=_lastyear
          this.daterangeStart.setFullYear( this.daterangeStart.getFullYear() + 1 )
          this.daterangeEnd.setFullYear( this.daterangeEnd.getFullYear() + 1 )  
          
      //console.log( this.daterangeStart,':', this.daterangeEnd.getFullYear())
        }, 500);
        
       
        this.hasedit=true;
      }
    }
    EditAmount(event:any){
      this.hasedit=true;
    }

   

}
