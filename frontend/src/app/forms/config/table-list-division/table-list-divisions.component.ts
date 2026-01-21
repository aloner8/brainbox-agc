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
import { DivisionDetailDialogComponent,LevelDetailDialogData } from './division-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { SnackBarService } from '../../../snack-bar/snack-bar.service';

export interface UsersData {

  "running": string,
  "fullname": string,
  "division": string,  
  "level": string,
  "totalideas": string,
  "actions": string,
  
  }
  
  

@Component({
    selector: 'table-list-divisions',
    templateUrl: './table-list-divisions.component.html',
    styleUrls: ['./table-list-divisions.component.scss']
})
export class TableListDivisionComponent implements OnInit {

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

    
    rowboderstyle='1px solid gray'
    displayedColumns: string[] = ['running', 'fullname', 'division' ,  'totalideas' , 'actions'];
  

  dataSource: MatTableDataSource<UsersData> = new MatTableDataSource<UsersData>;
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
                ,private DetailDialog: MatDialog
               ,private snackBar:SnackBarService) {

   
    }

    ngOnInit() {
        const that = this
        const _table = this

        let _ideas_filter = _table.VariablesService.getVariable('datalistsources') 
        
    
        this.StatusFilterChange(null)

        this.Parent.subscribe(function(v){
          //  var currentScreenSize=v['currentScreenSize'].toString()
          //  console.log(that.Size)
             
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
    this.api.CallProcedure('fliter_divisions',{order_by:this.order_by,page_size:this.page_size,page_select:this.page_select, order_by_desc:this.desc , filter_text:this.filter_text}).subscribe(function(rows:any){
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
 

    paginatorChange(event:any){
      const _table = this
      
 //console.log('paginatorChange:',event)
     _table.page_select = event.pageIndex + 1
     _table.page_size =event.pageSize
     _table.StatusFilterChange(null)
    }

OpenDetail(row:any){
      const parent = this
  //console.log(row)
      if(row.value){

        parent.api.Query("select * from public.department_masters where id =$1 ",[row.value]).subscribe(function(rows:any){
      //console.log('level_masters:',rows)
             if(rows){
                 let _my_ideas = rows[0]
                 _my_ideas['IsAdmin'] = parent.IsAdmin                 
                 const dialogRef = parent.DetailDialog.open(DivisionDetailDialogComponent, {
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
    
    New(){

       
      let _answer = window.prompt('Please input new division name.',"")
  console.log(_answer)
      if (_answer){
            const _table = this        
    //console.log({order_by:this.order_by,page_size:this.page_size,page_select:this.page_select, order_by_desc:this.desc , filter_text:this.filter_text  })
    this.api.CallProcedure('insert_new_division',{division:_answer}).subscribe(function(rows:any){
 
      if(rows['status'] == 'error'){
   _table.snackBar.openSnackBar( rows['message_text'] + rows['detail_text'] + rows['hint_text'],
              'OK', 'center', 'top', 'snack-style'); 
      } else {
   _table.snackBar.openSnackBar(  rows['message_text'],
              'OK', 'center', 'top', 'snack-style'); 
      }
    })
  }
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

}
