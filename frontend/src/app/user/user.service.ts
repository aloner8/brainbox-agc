import { Injectable } from '@angular/core';
import { ApiService } from '../api.service';

import { VariablesService } from '../variables.service';
import { DIR_DOCUMENT } from '@angular/cdk/bidi';
import { SnackBarService } from '../snack-bar/snack-bar.service';



@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private api:ApiService , private varService : VariablesService , private snackBar:SnackBarService ) 
  { }

  login(username:string,password:string){
    return   new Promise((resolve, reject) => {             
      this.api.Login(username,password ).subscribe((output: any) => {
        if(output){
        //  console.log(output)
          resolve(output)
        }
      })
    })
  }


  getUserByID(id:string){
    
    this.api.gets('zusers',{id:'6325140c1da7e21a6b81d8c9'}).subscribe((output: any) => {
    //  console.log(output)
    })  
  }

  getAllrow(name:string){
    
    this.api.gets(name,{}).subscribe((output: any) => {
    //  console.log(output)
    })  
  }


  NewUser(){
    return   new Promise((resolve, reject) => {  
      
     this.api.post('zusers',{
      
      "User_id" : "chit",
      "username" : "chit",
      "password" : "passw0rd",
      "fullname" : "จิตกร กองลาแซ",
      "areaCode" : 10000,
      "email" : "Chitagorn@phk.ac.th",
      "level" : "3",
      "lineToken" : "Chittrakorn",
      "position" : "3",
      "active" : true,
      "lineID" : "loeimiller",
      "phoneNumber" : "0971753636"
    }).subscribe((output: any) => {
    //  console.log(output)
    })  
  })
}
 

SetUserInfo(UserToken:any){  
  
  this.varService.LocalSetValue('UserToken',UserToken)  
  this.checkUserToken(UserToken)
}

checkUserToken(UserToken:string){
  const _userSer = this
  if (!this.varService.LocalGetValue('UserToken')){
  //  console.log('New Login')
    //this.app.LocalSetValue('UserToken','**GenNewKey**')
    _userSer.varService.AppVars.next({eventname:'NewLogin'})
  } else {

    let UserToken =  this.varService.LocalGetValue('UserToken')
    this.api.CheckToken(UserToken).subscribe(function(output){
  //console.log(output)
      if(output['status']){
        if(output['status']=='success'){
          let _userHome = output['userinfo']
          _userSer.varService.setVariable('UserInfomation',_userHome)      
          _userSer.varService.AppVars.next({eventname:'GetUserInfoComplete'}) 
        } else{
          _userSer.snackBar.openSnackBar( output['message'],
            'OK', 'center', 'top', 'snack-style');
            _userSer.varService.AppVars.next({eventname:'logout'}) 
        }
      } else {
        _userSer.snackBar.openSnackBar( 'not found user data!!',
          'OK', 'center', 'top', 'snack-style');
          _userSer.varService.AppVars.next({eventname:'logout'}) 
      }
       
     /*    _userSer.api.allusername().subscribe(function(output){
        //  console.log(output)
          if(output['status']){
            let _userHome = output['users']
            _userSer.varService.setVariable('UserNameAll',_userHome)        
            _userSer.varService.AppVars.next({eventname:'GetUserInfoComplete' , users:_userHome})
        
          } else{
            _userSer.snackBar.openSnackBar( 'not found user data!!',
              'OK', 'center', 'top', 'snack-style');
          
          }
          _userSer.varService.AppVars.next({eventname:'GetUserInfoComplete'})  
        }) */
        
         
  })          
}
}
 
 


/*           getAllrow(name:string){
  
  this.api.gets(name,{}).subscribe((output: any) => {
  //  console.log(output)
  })  
}
*/
/* 
NewUser(){
  return   new Promise((resolve, reject) => {  
    
   this.api.post('zusers',{
    
    "User_id" : "chit",
    "username" : "chit",
    "password" : "passw0rd",
    "fullname" : "จิตกร กองลาแซ",
    "areaCode" : 10000,
    "email" : "Chitagorn@phk.ac.th",
    "level" : "3",
    "lineToken" : "Chittrakorn",
    "position" : "3",
    "active" : true,
    "lineID" : "loeimiller",
    "phoneNumber" : "0971753636"
  }).subscribe((output: any) => {
  //  console.log(output)
  })  
})
}
*/

 
}
