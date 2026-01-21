import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { LocalStorageService, SessionStorageService, LocalStorage, SessionStorage } from 'angular-web-storage';
import { ApiService } from './api.service';
import { VariablesService } from './variables.service';

@Injectable({
  providedIn: 'root'
})
export class DataSourceService {

  public AppVars = new Subject<any>();
  _variables:any = {}
  constructor(public local: LocalStorageService, public session: SessionStorageService , api:ApiService ,Appvar : VariablesService ) { 

  }
 
   
  public setSession(session:any) {
    this.AppVars.next(session)
  }
  public setVariable( variablename:string, value:any) {
    this._variables[variablename] =value
    this.AppVars.next({eventname:'VariablesChanging',variablename:variablename ,value:value})
  }

  public DeleteVariable( variablename:string) {
    delete this._variables[variablename] 
  }
  public getVariable( variablename:string) {
    return this._variables[variablename] 
  }
  
  public setScreenSize(  value:any) {
    this._variables['currentScreenSize'] =value
    this.AppVars.next({eventname:'ChangeScreenSize',value:value})
  } 

  public setValue(key: string,value: any) {
    this.session.set(key,value)  
 }  
 public getValue(key: string) {
  return this.session.get(key)  
}  


public LocalSetValue(key: string,value: any) {
  this.local.set(key,value)  
}  

public LocalGetValue(key: string) {
  return this.local.get(key)  
}  
public LocalDeleteValue(key: string) {
  return this.local.remove(key); 
}
}