import { Component , EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {FormMatComponent} from '../form-mat/form-mat.component'
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Subject, takeUntil } from 'rxjs';
import {MatlibModule} from '../matlib.module'
import { FormControl } from '@angular/forms';
import { ApiService } from '../api.service';
import { VariablesService } from '../variables.service';
import { MatDialog } from '@angular/material/dialog';
import { DatePipe } from "@angular/common";
import { NotificationDialogComponent } from "./dialog/notification-dialog.component";
import { MatDrawer } from '@angular/material/sidenav';
//import { ApiService } from '../api.service';


@Component({
  selector: 'app-pages-mat',  
  templateUrl: './pages-mat.component.html',
  styleUrl: './pages-mat.component.css'
})
export class PagesMatComponent {

  @Input() Parent: Subject<any> =   new Subject<any>();
  @Output() PageEvents : EventEmitter<any> = new EventEmitter();
  @Output() FormsEvents : EventEmitter<any> = new EventEmitter();
  formid:number = 0
  AllUser:any=[]
  UserInfo:any = {}
   @ViewChild('drawer') drawer!: MatDrawer;

  toggleDrawer() {
    //this.drawer.toggle();
  }

  constructor(private breakpointObserver: BreakpointObserver
              ,private api:ApiService
              ,private VeriableService:VariablesService
              ,private notifyDialog:MatDialog
              ) {
    breakpointObserver
    .observe([
      Breakpoints.XSmall,
      Breakpoints.Small,
      Breakpoints.Medium,
      Breakpoints.Large,
      Breakpoints.XLarge,
    ])
    .pipe(takeUntil(this.destroyed))
    .subscribe(result => {
      for (const query of Object.keys(result.breakpoints)) {
        if (result.breakpoints[query]) {
          this.currentScreenSize = this.displayNameMap.get(query) ?? 'Unknown';
          
        }
      }
    });
  }

  displayNameMap = new Map([
    [Breakpoints.XSmall, 'XSmall'],
    [Breakpoints.Small, 'Small'],
    [Breakpoints.Medium, 'Medium'],
    [Breakpoints.Large, 'Large'],
    [Breakpoints.XLarge, 'XLarge'],
  ]);
  
  ListPage = [
    {id:1,
      Caption:"1"
    },{id:2,
      Caption:"2"
    },
    {id:3,
      Caption:"3"
    }
  ]
  destroyed = new Subject<void>();
  currentScreenSize: string = 'Small';
  Me:Subject<any> = new Subject();
  selected = new FormControl(0);
  drawer_opened=true
  forms : any;
  typesOfPage: any;
  typesOfControl: any;
  CurrentForm:string = ''

  
  ngOnInit(): void {
    var _page = this

    //var forms = this.getForm()
/*     this.getForm().then(function (f) {
      _page.forms = f
    //  console.log(_page.forms)
    })
     */

    this.VeriableService.AppVars.subscribe(function(vars){
      if(vars['eventname'])
      switch (vars['eventname']) {
        case 'VariablesChanging':
          switch (vars['variablename']) {
            case 'LeftMenuSelected':
              _page.CurrentForm = vars['value']
              _page.UserInfo =  _page.VeriableService.getVariable('UserHome')
/* setTimeout(() => {
  _page.drawer.close()
}, 1000); */
             
          //console.log( _page.UserInfo )
              break;
          
            default:
              break;
          }
          break;
      
          case "GetUserInfoComplete":
          //  console.log(vars.users)
         //   _page.AllUser = vars.users

          break;
          case "SelectIdeaDetail":
         //  console.log(vars)
        //    _page.AllUser = vars.users
          break;

          
        default:
          break;
      }
    })

    
    this.PageEvents.emit({eventname:"GetPageInfo",eventvalue:{ListPages:this.ListPage}})
    //this.PageEvents.emit({eventname:"GetLeftMenu",eventvalue:{ListPages:this.ListPage}})

/*     this.api.allusername().subscribe(function(u){
    //  console.log(u)
      _page.AllUser = u.users
    }) */

setTimeout(() => {
  this.drawer.open();
}, 300);
  }

