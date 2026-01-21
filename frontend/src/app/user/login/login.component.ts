import { outputAst } from '@angular/compiler';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { filter, Subject } from 'rxjs';
import { UserService } from '../user.service';
import { MatDialog } from '@angular/material/dialog';
import { SnackBarService } from '../../snack-bar/snack-bar.service';
import { ApiService } from '../../api.service';
import {BasicDialog} from '../dialogs/basic-dialog.component'
import {GetOTPDialogComponent} from '../dialogs/getotp-dialog.component'
import {SetPasswordComponent} from '../dialogs/setpassword-dialog.component'
 import { EnterAsTabDirective } from '../../enter-as-tab.directive';
import { SetPasswordByEmpcodeComponent } from '../dialogs/setpassword-by-empcode-dialog.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

 
  constructor(private user:UserService      ,private dialog: MatDialog
    ,private dialogPassword: MatDialog
    ,private snackBar:SnackBarService
    ,private api:ApiService ) { }

  @Output() LogingEvents : EventEmitter<any> = new EventEmitter();

  LogingForm:Subject<any> = new Subject();

  showpassword = 'password'
  password=''
  username=''
  email=''
  fullname =''
  otp =''
  BaseHref = ''
  ngOnInit(): void {
    this.BaseHref = this.api.getBaseHref();
  }

  Login( ){

    // alert(this.username )
   
     var _mylogin = this
   //  console.log(_mylogin.username)
     this.user.login(_mylogin.username,_mylogin.password).then(function(logined:any){

      
      if(logined['usertoken']){
        
        
          _mylogin.user.SetUserInfo(logined['usertoken'])
          //_mylogin.LogingEvents.emit({parent:'app',name:'login success',data:logined['usertoken'] })
         
         
      } else {
       // _mylogin.LogingEvents.emit({parent:'app',name:'error login',data:'Not login to system.' })
       _mylogin.snackBar.openSnackBar(
        "Can't login. {" + JSON.stringify(logined)  + '}' ,
        'OK', 'center', 'top', 'snack-style');
      }
     

     }) 
     
    
   
   }  
   
   PasswordInput(newvalue:any){

     this.password = newvalue.target.value
   }
   
   UserInput(newvalue:any){
     
     this.username = newvalue.target.value
   }

   openDialog(): void {
    const dialogRef = this.dialog.open(BasicDialog, {
      data: {name: this.username, animal: this.password},
    });

    dialogRef.afterClosed().subscribe(result => {
    //  console.log('The dialog was closed');
      this.password = result;
    });
  }
  forgetPasswordDialog(): void {
    const _loginpage = this
   if(this.username && this.username != '' ){
      this.api.Query('SELECT public.get_user_by_username($1) ',[this.username]).subscribe(function(output){
    //console.log(output)
         if(output[0]['get_user_by_username']){
         let _myname:any = output[0]['get_user_by_username'][0]
         if(_myname['email']){
            const dialogRef = _loginpage.dialog.open(GetOTPDialogComponent, {
              data: {name: _myname['username'],fullname: _myname['name'], email: _myname['email']},
            });
           dialogRef.disableClose=true
           dialogRef.afterClosed().subscribe(result => {
            //  console.log('The dialog was closed');
            _loginpage.username = result.name;
            _loginpage.email = result.email;
            _loginpage.fullname = result.fullname;
            
            _loginpage.getOTPChangePassword().then(function(otp:any){
              if(otp > 0) {
                _loginpage.otp=otp;
                _loginpage.SendMailOTP('')
               
              } else{
                alert('system not gen OTP')
              }
            })
          

            });
         } else {
          //alert('Not found email of username [' + _loginpage.username  + '].' )
           
           const dialogRef = _loginpage.dialogPassword.open(SetPasswordByEmpcodeComponent, {
              data: {username: _loginpage.username,fullname: _loginpage.fullname, email: _loginpage['email'],password:''},
            });
           
            dialogRef.afterClosed().subscribe(result => {
              console.log('ChangePasswordDialog:',result);
              _loginpage.api.ChangePassword(result.username,'',result['password'],result['otp']).subscribe(function(updated){
                if(updated){
                  if(updated['status']=='success'){
                    _loginpage.snackBar.openSnackBar(
                      'Your password is changed' ,
                      'OK', 'center', 'top', 'snack-style');
                  }else {
                    _loginpage.snackBar.openSnackBar(
                      'Non edit password check your data again. {' + JSON.stringify(updated)  + '}' ,
                      'OK', 'center', 'top', 'snack-style');
                  }
                }

              })
            //  console.log('The dialog was closed');
           /*  _loginpage.username = result.name;
            _loginpage.email = result.email;
            _loginpage.fullname = result.fullname;
            
            _loginpage.getOTPChangePassword().then(function(otp:any){
              if(otp > 0) {
                _loginpage.otp=otp;
                _loginpage.SendMailOTP('')
              } else{
                alert('system not gen OTP')
              }
            }) */
          

            });
         }
         } else{
          alert('Not found  username [' + _loginpage.username  + '].' )
         }
        })


    } else {
      alert('Enter username please.')
    }  

   
  }

  ChangePasswordDialog(): void {
    const _loginpage = this
 
            const dialogRef = _loginpage.dialogPassword.open(SetPasswordComponent, {
              data: {username: _loginpage.username,fullname: _loginpage.fullname, email: _loginpage['email'],password:''},
            });
        
            dialogRef.afterClosed().subscribe(result => {
              console.log('ChangePasswordDialog:',result);
            _loginpage.api.ChangePassword(result.username,result['otp'],result['password'],'').subscribe(function(updated){
                if(updated){
                  if(updated['status']=='success'){
                    _loginpage.snackBar.openSnackBar(
                      'Your password is changed' ,
                      'OK', 'center', 'top', 'snack-style');
                  }else {
                    _loginpage.snackBar.openSnackBar(
                      'Non edit password check your data again. {' + JSON.stringify(updated)  + '}' ,
                      'OK', 'center', 'top', 'snack-style');
                  }
                }

              }) 
            //  console.log('The dialog was closed');
           /*  _loginpage.username = result.name;
            _loginpage.email = result.email;
            _loginpage.fullname = result.fullname;
            
            _loginpage.getOTPChangePassword().then(function(otp:any){
              if(otp > 0) {
                _loginpage.otp=otp;
                _loginpage.SendMailOTP('')
              } else{
                alert('system not gen OTP')
              }
            }) */
          

            });
         

   
  }
   SendMailOTP(maildata:any){
          const _page = this
          let _mailconfig:any = {}
/*           let memberlist:any
          memberlist = this.get_users_admin()
          maildata.cc_email.push(memberlist)   */        
          _mailconfig['from'] = 'Brainbox email <brainbox@agc.com>'
   
          _mailconfig['to'] = _page.fullname + ' <' + _page.email + '>;'
           _mailconfig['cc'] =''
/*           if(maildata.cc_email.length>1){
                  let _reciver='['
                  for (let index = 0; index < maildata.cc_email.length; index++) {
                          const reciver =  maildata.cc_email[index];
                          _reciver   = _reciver + '"' + reciver.display?reciver.display:reciver.email + '" <' + reciver.email + '>;'
                  }
                  _mailconfig['cc'] =_reciver + ']'
          } else {
                  if(maildata.cc_email.length==1){
                  _mailconfig['cc'] = maildata.cc_email[0].display?maildata.cc_email[0].display:maildata.cc_email[0].email + ' <' + maildata.cc_email[0].email + '>;'
                  } else {
                          _mailconfig['cc'] =''
                  }
                  
          } */
          _mailconfig['subject'] = 'OTP for reset password of ' + _page.fullname   
          _mailconfig['text'] =_page.otp.toString()
          let _html:string = ''
          _html = _html + '<p>dear ' +  _page.fullname   + '</p> ';
          _html = _html + '<p> &emsp; &emsp; OTP for reset password :'  +  _page.otp.toString() + '</p> ';
      
          _html = _html + '<br>';
          _html = _html + '<p>Best Regards</p>';
          _html = _html + '<p> Brainbox </p>';
          
          _mailconfig['html'] =  _html
         
          this.api.sendMail(_mailconfig.from,_mailconfig.to,_mailconfig.cc,_mailconfig.subject,_mailconfig.text,_mailconfig.html,{}).subscribe(function(m){
              //console.log(m)
                  if(m['status']=="success"){
                          _page.snackBar.openSnackBar('Email is successfully sent OTP. ', 'OK', 'center', 'top', 'snack-style')
                          _page.ChangePasswordDialog()
                          
                  } else {
                          _page.snackBar.openSnackBar('Error sent Email. ' +  JSON.stringify(m) , 'OK', 'center', 'top', 'snack-style')
                  }
          })
      }


      get_users_admin (){
        
        const _loginpage = this
        
          this.api.Query('SELECT public.get_users_admin() ',[]).subscribe(function(output){
        //console.log(output)
             if(output[0]['get_users_admin']){ 
              return output[0]['get_users_admin']
             } else{
              return []
             }
      })
    }

    getOTPChangePassword (){
      
      const _loginpage = this
      return   new Promise((resolve, reject) => { 
      _loginpage.api.getOTPChangePassword(_loginpage.username,_loginpage.email).subscribe(function(otp){
        //  console.log('_otp=',otp)
          if(otp['otp']){
            _loginpage.api.Query('update public.users set remember_token = $1  where id = $2',[otp['tokenotp'],otp['userid']])
            .subscribe(function(r){
                  resolve(otp['otp'])
            })
           } else{
            resolve  (0)
           }
    })
  })
}
/* 
   ChangePassword(){
    const that=this
    openGetOTPDialog(this.dialog, {username:'Rujiroj.Pran',email:'rujiroj.pran@alonersoft.com'})
    .pipe(
        filter(val => !!val)
    )
    .subscribe(
        val => 
        {
        //  console.log('new course value:', val)
          that.api.getOTPChangePassword(val.username,val.email).subscribe(function(otp){
          //  console.log('_otp=',otp)
            if(otp['otp']){
              that.api.Query('update public.users set remember_token = $1  where id = $2',[otp['otp'],otp['userid']])
              .subscribe(function(r){
                 //console.log(r)

                 openSetPasswordDialog(that.dialogPassword,{username:'Rujiroj.Pran',email:'rujiroj.pran@alonersoft.com',otp:'',newPassword:'',replyPassword:''})
                 .pipe(
                     filter(newval => !!newval)
                 )
                 .subscribe(
                  newval => 
                     {
                      if(newval['otp'])
                      {
                        if(newval['otp'].length == 6)
                          {
                            if(newval['newPassword'])
                              {
                                that.api.ChangePassword(newval.username,newval['otp'],newval['newPassword']).subscribe(function(updated){
                                  if(updated){
                                    if(updated['status']=='success'){
                                      that.snackBar.openSnackBar(
                                        'Your password is changed' ,
                                        'OK', 'center', 'top', 'snack-style');
                                    }else {
                                      that.snackBar.openSnackBar(
                                        'Non edit password check your data again. {' + JSON.stringify(otp)  + '}' ,
                                        'OK', 'center', 'top', 'snack-style');
                                    }
                                  }

                                })
                              } 
                          } 
                      }
                     }
                    )
              
              }) 
            } else {
              that.snackBar.openSnackBar(
                'Non gen OTP check your data again. {' + JSON.stringify(otp)  + '}' ,
                'OK', 'center', 'top', 'snack-style');
            }

          }) 
          //that.user.testAPI()
          
        }
          
       
    );
    
   } */
   
}
