
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
  selector: 'ideas-command',
  templateUrl: 'ideas-command.component.html',
  styleUrl: 'ideas-command.component.scss',   
  
})
export class IdeasCommand implements OnInit {

  @Input() ShowMode: string ='Detail'
  @Input() Name: string ='IdeasCommandButton'
  @Input() Parent:Subject<any> = new Subject();
  
  @Input() EditLevel:string = 'Editable'
  @Input() CurrentState:number = 0
  @Input() isLoading = false;
  @Output() SendEvents : EventEmitter<any> = new EventEmitter();
  
  showstate =''
  UserLevel:string = ''

    formmaster:FormGroup =new FormGroup({
        first: new FormControl('Nancy', Validators.minLength(2)),
        last: new FormControl('Drew'),
      });
      hideSingleSelectionIndicator = signal(false);
      BaseHref = ''

    constructor(private AppService:VariablesService , private API:ApiService,private user:UserService) {
        
    }
    ngOnInit(): void {
        const _button = this
        this.formmaster =new FormGroup({
            first: new FormControl('Nancy', Validators.minLength(2)),
            last: new FormControl('Drew'),
          });
          this.BaseHref = this.API.getBaseHref();
          this.isLoading=false
        //  this.Implement('FormEnable');
          this.Parent.subscribe(function(v:any){
            //  console.log(v)
              
                        switch (v.eventname) {
                               
                               case 'IdeaNewLoadComplete' :
                                // console.log('IdeaNewLoadComplete:',v)
                                _button.isLoading=false
                                 if(_button.ShowMode=='NewIdeas') {
                                  _button.UserLevel = '[SD]'
                                 } else {
                                  _button.UserLevel = v.userlevel?v.userlevel:''
                                  if(_button.getUserLevel('[ISTC]')){
                                    
                                    _button.Implement('FormEnable')
                                  }
                                  if(_button.getUserLevel('[RDTA]')){
                                    _button.Defend('FormEnable')
                                  }
                                  if(_button.getUserLevel('[AP]')){
                                    _button.apply('FormEnable')
                                  }
                                 }
                               
                               // console.log(_button.UserLevel)
                             
                              
                               
                               break;

                             /*  case 'BeginSaveDraft' :  
                                    _button.isLoading = false;
                                 break; */
                                 
                        }
       
                        
           })


           this.AppService.AppVars.subscribe(function(av:any){
              console.log(av)
              if(av.variablename=='EnableCommandButton'){
                              if(av.value){
                _button.isLoading = false;
                
              }

              }
                        
                        
           })
           
    }

    
       first() {
        return this.formmaster.get('first');
      }
    
      onSubmit(): void {
      //  console.log(this.formmaster.value); // {first: 'Nancy', last: 'Drew'}
      }
    
      SaveDraft(){
        if(!this.isLoading){
        this.isLoading = true;
        this.SendEvents.emit({eventname:'SaveDraft',sender:this.Name})
        }

      }
      setValue() {
        this.formmaster.setValue({first: 'Carson', last: 'Drew'});
      }
      SendApprove(){
    //console.log('SendApprove')
            if(!this.isLoading){
              this.isLoading = true;
        this.SendEvents.emit({eventname:'SendApprove',sender:this.Name})
        }

      }
      Delete(){

        let _confermDelete = window.confirm('If you delete this information, you will not be able to do anything with it. Are you sure?')
        if(_confermDelete){
            this.SendEvents.emit({eventname:'Delete',sender:this.Name})
        }
         this.isLoading = false;
            

      }
      Approver(button:string){
                if(!this.isLoading){
                  this.isLoading = true;
        this.SendEvents.emit({eventname:'ApproverClickButton',buttonname:button,sender:this.Name})
        }

      }
      Implement(button:string){
        console.log(button,':',this.isLoading)
                if(!this.isLoading){
                          this.isLoading = true;
        this.SendEvents.emit({eventname:'ImplementerClickButton',buttonname:button,sender:this.Name})
          
        }

      }
      apply (button:string){
                if(!this.isLoading){
                 this.isLoading = true;
        this.SendEvents.emit({eventname:'ApplyClickButton',buttonname:button,sender:this.Name})
        }
 
      }

      Defend(button:string){
                if(!this.isLoading){
                  this.isLoading = true;
        this.SendEvents.emit({eventname:'DefendClickButton',buttonname:button,sender:this.Name})
        }

      }


      getUserLevel(tag:string):boolean{    
       // console.log(tag,'==',this.UserLevel)
        if(this.UserLevel) {
        //  console.log(tag,'==',this.UserLevel.indexOf(tag,1))
          return (this.UserLevel.indexOf(tag)>-1);
        } 
        else {
          return false;
        }  
       
      }
      
}