  GetNotificationCount(){
    if(this.UserInfo.notifications){
      return parseInt(this.UserInfo.notifications.length) 
    } else {
      return 0
    }
   
  }
  ExportExcel(){
    console.log('ExportExcel from PagesMatComponent', this.CurrentForm) 
    this.VeriableService.AppVars.next({eventname:'ExportExcel',target: this.CurrentForm ,activeView:'' })
  }
  OpenNotificationDialog(){
    const that=this
//console.log(this.UserInfo.notifications)
    const dialogRef = this.notifyDialog.open(NotificationDialogComponent, {
      data: this.UserInfo.notifications,
    });

    dialogRef.afterClosed().subscribe(result => {

  //console.log('Notification is seleted',result);
      if(result){

        if(result=='readall'){
         // that.VeriableService.AppVars.next({eventname:'SelectIdeaDetail',target:'MenuLeft' ,id: result['project_id'] })
      
          that.api.Query('UPDATE public.notifications SET readed=true WHERE readed <> true and user_id = $1 ',[that.UserInfo['id']  ]).subscribe(function(updated){
           /*  that.api.Query('SELECT public.get_my_home($1) ',[that.UserInfo['id'] ]).subscribe(function(output){
              //  console.log(output)
                if(output[0]){
                  let _userHome = output[0]['get_my_home'][0]
                  that.VeriableService.setVariable('UserHome',_userHome) 
                }
              }) */
             setTimeout(() => {
              window.document.location.reload();
             }, 1000);
          })
          return
        }   else{
                    that.VeriableService.AppVars.next({eventname:'SelectIdeaDetail',target:'MenuLeft' ,id: result['project_id'] })
      
          that.api.Query('UPDATE public.notifications SET readed=true WHERE id = $1 ',[result['id']  ]).subscribe(function(updated){
            that.api.Query('SELECT public.get_my_home($1) ',[result['user_id'] ]).subscribe(function(output){
              //  console.log(output)
                if(output[0]){
                  let _userHome = output[0]['get_my_home'][0]
                  that.VeriableService.setVariable('UserHome',_userHome) 
                }
              })
          })
        }
      

      }
      //this.password = result;
    });
  }

  testProc(){
    const _page = this
    _page.api.CallProcedure('public.getviewhome',{project_id:0, user_id:_page.UserInfo.id }).subscribe(function(updated){
  //console.log('getviewhome:',updated)
      let _message:string =''
        if(!updated['status']){
        }
      })
  }

 /*  SetPasswordAllUser(){    
    
    setTimeout(() => {
      alert(this.AllUser.length)
    //  console.log(  this.AllUser)
      for (let index = 0; index < this.AllUser.length; index++) {
        const element = this.AllUser[index];
        this.api.ChangePasswordFork(element['username']).subscribe(function(u){
        //  console.log(u)
        })
        
      }      
    }, 5000);

  } */
  LogOut(){
   this.VeriableService.LocalDeleteValue('UserInfo')
   this.VeriableService.DeleteVariable('')   
   this.VeriableService.AppVars.next({eventname:'logout'}) 
  }
  selectMenuConfig(){
    // this.toggleDrawer()
    
    setTimeout(() => {
      this.VeriableService.setVariable('LeftMenuSelected','config') 
    }, 500);
  }

  selectMenuProfile(){
   //  this.toggleDrawer()
   
      setTimeout(() => {
       this.VeriableService.setVariable('LeftMenuSelected','profile') 
    }, 500);
  }
  FormEvents(ev:any){
  //  console.log(ev)
      switch (ev['eventname']) {

       case 'FormLoading':
        setTimeout(() => {
          this.PageEvents.emit({eventname:"GetFormById",eventvalue:{id:ev.eventvalue.id}})
        }, 500);
          
       break;
 
       case 'FormRefrash':
         //alert('FormDataSoureRefrash')
 
         break;
        case 'FormDataSoureRefrash':
          //alert('FormDataSoureRefrash')
   
          break;
  
        case 'SetFormCaption':
    
          break;
      
      case 'CurrentRowSelectting':
        
   
             
        break;
 
        case "Form Closing":
   
         break;
        default:
          break;
      }
    }

    closeForm(PageIndex:number){
      var _before : any
      var _AllPage = []
      _before=[]
    /*   _AllPage = [].concat(this.ListPage)
      this.ListPage =[]
      for (let index = 0; index < _AllPage.length; index++) {
         const element = _AllPage[index];
         if(index ==PageIndex ){
  
         } else 
         {
           _before.push(element)
         }
         if(index==_AllPage.length-1){
          this.ListPage = [].concat(_before)
         }
         
       } */
    }
}
