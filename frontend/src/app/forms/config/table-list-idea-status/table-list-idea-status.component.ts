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
import {IdeaStatusDetailDialogComponent} from './idea-status-dialog.component'
import { MatDialog } from '@angular/material/dialog';

export interface UsersData {

  "running": string,
  "fullname": string,
  "division": string,  
  "level": string,
  "totalideas": string,
  "actions": string,
  
  }
  
  export interface CommandButtonName {
    "id": number,
    "isideaby": boolean,
    "isdefaultcoordinator": boolean,
    "isadmin": boolean,
    "isapproveridea": boolean,
    "iscoordinatoridea": boolean,
    "ismember": boolean,
    "name_button":string
}

@Component({
    selector: 'table-list-idea-status',
    templateUrl: './table-list-idea-status.component.html',
    styleUrls: ['./table-list-idea-status.component.scss']
})
export class TableListIdeaStatusComponent implements OnInit {

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
    filter_text='%%'
    desc=false
    command_button_list = []
    
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

  
    constructor( private VariablesService: VariablesService 
                , private api:ApiService 
                , private changeDetectorRefs: ChangeDetectorRef
                ,private DetailDialog: MatDialog) {

   
    }

    ngOnInit() {
        const that = this
        const _table = this

        let _ideas_filter = _table.VariablesService.getVariable('datalistsources') 
        this.command_button_list=_ideas_filter['command_button_list']
        
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
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();
    
        if (this.dataSource.paginator) {
          this.dataSource.paginator.firstPage();
          
        }
      }

      StatusFilterChange(event:any){
        const _table = this        
    //console.log({order_by:this.order_by,page_size:this.page_size,page_select:this.page_select, order_by_desc:this.desc , filter_text:this.filter_text  })
            
        // this.api.Query("select id as running , description as fullname , minimum_point::text || ' - ' || maximum_point:text as level  , active as action  from public.level_masters",[]).subscribe(function(rows:any){
          this.api.Query("select id as running , description as fullname ,point  as division , u.countuser as totalideas , active as action  from public.project_statuses d left join  (SELECT current_status ,count(*) countuser from public.projects group by current_status  )  u on u.current_status = d.id  order by d.id ",[]).subscribe(function(rows:any){
   //console.log('level_masters:',rows)
          if(rows){
              let _my_ideas = rows
            _table.listusers = [].concat(_my_ideas)         
            _table.dataSource = new MatTableDataSource(_my_ideas);    
            _table.paginator._changePageSize(_table.page_size)
            _table.paginator.length = rows['rowcount']             
            
          } else{
            /* _table.snackBar.openSnackBar( 'not found user data!!',
              'OK', 'center', 'top', 'snack-style'); */
          }
          
        })
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
          if(row.running){
    
            parent.api.Query("select * from public.project_statuses where id =$1 order by id",[row.running]).subscribe(function(rows:any){
              
          //console.log('level_masters:',rows)
          //console.log(parent.command_button_list)
                if(rows){
                     let _my_ideas = rows[0]
                     _my_ideas['IsAdmin'] = parent.IsAdmin    
  
                      
                     _my_ideas['show_button'].forEach(function(b:CommandButtonName) {
                        let _name_button = parent.command_button_list.filter(function(nb:any){return nb.value == b.id })
                    //console.log(_name_button)
                        b['name_button']= _name_button[0]['display']
                     });

                     const dialogRef = parent.DetailDialog.open(IdeaStatusDetailDialogComponent, {
                      data: _my_ideas,
                    });
                
                    dialogRef.afterClosed().subscribe(result => {
                  //console.log(result)
                      if(result){
                        parent.api.CallProcedure('public.update_project_statuses',result).subscribe(function(updated){
                      //console.log('update_project_statuses:',updated)                        
                        })
                      }
                      
                    })  
                   
                 } else{
                   /* _table.snackBar.openSnackBar( 'not found user data!!',
                     'OK', 'center', 'top', 'snack-style'); */
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
