import { Injectable } from '@angular/core';
import { Observable, Subject, of, throwError } from 'rxjs';
import { HttpClient, HttpHeaders, HttpErrorResponse,HttpParams } from '@angular/common/http';
import { catchError, tap, map } from 'rxjs/operators';
import  Configs from '../assets/config.json'
import { VariablesService } from './variables.service';

import { environment } from './../environments/environment';

import {} from '../assets/forms.json'
import { MatDialog } from '@angular/material/dialog';
import {ProcessingDialog}from './dialogs/processing-dialog.component'

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json','Access-Control-Allow-Origin': '*',"Access-Control-Allow-Headers": 'Origin, X-Requested-With, Content-Type, Accept ','Access-Control-Allow-Methods':'GET,PUT,POST,DELETE,PATCH,OPTIONS'})  
};
const httpUpload = {
  headers: new HttpHeaders({'Content-Type': 'multipart/form-data,application/json','Access-Control-Allow-Origin': '*',"Access-Control-Allow-Headers": 'Origin, X-Requested-With, Content-Type, Accept ','Access-Control-Allow-Methods':'GET,PUT,POST,DELETE,PATCH,OPTIONS'})  
};
const LinehttpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'  ,"Authorization": "Bearer NVlu2LW+t2tgrHVI1wz+gpeFRe27RaA8w0xHDmPFQAuQr3OuSM+VIoKY3gurb3Boi4T2qzdvsvKq1Rf9acpT4dTrUVGrxuXXe59dFykNrYsVV6msXRE7DNU/w/S0j+Gl3duMYWrh0vOYf5BFHeJwaAdB04t89/1O/w1cDnyilFU=" })  
};

