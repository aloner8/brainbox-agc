

import {Injectable} from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import {Observable, ReplaySubject, Subject} from "rxjs";

import {map} from "rxjs/operators";

import { LocalStorageService, SessionStorageService, LocalStorage, SessionStorage } from 'angular-web-storage';

@Injectable()
export class AppService {
   public variables = new Subject<any>();
   _variables:any = {}
  
    constructor(public local: LocalStorageService, public session: SessionStorageService) { }
  
    public setSession(session:any) {
      this.variables.next(session)
    }
    public setVariable( variablename:string, value:any) {
      this._variables[variablename] =value
      this.variables.next({eventname:'VariablesChanging',variablename:variablename ,value:value})
    }
    public getVariable( variablename:string) {
      return this._variables[variablename] 
    }
    
    public setScreenSize(  value:any) {
      this._variables['currentScreenSize'] =value
      this.variables.next({eventname:'ChangeScreenSize',value:value})
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

  
  }