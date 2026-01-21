
import {Observable, Subject} from "rxjs";

import {VariablesService} from '../../../variables.service'
import { ApiService } from '../../../api.service';
import { UserService } from '../../../user/user.service';

import {ChangeDetectionStrategy, Component, inject,Input,input,OnInit, signal} from '@angular/core';
import {toSignal} from '@angular/core/rxjs-interop';
import {FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';

import {map} from 'rxjs/operators';

/** @title Form field with label */
@Component({
  selector: 'ideas-process-step',
  templateUrl: 'ideas-process-step.component.html',
  styleUrl: 'ideas-process-step.component.scss',   
  
})
export class IdeasProcessStep implements OnInit {

    @Input() Step:number = 0;
    @Input() Parent:Subject<any> = new Subject();
    @Input() Steps:any = {};
    StepName:string = 'Blank';
    StepCaption:string= '';
    StepDetail:string= '';
    BaseHref=''

    StepBG:string ='assets/img/process-open-new.svg';
    //StepBG:string = _step.BaseHref + 'assets/img/tab-MyIdeas.svg';
    CaptionColor = 'white'
    constructor(private AppService:VariablesService , private API:ApiService,private user:UserService) {
        
    }
    ngOnInit(): void {
     const _step = this
     _step.BaseHref = this.API.getBaseHref();        
      this.Parent.subscribe(function(v:any){
       // console.log(v)
        
                 switch (v.eventname) {
                         case 'VariablesChanging':
                         // _form.setValue()
                          break
                        case 'SetStepBar' :
                        if(v.value[_step.Step]){
                        //  console.log(_step.Steps)   
                             _step.StepCaption = v.value[_step.Step].caption
                          _step.StepDetail = v.value[_step.Step].detail

                          switch (_step.Step) {
                            case 0:
                               if (v.value[_step.Step].name.indexOf("Current")> -1 ){_step.StepBG = _step.BaseHref + 'assets/img/process-open-new.svg'; _step.CaptionColor='white' } 
                                else  if (v.value[_step.Step].name.indexOf("Disable")> -1 ){_step.StepBG = _step.BaseHref + 'assets/img/process-open-disable.svg'; _step.CaptionColor='white' }
                                  else  if (v.value[_step.Step].name.indexOf("Pass")> -1 ){_step.StepBG = _step.BaseHref + 'assets/img/process-open-pass.svg'; ; _step.CaptionColor='white'}
                                    else {_step.StepBG = _step.BaseHref + 'assets/img/process-open-blank.svg';_step.CaptionColor='gray' }

                              break;
                            case 1:
                              if (v.value[_step.Step].name.indexOf("Wait")> -1 ){_step.StepBG = _step.BaseHref + 'assets/img/process-wait.svg';; _step.CaptionColor='white' }
                                else if (v.value[_step.Step].name.indexOf("Current")> -1 ){_step.StepBG = _step.BaseHref + 'assets/img/process-current.svg';; _step.CaptionColor='white' } 
                                  else  if (v.value[_step.Step].name.indexOf("Disable")> -1 ){_step.StepBG = _step.BaseHref + 'assets/img/process-disable.svg'; ; _step.CaptionColor='white'}
                                    else  if (v.value[_step.Step].name.indexOf("Pass")> -1 ){_step.StepBG = _step.BaseHref + 'assets/img/process-pass.svg';; _step.CaptionColor='white' }
                                      else  if (v.value[_step.Step].name.indexOf("Blank")> -1 ){_step.StepBG = _step.BaseHref + 'assets/img/process-blank.svg';_step.CaptionColor='gray' }
                                        else {_step.StepBG = _step.BaseHref + 'assets/img/process-blank.svg';_step.CaptionColor='gray' }

                                break;
                            case  2:
                              if (v.value[_step.Step].name.indexOf("Wait")> -1 ){_step.StepBG = _step.BaseHref + 'assets/img/process-wait.svg';; _step.CaptionColor='white' }
                                else if (v.value[_step.Step].name.indexOf("Current")> -1 ){_step.StepBG = _step.BaseHref + 'assets/img/process-current.svg';; _step.CaptionColor='white' } 
                                  else  if (v.value[_step.Step].name.indexOf("Disable")> -1 ){_step.StepBG = _step.BaseHref + 'assets/img/process-disable.svg';; _step.CaptionColor='white' }
                                    else  if (v.value[_step.Step].name.indexOf("Pass")> -1 ){_step.StepBG = _step.BaseHref + 'assets/img/process-pass.svg';; _step.CaptionColor='white' }
                                      else  if (v.value[_step.Step].name.indexOf("Blank")> -1 ){_step.StepBG = _step.BaseHref + 'assets/img/process-blank.svg';_step.CaptionColor='gray' }
                                        else {_step.StepBG = _step.BaseHref + 'assets/img/process-blank.svg';_step.CaptionColor='gray' }

                                break;
                            case 3:
                              if (v.value[_step.Step].name.indexOf("Wait")> -1 ){_step.StepBG = _step.BaseHref + 'assets/img/process-apply-wait.svg';; _step.CaptionColor='white' }
                              else if (v.value[_step.Step].name.indexOf("Current")> -1 ){_step.StepBG = _step.BaseHref + 'assets/img/process-apply.svg';; _step.CaptionColor='white' } 
                                else  if (v.value[_step.Step].name.indexOf("Disable")> -1 ){_step.StepBG = _step.BaseHref + 'assets/img/process-apply-disable.svg';; _step.CaptionColor='white' }
                                  else  if (v.value[_step.Step].name.indexOf("Blank")> -1 ){_step.StepBG = _step.BaseHref + 'assets/img/process-apply-blank.svg';_step.CaptionColor='gray' }
                                    else {_step.StepBG = _step.BaseHref + 'assets/img/process-blank.svg'; _step.CaptionColor='gray'}
                              break;                          
                            default:
                              break;
                          }
                        
                           
                            

                        break
                          
                    }
                }
    })

      
    }
    
     
}