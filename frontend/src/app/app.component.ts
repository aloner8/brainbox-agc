import { Component,AfterViewInit, HostListener } from '@angular/core';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { ApiService } from './api.service';
import { VariablesService } from './variables.service';
import { DeviceDetectorService, OS } from 'ngx-device-detector';
import { SnackBarService } from './snack-bar/snack-bar.service';
import { BreakpointObserver } from '@angular/cdk/layout';
import { Subject } from 'rxjs';
import { UserService } from './user/user.service';
import { Router  } from '@angular/router';
import { MatIconRegistry } from "@angular/material/icon";
import { DomSanitizer } from "@angular/platform-browser";

export interface Tile {
  color: string;
  cols: number;
  rows: number;
  text: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {



  constructor(private breakpointObserver: BreakpointObserver
    ,private deviceService: DeviceDetectorService
    ,private api:ApiService               
              ,private snackBar: SnackBarService
              ,private localVar:VariablesService 
              ,private user:UserService
              ,private router_active:ActivatedRoute
              ,private router:Router
              ,private matIconRegistry: MatIconRegistry,
              private domSanitizer: DomSanitizer
    ) {
      const _app=this
      router_active.queryParams.subscribe(function(s){
    console.log(s)
        if(s['ideanumber']){
           _app.Rewards = false;  
          setTimeout(() => {

            localVar.AppVars.next({eventname:'DirectToIdeaDetail', target:'MenuLeft', id:s['ideanumber']})
            router.navigate([_app.BaseHref])
            
          }, 500);
        } else {
                  if(s['rewards']){
          
              setTimeout(() => {

                localVar.AppVars.next({eventname:'rewards', target:'app', id:s['rewards']})
                _app.Rewards = true;  
              //  router.navigate([_app.BaseHref])
                
              }, 500);
            } else {
              setTimeout(() => {
                router.navigate([_app.BaseHref])
              }, 2000);
            }
        }
      })

      this.matIconRegistry.addSvgIcon(
        "iconJpg",
        this.domSanitizer.bypassSecurityTrustResourceUrl(_app.BaseHref + "assets/img/ICON - jpg-1523.svg")
      );
      this.matIconRegistry.addSvgIcon(
        "iconExcel",
        this.domSanitizer.bypassSecurityTrustResourceUrl(_app.BaseHref + "assets/img/ICON - excel-4954.svg")
      );

    }

    title = 'ttsMat';
    AppConfig = this.api.getAppConfig();
    BaseHref = this.api.getBaseHref();
    UserInfo = {};
    ConnectServerApi =false;
    UserAutherized =false;
    deviceInfo:any;
    Me:Subject<any> = new Subject();
    Rewards = false;
  currentScreenSize: string = 'Small';
  tiles: Tile[] = [
    {text: 'One', cols: 3, rows: 1, color: 'lightblue'},
    {text: 'Two', cols: 1, rows: 2, color: 'lightgreen'},
    {text: 'Three', cols: 1, rows: 1, color: 'lightpink'},
    {text: 'Four', cols: 2, rows: 1, color: '#DDBDF1'},
  ];
  buildVersion = new Date().toISOString();

  typesOfPage: any = [{Caption: "WWW Page" , PageType:1 }
    ,{Caption: "One Form" , PageType:2 }
    ,{Caption: "Multi Form with Tab" , PageType:3 }
    ,{Caption: "Multi Form with Expansion Panel" , PageType:4 }
    ,{Caption: "Multi Form with Stepper" , PageType:5 }
    ,{Caption: "Multi Form with Gellary" , PageType:6 }
  ];

  ngAfterOnInit(){
   
  }

  
  ngOnInit()  {
    const _app = this

   /*  this.router.queryParams    
    .subscribe(params => {
  //console.log(params); // { order: "popular" }

       
  //console.log(params); // popular
    }
  ); */
    
    if(_app.localVar.LocalGetValue('formmatinfo')){
      if(_app.localVar.LocalGetValue('formmatinfo') == ''){
        _app.CreateSession()           
      } else {
        _app.ConnectServerApi=true 
        if(_app.localVar.LocalGetValue('UserToken')){
          const _token =_app.localVar.LocalGetValue('UserToken')
          _app.user.checkUserToken(_token)
        } else {
          _app.localVar.AppVars.next({eventname:'logout'})
        }
      
      }
    } else{
    //  console.log('CreateSession')
      _app.CreateSession()  
    }

    _app.localVar.AppVars.subscribe(function(event){
    //  console.log(event)
      switch (event['eventname']) {
        case 'logout':
          _app.localVar.LocalDeleteValue('UserToken')
          _app.localVar.LocalDeleteValue('listsources')
          _app.localVar.DeleteVariable('UserInfomation')
          _app.localVar.DeleteVariable('UserInfo')
          //_app.UserAutherize()
          setTimeout(() => {
            window.location.reload()
          }, 1000);
        
          
          break;
          case 'GetUserInfoComplete':
            _app.UserAutherize()
        //    _app.localVar.setVariable('UsersALL',event.users)
            break;      
          case 'RefreshApp':
        //console.log(event)
            setTimeout(() => {
              _app.router.navigate(['/'])
            }, 200);
            break;  
      

        default:
          break;
      }
    })
  }

  CreateSession (){
    const _app = this
    var device:any = _app.epicFunction() 
    if(device){
    ////  console.log(mac)
   //   device["MAC"] = mac.name
      _app.api.ConnectSession(device).subscribe((output: any) => {
      //  console.log(output)
        
        if(output){
          _app.localVar.LocalSetValue('formmatinfo',output)
          _app.ConnectServerApi=true         
        }
      })
    }
  }

  UserAutherize(){
    const _app = this
    if(this.localVar.getVariable('UserInfomation')) 

         var _UserInfo = this.localVar.getVariable('UserInfomation')
        this.UserAutherized=true;
      //  console.log('_UserInfo:',_UserInfo)
         
        this.api.Query('SELECT public.get_my_home($1) ',[_UserInfo['id'] ]).subscribe(function(output){
        //  console.log(output)
          if(output[0]){
            let _userHome = output[0]['get_my_home'][0]
            _app.localVar.setVariable('UserHome',_userHome) 
            // let localList=  _app.localVar.LocalGetValue('listsources')
            // if(!localList){
              _app.api.Query('SELECT public.get_idieas_filter() ',[]).subscribe(function(output:any){
                //  console.log(output)
                  if(output[0]){
                    let _ideas_filter = output[0]['get_idieas_filter'][0]
                   
                    _app.localVar.LocalSetValue('listsources',_ideas_filter)
                    
                    _app.localVar.setVariable('datalistsources',_ideas_filter)                   
  
                  }
                })
            // } else {
            //   _app.localVar.setVariable('datalistsources',localList)        
            // }



              _app.localVar.AppVars.next({
                "eventname": "VariablesChanging",
                "variablename": "LeftMenuSelected",
                "value": "home"
            }) 
            
          } else{
            _app.snackBar.openSnackBar( 'not found user data!!',
              'OK', 'center', 'top', 'snack-style');
          }
          
        })
   /*      this.api.CallFunction('get_view_home',{id:116}).subscribe(function(output){
        //  console.log(output)
        }) */
      
     
  }

 ip_local=function()
{
  var ip = ''
 return ip;
}
epicFunction () {
  var _app =this;
//  return   new Promise((resolve, reject) => {
  var _deviceInfo = this.deviceService.getDeviceInfo();
 // var _mac =pkg()
//  _deviceInfo["ip_local"] = _app.ip_local();

 //   _deviceInfo["ip_external"] = _app.api.getIPAddress();
   // resolve(_deviceInfo)
   
   
  return _deviceInfo
   
//})
}
  
  /* connecting(){
  
    var _mylogin = this
  
    this.api.getIPAddress().subscribe((IP:any) => {
      var _ip:string;
      if(IP["ip"]){
        _ip=IP["ip"]
      }else {
      _ip='...'
      }
      this.api.connecting(_mylogin.deviceInfo ,_ip ).subscribe((data) => {
        alert(data) 
      })
    })
  
  
  } */

  callSnackService() {
    this.snackBar.openSnackBar(
      'Common code to implement using service',
      'OK', 'center', 'top', 'snack-style');
  }

  LogingEvents(event:any){
    const _app = this
    switch (event.name) {
      case 'error login':
        this.snackBar.openSnackBar( event.data,
          'OK', 'center', 'top', 'snack-style');
        break;
      case 'login success':
       
        this.UserInfo = event.data 
        _app.localVar.LocalSetValue('UserInfo',event.data )
        this.UserAutherized=true
         
         
        break;    
      default:
        break;
    }


    
  }

/*   PageEvents(event:any){
    
  //  console.log(event)
    

    switch (event.name) {
      case 'PageOnInit':
        this.AppMain.next({name:'refresh pages',data: {appInfo:this.AppConfig,userInfo:this.UserInfo} })
        break;
      case 'login success':
         this.UserAutherized=true
         this.UserInfo = event.data
         this.AppMain.next({name:'refresh pages',data: {appInfo:this.AppConfig,userInfo:this.UserInfo} })
        break;    
      default:
        break;
    }  


    
  } */
  getForm() {
    return   new Promise((resolve, reject) => {
 
    this.api.getJSON('../assets/forms.json').subscribe(result => {
      if(result){
        resolve(result) 
      } else{
        resolve([]) 
      }
     
    })
  
  })
     
  }


  getFormById(id:any) {
    return   new Promise((resolve, reject) => {
 
    this.api.getJSON('../assets/forms.json').subscribe(result => {
     
      if(result){
        const selectForm =result.filter(function(f){ return f.id == id })[0]
        resolve(selectForm) 
      } else{
        resolve([]) 
      }
     
    })
  
  })
     
  }

  getControlType() {
    return   new Promise((resolve, reject) => {
 
    this.api.getJSON('../assets/control-type.json').subscribe(result => {
     
      if(result){
        const selecttype =result
        resolve(selecttype) 
      } else{
        resolve([]) 
      }
     
    })
  
  })
     
  }

  PageEvents(ev:any){
    const _app = this
  //  console.log('PageEvents:' ,ev )

        switch (ev['eventname']) {
   
         case 'GetListForm':
       
         break;

         case 'GetPageInfo':
        //  console.log('sent to Page:' ,{eventname:"SetPageInfo",eventvalue:{listmenu: this.typesOfPage }} )
          setTimeout(() => {
            this.Me.next({eventname:"SetPageInfo",eventvalue:{listmenu: this.typesOfPage }})
          }, 500);
          
         break;
         
         case 'GetFormById':

         this.getFormById(ev.eventvalue.id).then(function(f:any){
          if(f){
            _app.getControlType().then(function(c:any){
              if(c){
               f['ControlTypes'] = c
              }
            //  console.log('sent to Page:' ,{eventname:"SetFormInfo",eventvalue:{forminfo: f ,caption: f.caption}} )
              setTimeout(() => {
                _app.Me.next({eventname:"SetFormInfo",eventvalue:{forminfo: f ,caption: f.caption }})
              }, 500);
             })

          }
         })

          
         break;

          default:
            break;
        }
  }

}
