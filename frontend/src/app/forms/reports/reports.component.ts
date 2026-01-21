import {Component, OnInit, viewChild} from '@angular/core';
import {Observable, Subject} from "rxjs";
import {map} from "rxjs/operators";
import {VariablesService} from '../../variables.service'
import { ApiService } from '../../api.service';
import { UserService } from '../../user/user.service';
import { DatePipe } from '@angular/common';


@Component({
    selector: 'cus-reports',
    templateUrl: './reports.component.html',
    styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit {

    selectedIndex:number = 0
    departmentlist:any = []
    statuslist:any = []
    ObjectTarget:any =[]
    ApprovalSummary:any =[]
    ObjectTargetTotal:any ={}
    Me:Subject<any> = new Subject();
    divitionfilter:any
    ActiveView:string=''
    
    default_date_range:any
    UserInfo:any
    constructor(private AppService:VariablesService , private API:ApiService,private user:UserService  ,private dateformat:DatePipe, ) {
        
    }

    ngAfterViewInit(): void {
        //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
        //Add 'implements AfterViewInit' to the class.
      //  console.log('ngAfterViewInit')
      
      }

    ngOnInit() {
      const  that = this
    //  console.log('ngOnInit')

      this.UserInfo = this.AppService.getVariable('UserHome')
      this.ActiveView = 'Total Ideas & Ideas/Person'
        this.AppService.AppVars.subscribe(function(v:any){

          if(v.target=='reports'){
            if(v.eventname=='ExportExcel'){
              v['activeView'] = that.ActiveView              
              setTimeout(() => {
                that.Me.next(v)  
              }, 500);
              
            }
      

            
          }
      //console.log('formevent:',v)
        })
        let _ideas_filter = that.AppService.getVariable('datalistsources') 
        if(_ideas_filter){
     
          that.departmentlist = _ideas_filter['department_list']
          that.statuslist = _ideas_filter['status_list']
      //console.log(that.UserInfo)
 

         
        }
       setTimeout(() => {
        this.Me.next({eventname:'selectedIndexChange',activeView:  this.ActiveView   })
       }, 200);
        
    }

    selectedIndexChange(event:any){
        const _table = this
    //console.log('selectedIndexChange:',event.tab.textLabel)
        this.ActiveView = event.tab.textLabel
        _table.Me.next({eventname:'selectedIndexChange',activeView: event.tab.textLabel   })
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
           _table.Me.next({eventname:'BinddingObjectTarget',ObjectTarget:_table.ObjectTarget ,dateRange:_table.default_date_range  })

         }
       })
      } else {
       // this.API.Query('SELECT public.get_dashboard($1,$2,$3) ',[0,null,null]).subscribe(function(output){
        this.API.Query('SELECT public.get_dashboard($1,$2,$3) ',[0,null,null]).subscribe(function(output){
      //console.log(output)
         if(output[0]){
           let _my_ideas = output[0]['get_dashboard'][0]
           _table.ObjectTarget =_my_ideas['target_point']
           _table.Me.next({eventname:'BinddingObjectTarget',ObjectTarget:_table.ObjectTarget ,dateRange:_table.default_date_range  })

         }
       })
      }
        

    }

    getDateRange(){
      const _table = this
      return   new Promise((resolve, reject) => {
 
        this.API.Query('SELECT public.get_ideas_default_date_range($1) ',[0]).subscribe(function(output){
      //console.log(output)
         if(output[0]){
           let _my_ideas = output[0]['get_ideas_default_date_range'][0]
           resolve(_my_ideas) 
           //_table.Me.next({eventname:'BinddingObjectTarget',ObjectTarget:_table.ObjectTarget})
 
         } else {
          resolve({})
         }
       })
      
      })

    
 
  }

    ChildEvent(events:any){
    //console.log(events)
       

         
        }
        
     

          ObjectTargetFilterChange(event:any){
            const _table = this        
        //console.log(event)
        this.API.CallProcedure('fliter_object_target',{division:event.division,date_range:event.date_range,target_year:event.target_year?event.target_year:'2021'}).subscribe(function(rows:any){
       //console.log('fliter_object_target:',rows)
              if(rows){
                  let _category_list = rows['category_list']
                  let _TotalCountIdea = rows['totalcountidea']
                _table.ObjectTarget = [].concat(_category_list)         
                _table.ObjectTargetTotal = _TotalCountIdea;  
                _table.Me.next({eventname:'BinddingObjectTarget',ObjectTarget:_table.ObjectTarget , ObjectTargetTotal: _table.ObjectTargetTotal })
              } else{
                /* _table.snackBar.openSnackBar( 'not found user data!!',
                  'OK', 'center', 'top', 'snack-style'); */
              }
              
            })
          }

      
   
   

}