const appConfigs = environment;
const rootpoint = appConfigs.rootpoint ;
const endpoint = appConfigs.rootpoint ;

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient  ,private localVar:VariablesService , private dialog: MatDialog) { }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
     //console.log(error);
      return of(result as T);
    };
  }
  private extractData(res: Response) {
    let body = res;
    return body || { };
  } 

  escapeRegExp(find:string) {
    return find.replace(/[.*+\-?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
  }
  replaceAll(str:string, find:string, replace:string) {
    return str.replace(new RegExp(this.escapeRegExp(find), 'g'), replace);
  }
 
   getIPAddress()
  {
    setTimeout(() => {
      this.http.get("http://api.ipify.org/?format=json").subscribe((res:any)=>{
        return res.ip;
      });
    }, 2000);

  }  

  SessionTokenName()
  {
    return appConfigs.appprefix + 'Token'

  }  
  UserInfoName()
  {
    return appConfigs.appprefix + 'UserInfo'

  }  
  
  getUrldownload(){
    return appConfigs.urldownload
  }

  getBaseHref(){
    return appConfigs.BaseHref
  }
  getAttechFolder(){
    return appConfigs.attechfolder
  }
   
  fileNotFound() {
    this.http.get( appConfigs.BaseHref + 'assets/img/file-not-found.png', { responseType: 'blob' })
      .subscribe(res => {
        const reader = new FileReader();
        //reader.readAsArrayBuffer
       
        reader.onloadend = () => {
          var base64data = reader.result;                
          //console.log(base64data);
              
        }

        reader.readAsDataURL(res); 
    //console.log(res);
        return res;
      });
  }

UserToken(){
  var _UserTemp= this.localVar.LocalGetValue( this.UserInfoName() )
  var _tempToken = this.localVar.LocalGetValue( this.SessionTokenName() )
  var _fullTOken =  appConfigs.DBName   + '|' + _UserTemp.UserInfo['_id'] + '|' + _tempToken

 ////console.log('_UserTemp',_UserTemp)
 ////console.log('_tempToken',_tempToken)
 ////console.log('_fullTOken',_fullTOken)

  return _fullTOken
}

 InProcess: Subject<any> =   new Subject<any>();

 setInProcessState(task:any, state:any){
  var ev = {name:'api in process',value:{task:task,state:state}}
  this.InProcess.next(ev)
 }

  ConnectSession(deviceInfo:any): Observable<any> {

    this.setInProcessState('connecting','begin')
    deviceInfo['apikey'] = appConfigs['apikey']
   //console.log('deviceInfo',deviceInfo);
      return this.http.post<any>(rootpoint +  '/connecting'  , deviceInfo , httpOptions).pipe(
        tap((s: any) =>console.log(s)),
        catchError(this.handleError<any>('GenExcel'))
      );
      
    }

  /* login(username : any,password: any,appname: any): Observable<any> {
    // //console.log(newrow);
       if(appConfigs.standAlone){
        return this.getJSON('../../assets/db/admin.json')
       } else {
        return this.http.post<any>(rootpoint +  'login'  , {"appname":"","username":username , "password": password } , httpOptions).pipe(
          tap((s: any) =>console.log(`GenExcel`)),
          catchError(this.handleError<any>('GenExcel'))
        ); 
       }

      
    } */

       CallProcedure(ProcedureName:string, ParameterInput:any ): Observable<any> {
            return this.http.post<any>(rootpoint +  '/db/pg-call-proc', {  procname:ProcedureName ,jsonparm:ParameterInput} , httpOptions).pipe(
              tap((s: any) =>console.log(`added sales w/ id=${s._id}`)),
              catchError(this.handleError<any>('addSales'))
        );

    }
    CallFunction(FunctionName:string, ParameterInput:any ): Observable<any> {
      return this.http.post<any>(rootpoint +  '/db/pg-call-func', {  funcname:FunctionName ,jsonparm:ParameterInput} , httpOptions).pipe(
        tap((s: any) =>console.log(`added sales w/ id=${s._id}`)),
        catchError(this.handleError<any>('addSales'))
  );
  

}
sendMail(from:any,to:any,cc:any,subject:string,text:string,html:string,attechment:any ): Observable<any> {
  console.log({  from:from,to:to,cc:cc,subject:subject,text:text,html:html,attechment:attechment})
  
  return this.http.post<any>(rootpoint +  '/sendmail', {  from:from,to:to,cc:cc,subject:subject,text:text,html:html,attechment:attechment} , httpOptions).pipe(
    tap((s: any) =>console.log(`added sales w/ id=${s._id}`)),
    catchError(this.handleError<any>('addSales'))
);
}
sendMailByIdState(id_state:number): Observable<any> {
  
  return this.http.post<any>(rootpoint +  '/sendmailbyidstate', { id_state:id_state} , httpOptions).pipe(
    tap((s: any) =>console.log(`added sales w/ id=${s._id}`)),
    catchError(this.handleError<any>('addSales'))
);
}

getSystemMailSender(){
  return 'Brainbox email <brainbox@agc.com>'
  //return this.http.get<any>(rootpoint + `/user/otp/${username}/${email}`)             
}

openDialog(): void {
  const dialogRef = this.dialog.open(ProcessingDialog, {
    data: {name: 'API', animal: ''},
  });

  dialogRef.afterClosed().subscribe(result => {
  //  console.log('The dialog was closed');
    
  });
}

    Query(querystring:string, ParameterInput:any ): Observable<any> {    
      const _api = this
      this.openDialog()

        return this.http.post<any>(rootpoint + '/db/pg-query', {querystring:querystring,parms:ParameterInput}, httpOptions).pipe(
          tap((s: any) =>{
         //  console.log(`added sales w/ id=${s._id}`)
            _api.dialog.closeAll()
          }
            
          ),
          catchError(this.handleError<any>('addSales'))
          
        );

    
    }

    QueryBG(querystring:string, ParameterInput:any ): Observable<any> {    
      const _api = this
      

        return this.http.post<any>(rootpoint + '/db/pg-query', {querystring:querystring,parms:ParameterInput}, httpOptions).pipe(
          tap((s: any) =>{
         //  console.log(`added sales w/ id=${s._id}`)
           
          }
            
          ),
          catchError(this.handleError<any>('addSales'))
          
        );

    
    }

    UploadFile(files:any ): Observable<any> {    
      const _api = this
      this.openDialog()

        return this.http.post<any>(rootpoint + '/uploadfile', {files:files}, httpOptions).pipe(
          tap((s: any) =>{
       //console.log(s)
            _api.dialog.closeAll()
          }
            
          ),
          catchError(this.handleError<any>('UploadFile'))
          
        );

    
    }

      MoveFile(source:string,destination:string ): Observable<any> {    
      const _api = this
      this.openDialog()

        return this.http.post<any>(rootpoint + '/movefile', {currentPath:source,destinationDir:destination}, httpOptions).pipe(
          tap((s: any) =>{
       //console.log(s)
            _api.dialog.closeAll()
          }
            
          ),
          catchError(this.handleError<any>('MoveFile'))
          
        );

    
    }
    
    DeleteFile(files:any ): Observable<any> {    
      const _api = this
      this.openDialog()

        return this.http.post<any>(rootpoint + '/deletefile', {files:files}, httpOptions).pipe(
          tap((s: any) =>{
       //console.log(s)
            _api.dialog.closeAll()
          }
            
          ),
          catchError(this.handleError<any>('DeleteFile'))
          
        );

    
    }


    getOTPChangePassword(username:string,email:string){
      return this.http.get<any>(rootpoint + `/user/otp/${username}/${email}`)             
   }
   ChangePassword(username:string,otp:string,newPassword:string,employee_code:string){
      const _api = this
       return this.http.post<any>(rootpoint + '/user/editpassword', {username:username,otp:otp,newPassword:newPassword,employee_code:employee_code}, httpOptions).pipe(
          tap((s: any) =>{
       //console.log(s)
          //  _api.dialog.closeAll()
          }
            
          ),
          catchError(this.handleError<any>('editpassword'))
          
        );
  }
  ChangePasswordFork(username:string){
    return this.http.get<any>(rootpoint + `/user/editpassword/${username}`)             
 }
/*   allusername(){
    return this.http.get<any>(rootpoint + `/user/allusername`)             
 } */
  Login(username:string,password:string){
  
         return this.http.post<any>(rootpoint + '/user/login', {username:username,password:password}, httpOptions).pipe(
          tap((s: any) =>{
       console.log('Login:',s)
          //  _api.dialog.closeAll()
          }
            
          ),
          catchError(this.handleError<any>('Login'))
          
        );

}
CheckToken(usertoken:string){
  return this.http.get<any>(rootpoint + `/user/check_token/${usertoken}`)             
}

 
  
    connecting(deviceInfo : any , IP :string ): Observable<any> {
    //  console.log('rootpoint = ' + JSON.stringify(appConfigs))
      this.setInProcessState('connecting','begin')
      deviceInfo['IP'] = IP;
      return this.http.post<any>(rootpoint +  'connecting'  , {"deviceInfo":deviceInfo  } , httpOptions).pipe(
        tap((s: any) => {}),
        catchError(this.handleError<any>('addSales'))
      );
    }
  
  /*    getIPAddress()  
    {  
      
      return this.http.get<any>("http://api.ipify.org/?format=json", httpOptions )
      .pipe(
        tap(sales =>console.log('fetched row')),
        catchError(this.handleError('getrow', ''))
      );
    }   */

    public getAppConfig (){
      return appConfigs
    }

  GenExcel(StartDate : any,EndDate: any ,orderby:any): Observable<any> {
    //alert('rootpoint = ' + JSON.stringify(appConfigs))
    return this.http.post<any>(rootpoint +  'genExcel'  , {"StartDate":StartDate,"EndDate":EndDate , "orderby":orderby } , httpOptions).pipe(
      tap((s: any) =>console.log(`GenExcel`)),
      catchError(this.handleError<any>('GenExcel'))
    );
  }
  
  filedir(path:string): any {
    return this.http.post<any>(rootpoint +  'filedir'  , {"path":path } , httpOptions).pipe(
      tap((s: any) =>console.log(`filedir`)),
      catchError(this.handleError<any>('filedir'))
    );
    
  }
  filedetails(filelist:any): any {
    return this.http.post<any>(rootpoint +  'filedetail'  , {"filelist":filelist } , httpOptions).pipe(
      tap((s: any) =>console.log(`filedetails`)),
      catchError(this.handleError<any>('filedetails'))
    );
    
  }

  getUserAuthText (){
      
    var userinfo : any;
   

  return userinfo.name + ':' + userinfo.pwd + ':' + '1234' + ':' + userinfo.session_id 
}
public get'1234' (){
  return   '1234'  
}

aggregate(collection : string, params:any): Observable<any[]> {
  this.setInProcessState('aggregate : ' +  collection,'begin')   
  return this.http.post<any>(rootpoint+   this.UserToken() + '/db/aggregate/' +  collection ,{params:params} , httpOptions).pipe(
    tap((s: any) => this.setInProcessState('aggregate','success')  ),
    catchError(this.handleError<any>('addnew'))
  );
   
}

getJSON(filename : string): Observable<any[]> {
 
  return this.http.get<any[]>( filename)
    .pipe(
      tap(sales =>console.log('fetched row')),
      catchError(this.handleError<any>('getrow'))
    );
   
}


getTEXT(filename : string): any {
 
  return this.http.get( filename, { responseType: 'text' })
    .pipe(
      tap(sales =>console.log('fetched row')),
      catchError(this.handleError('getrow', []))
    );
   
}
/* 
getTEXT(filename : string): any {
 
  this.http.get(filename, { responseType: 'text' })
  .subscribe(data => {  
   //console.log(data.length);
    return data.split('\n');
  });
   
} */
 

 

  gets(collection : string, paramobj:any): Observable<any[]> {
    this.setInProcessState('gets : ' + collection ,'begin')
    const params = new  HttpParams().set('filter', JSON.stringify(paramobj) ) ;
    const headers =  new HttpHeaders({'Content-Type': 'application/json'}) 
    
    return this.http.get<any[]>(rootpoint +  this.UserToken() + '/db/' +  collection, {headers:headers,params:params}  )
      .pipe(
        tap(sales => {  this.setInProcessState('gets','success')}),
        catchError(this.handleError('getrow', []))
      );
     
  }


  find(collection : string, filter:any, option:any): Observable<any[]> {
    this.setInProcessState('gets : ' + collection ,'begin')
    const params = new  HttpParams().set('filter', JSON.stringify(filter) ).set('option', JSON.stringify(option) ) ;
    const headers =  new HttpHeaders({'Content-Type': 'application/json'}) 
    
    return this.http.get<any[]>(rootpoint +  this.UserToken() + '/find/' +  collection, {headers:headers,params:params}  )
      .pipe(
        tap(sales => {  this.setInProcessState('gets','success')}),
        catchError(this.handleError('getrow', []))
      );
     
  }
  exportJson(collection : string, filter:any, option:any): Observable<any[]> {
    this.setInProcessState('gets : ' + collection ,'begin')
    const params = new  HttpParams().set('filter', JSON.stringify(filter) ).set('option', JSON.stringify(option) ) ;
    const headers =  new HttpHeaders({'Content-Type': 'application/json'}) 
    
    return this.http.get<any[]>(rootpoint +  this.UserToken() + '/db/export/json/' +  collection, {headers:headers,params:params}  )
      .pipe(
        tap(sales => {  this.setInProcessState('gets','success')}),
        catchError(this.handleError('getrow', []))
      );
     
  }

  getDefaultValue(paramobj:any): Observable<any[]> {
    const params = new  HttpParams().set('filter', JSON.stringify(paramobj) ) ;
    const headers =  new HttpHeaders({'Content-Type': 'application/json'}) 
    return this.http.get<any[]>(rootpoint +  this.UserToken() + '/db/sys.defaultValue/'   , {headers:headers,params:params}  )
      .pipe(
        tap(sales => {}),
        catchError(this.handleError('getrow', []))
      );
     
  }


  Call(fullpath : string, paramobj:any): Observable<any[]> {
    const params = new  HttpParams().set('filter', JSON.stringify(paramobj) ) ;
    const headers =  new HttpHeaders({'Content-Type': 'application/json'}) 
    return this.http.get<any[]>(rootpoint +  fullpath, {headers:headers,params:params}  )
      .pipe(
        tap(sales =>console.log('fetched row')),
        catchError(this.handleError('getrow', []))
      );
     
  }

  distinct(collection : string, paramobj:any): Observable<any[]> {
    const params = new  HttpParams().set('filter', JSON.stringify(paramobj) ) ;
    const headers =  new HttpHeaders({'Content-Type': 'application/json'}) 
    return this.http.get<any[]>(rootpoint +   this.UserToken() + '/db/' +  collection, {headers:headers,params:params}  )
      .pipe(
        tap(sales =>console.log('fetched row')),
        catchError(this.handleError('getrow', []))
      );
     
  }
  
  put(collection : string, paramobj:any , updatetext:any ): Observable<any[]> {
    this.setInProcessState('put : ' +  collection,'begin')   
   // const params = new  HttpParams().set('filter', paramobj).set('updatetext',updatetext ) ;
    const headers =  new HttpHeaders({'Content-Type': 'application/json'}) 
    return this.http.put<any[]>(rootpoint +   this.UserToken() + '/db/'+  collection, {headers:headers,query:paramobj,updates:updatetext}  )
      .pipe(
        tap(sales =>{  this.setInProcessState('put','success')}),
        catchError(this.handleError('update row', []))
      );

      
     
  }
 
  post(collection : string, newData :any ): Observable<any[]> {     
    this.setInProcessState('post : ' +  collection,'begin')      
      return this.http.post<any>(rootpoint+   this.UserToken() + '/db/' +  collection , newData , httpOptions).pipe(
        tap((s: any) =>console.log(s)),
        catchError(this.handleError<any>('addnew'))
      );
  }

  exec(procedurename : string, params :any ): Observable<any[]> {     
    this.setInProcessState('exec : ' +  procedurename,'begin')   
    return this.http.post<any>(rootpoint+   this.UserToken() + '/db/exec/' +  procedurename ,{params:params} , httpOptions).pipe(
      tap((s: any) => this.setInProcessState('exec','success')  ),
      catchError(this.handleError<any>('addnew'))
    );
}

   
  sendLine(userId : string,subject : string, detail:string ): Observable<any[]> {        
    
    return this.http.post<any>("https://opeclawcenter.herokuapp.com/send" , {"userId":"U8ca5da4a00a6dc462571e83c6038028c" ,"subject":"test LINE" ,"detail":"OK" } , LinehttpOptions).pipe(
      tap((s: any) =>console.log(s)),
      catchError(this.handleError<any>('line/send'))
    );
}

getLineTpken(): Observable<any[]> {        
    
  return this.http.post<any>("https://opeclawcenter.herokuapp.com/port" , {"userId":"U8ca5da4a00a6dc462571e83c6038028c" ,"subject":"test LINE" ,"detail":"OK" } , LinehttpOptions).pipe(
    tap((s: any) =>console.log(s)),
    catchError(this.handleError<any>('line/port'))
  );
}
}
