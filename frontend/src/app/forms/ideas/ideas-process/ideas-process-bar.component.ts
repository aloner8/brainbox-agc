
import {Observable, Subject} from "rxjs";

import {VariablesService} from '../../../variables.service'
import { ApiService } from '../../../api.service';
import { UserService } from '../../../user/user.service';

import {ChangeDetectionStrategy, Component, EventEmitter, inject,Input,OnInit, Output, signal} from '@angular/core';
import {toSignal} from '@angular/core/rxjs-interop';
import {FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';

import {map} from 'rxjs/operators';

/** @title Form field with label */
@Component({
  selector: 'ideas-process-bar',
  templateUrl: 'ideas-process-bar.component.html',
  styleUrl: 'ideas-process-bar.component.scss',   
  
})
export class IdeasProcessBar implements OnInit {

  @Input() Name:string ='IdeasDetail'
  @Input() Parent:Subject<any> = new Subject();
  @Output() SendEvents : EventEmitter<any> = new EventEmitter();
  @Input()  Step:any = [{Step:0 ,StepName:'Blank' ,StepCaption:'Open' ,StepDetail:'' },{Step:0 ,StepName:'Blank' ,StepCaption:'Approve' ,StepDetail:'' },{Step:0 ,StepName:'Blank' ,StepCaption:'Implement' ,StepDetail:'' },{Step:0 ,StepName:'Blank' ,StepCaption:'Open' ,StepDetail:'' },{Step:0 ,StepName:'Blank' ,StepCaption:'Apply' ,StepDetail:'' }];
 
  Me:Subject<any> = new Subject();


    constructor(private AppService:VariablesService , private API:ApiService,private user:UserService) {
        
    }
    ngOnInit(): void {
      const _bar = this

      this.Parent.subscribe(function(v:any){
     // console.log(v)
      if(v['target']==_bar.Name){
                 switch (v.eventname) {
                         case 'VariablesChanging':
                         // _form.setValue()
                          break
                        case 'IdeaTabChange' :
                         // console.log(v)
                      
                          _bar.Step = v.stepBar
                      

                       //  console.log(_bar.Step)
                         setTimeout(() => {
                          _bar.Me.next({eventname:'SetStepBar',value:_bar.Step}) 
                         }, 300);
                         
                        
                        break

                        case 'IdeaNewLoadComplete' :
                          // console.log(v)
                       
                           _bar.Step = v.stepBar
                       
 
                        //  console.log(_bar.Step)
                          setTimeout(() => {
                           _bar.Me.next({eventname:'SetStepBar',value:_bar.Step}) 
                          }, 300);
                          
                         
                         break
                        

                        
                 }

                }
    })

    this.SendEvents.emit({eventname:'InitComplete',Name:this.Name})

    }
    

}