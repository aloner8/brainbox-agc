
import {Observable, Subject} from "rxjs";
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {AsyncPipe } from '@angular/common';
import {LiveAnnouncer} from '@angular/cdk/a11y';
import {VariablesService} from '../../../variables.service'
import { ApiService } from '../../../api.service';
import { UserService } from '../../../user/user.service';


import {ChangeDetectionStrategy, Component, ElementRef, EventEmitter, inject,Input,OnInit, Output, signal, ViewChild} from '@angular/core';
import {toSignal} from '@angular/core/rxjs-interop';
import {FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';

import {map, startWith, tap} from 'rxjs/operators';
import { MatChipInputEvent } from "@angular/material/chips";
import { SnackBarService } from "../../../snack-bar/snack-bar.service";



export interface datalist {
  value:number;
  display: string;
  object: any;
}


/** @title Form field with label */
@Component({
  selector: 'form-ideas-detail',
  templateUrl: 'ideas-detail.component.html',
  styleUrl: 'ideas-detail.component.scss',   
  
})
export class FormIdeasDetail implements OnInit {
  
  @Input() ShowMode: string ='Detail'
  @Input() Name: string ='IdeasDetail'
  @Input() Parent:Subject<any> = new Subject();
  @Input() ProjectDetail:any = {}
  @Output() SendEvents : EventEmitter<any> = new EventEmitter();
  
  categorylist:datalist[] = []
  subcategorylist:datalist[] = []
  approverlist:datalist[] = []
  coordinatorlist:datalist[] = []
  memberlist:datalist[] = []
  memberlistfilter:string=''
  memberteam:datalist[] = []
  memberteam_removed:datalist[] = []
  approverlistone:datalist={
  value:0,
  display: '',
  object: {}
}
  file:any
  readonly memberteams = signal<datalist[]>([]);
  blankList:datalist = {value:0,display:'-',object:{}}
  dropzone_editable:boolean = false
  fruits: datalist[] = [{display: 'Lemon',value:1,object:null},];
  project_group= new FormControl(0);
  IdeaByControl = new FormControl<string | datalist>('');
    ProjectForm = this.fb.group({  
      id : [0],
      running_year : [0],
      running_no : [0],
      title :[''],
      project_group :[0,[Validators.required, Validators.min(1)]],
      suggest_date : [''],
      user_number : [0],
      category_master_id : [0],
      subcategory_master_id : [0],
      idea_by :[0],
      status_detail : [''],
      present_situation : [''],
      innovation_detail : [''],
      expect_result : [''],
      ext_partner : [0,[Validators.required, Validators.min(1)]],
      partner_name : [''],
      calculation_text : [''],
      investment_plan : [0],
      investment_actual : [0],
      cost_saving_plan : [0],
      cost_saving_actual :[0],
      ig_expected_plan : [0],
      ig_expected_actual : [0],
      hardsaving : [0],
      softsaving : [0],
      score_in_month : [0],
      score_in_month_logdate : [0],
      current_status : [0],
      active : [0],
      create_by : [''],
      update_by : [0],
      created_at : [''],
      updated_at : [''],
      moc_ref : [''],
      wi_ref : [''],
      other_doc : [''],
      are_related_doc : [''],
      running : [''],
      subideasname :[''],
      pointcategory : [0],
      division : [''],
      currentstatus : [''],
      pointstatus : [0],
      fullname : [''],
    })

      hideSingleSelectionIndicator = signal(false);
      readonly addOnBlur = true;
      readonly separatorKeysCodes = [ENTER, COMMA] as const;      
      readonly announcer = inject(LiveAnnouncer);
      myControl = new FormControl<string | datalist>('');
      
      
      readonly addOnBlurFile = true;
      readonly separatorKeysCodesFile = [ENTER, COMMA] as const;      
      readonly announcerFile = inject(LiveAnnouncer);
      FileControl = new FormControl<string | datalist>('');
  options: datalist[] = [];
  UserInfo:any={}
  
  filteredOptions: Observable<datalist[]> =this.myControl.valueChanges.pipe(
    startWith(''),
    map(value => {
      const display = typeof value === 'string' ? value : value?.display;
      return display ? this._filter(display as string) : this.options.slice();
    }),
  ); 

  filteredIdeaBy: Observable<datalist[]> =this.IdeaByControl.valueChanges.pipe(
    startWith(''),
    map(value => {
      const display = typeof value === 'string' ? value : value?.display;
      return display ? this._filterIdeaBy(display as string) : this.options.slice();
    }),
  ); 

  ControlApprove_1 = new FormControl<datalist>(this.blankList);
  ControlApprove_2 = new FormControl< datalist>(this.blankList);
  ControlApprove_3 = new FormControl<datalist>(this.blankList);

  ControlCoordinator_1 = new FormControl<datalist>(this.blankList);
  ControlCoordinator_2 = new FormControl<datalist>(this.blankList);
  ControlCoordinator_3 = new FormControl<datalist>(this.blankList);


  filteredApprove_1: Observable<datalist[]> =this.ControlApprove_1.valueChanges.pipe(
    startWith(''),
    map(value => {
      const display = typeof value === 'string' ? value : value?.display;
      return display ? this._filterApprove(display as string) : this.approverlist.slice();
    }) ,
          tap(filtered  => {
            this.approverlistone={ value:0,
                    display: '',
                    object: {}}
           if (filtered.length === 1) {
             this.approverlistone=filtered[0]
              
            }
          })
  ); 

  filteredApprove_2: Observable<datalist[]> =this.ControlApprove_2.valueChanges.pipe(
    startWith(''),
    map(value => {
      const display = typeof value === 'string' ? value : value?.display;
      return display ? this._filterApprove(display as string) : this.approverlist.slice();
    }) ,
          tap(filtered  => {
            this.approverlistone={ value:0,
                    display: '',
                    object: {}}
           if (filtered.length === 1) {
             this.approverlistone=filtered[0]
              
            }
          })
  ); 

  filteredApprove_3: Observable<datalist[]> =this.ControlApprove_3.valueChanges.pipe(
    startWith(''),
    map(value => {
      const display = typeof value === 'string' ? value : value?.display;
     /*  if(this._filterApprove(display as string).length == 1) {
        this.ControlApprove_3.setValue(this._filterApprove(display as string)[0])
      } */
      return display ? this._filterApprove(display as string) : this.approverlist.slice();
    })    ,
          tap(filtered  => {
            this.approverlistone={ value:0,
                    display: '',
                    object: {}}
           if (filtered.length === 1) {
             this.approverlistone=filtered[0]
              
            }
          })
  ); 

  filteredCoordinator_1: Observable<datalist[]> =this.ControlCoordinator_1.valueChanges.pipe(
    startWith(''),
    map(value => {
      const display = typeof value === 'string' ? value : value?.display;
      return display ? this._filterCoordinator(display as string) : this.coordinatorlist.slice();
    }) ,
          tap(filtered  => {
            this.approverlistone={ value:0,
                    display: '',
                    object: {}}
           if (filtered.length === 1) {
             this.approverlistone=filtered[0]
              
            }
          })
  ); 
  filteredCoordinator_2: Observable<datalist[]> =this.ControlCoordinator_2.valueChanges.pipe(
    startWith(''),
    map(value => {
      const display = typeof value === 'string' ? value : value?.display;
      return display ? this._filterCoordinator(display as string) : this.coordinatorlist.slice();
    }) ,
          tap(filtered  => {
            this.approverlistone={ value:0,
                    display: '',
                    object: {}}
           if (filtered.length === 1) {
             this.approverlistone=filtered[0]
              
            }
          })
  ); 
  filteredCoordinator_3: Observable<datalist[]> =this.ControlCoordinator_3.valueChanges.pipe(
    startWith(''),
    map(value => {
      const display = typeof value === 'string' ? value : value?.display;
      return display ? this._filterCoordinator(display as string) : this.coordinatorlist.slice();
    }) ,
          tap(filtered  => {
            this.approverlistone={ value:0,
                    display: '',
                    object: {}}
           if (filtered.length === 1) {
             this.approverlistone=filtered[0]
              
            }
          })
  ); 

  files: File[] = [];
  filedownload:any=[];
  fileremove:any=[];
  urldownload:string = ''
  BaseHref:string = ''
  rdo_ext_partner = "2"
  @ViewChild('ig_expected_actual') ig_expected_actualRef!: ElementRef;
  
    constructor(private AppService:VariablesService ,private API:ApiService,private user:UserService ,private fb: FormBuilder, private snackBar:SnackBarService) {
     
    }
    ngOnInit(): void {
      const _form = this
      this.urldownload = this.API.getUrldownload()
      this.UserInfo = this.AppService.getVariable('UserHome')
      this.BaseHref = this.API.getBaseHref()
/*       this.filteredOptions = this.myControl.valueChanges.pipe(
        startWith(''),
        map(value => {
        //  console.log('filteredOptions',value)
          const display = typeof value === 'string' ? value : value?.display;
          return display ? this._filter(display as string) : this.memberlist.slice();
        }),
      ); */
      _form.memberlist = this.AppService.getVariable('datalistsources')['all_member_list']
      
      this.Parent.subscribe(function(v:any){
     // console.log(v)
      if(v['target']==_form.Name){
        switch (v.eventname) {
          case 'VariablesChanging':
          // _form.setValue()


           break;

           
           case 'loadNewIdea' :
          //console.log(v)
                 _form.ProjectDetail = v.value         
               _form.categorylist = v.value['category_list']
               _form.subcategorylist = v.value['sub_category_list']
               _form.approverlist =  _form.AppService.getVariable('datalistsources')['appover_list']
               _form.coordinatorlist =   _form.AppService.getVariable('datalistsources')['coordinator_list']
               _form.memberteam = v.value['member_team']
                _form.remove_all_new_file();
               _form.setValue()
                _form.AppService.setVariable('EnableCommandButton',true)
               
            break;
         case 'IdeaTabChange' :
      //console.log(v)
             _form.ProjectDetail = v.ProjectDetail         
           _form.categorylist = v.ProjectDetail['category_list']
           _form.subcategorylist =v.ProjectDetail['sub_category_list']
           _form.approverlist =  _form.AppService.getVariable('datalistsources')['appover_list']
           _form.coordinatorlist =   _form.AppService.getVariable('datalistsources')['coordinator_list']
           //_form.memberlist = v.ProjectDetail['member_list']
           _form.remove_all_new_file();
           _form.memberteam = v.ProjectDetail['member_team']
          
           _form.setValue()
              _form.AppService.setVariable('EnableCommandButton',true)
                if(_form.ProjectDetail.current_status==10){
              if(_form.UserInfo.isadmin==1){
                 _form.setenabale()
              }
              }
           if (v.enabled) { 
            setTimeout(() => {              
             _form.setenabale()
              //_form.AppService.setVariable('EnableCommandButton',true)
            }, 1000);
           
         } else {
            if(_form.ProjectDetail.current_status==10){
              if(_form.UserInfo.isadmin==1){
                 _form.setenabale()
              }
              }
         }
        break;
        case 'RefreshDetail' :
        //console.log(v)               
             _form.memberteam = v.ProjectDetail['member_team']
          
             _form.setValue()
                _form.AppService.setVariable('EnableCommandButton',true)
                  if(_form.ProjectDetail.current_status==10){
              if(_form.UserInfo.isadmin==1){
                 _form.setenabale()
              }
              }
          break;

        

           case 'BeginSaveDraft' :
         //console.log(v)
                if(_form.CheckTitleRequired()=='SAVE'){
                  let _insert = _form.MapToTableProject()
                  let _message:string =''
              //console.log('ProjectForm:', _form.MapToTableProject());

                 _form.API.CallProcedure('public.insert_new_project',_insert).subscribe(function(inserted){
                //console.log('public.insert_new_project:',inserted)
                    if(inserted[0]){                    

                      _form.snackBar.openSnackBar('เพิ่มข้อมูลใหม่ เสร็จสมบูรณ์', 'OK', 'center', 'top', 'snack-style')
                      _message = 'add new IdeaNo. '+ inserted[0].running + ' success.'
                      _form.API.CallProcedure('public.insert_notifications',{project_id:inserted[0].id, user_id:inserted[0].create_by,textmessage:_message }).subscribe(function(output){
                          //console.log('insert_notifications:',output)                                                          
                              }) 
                      _form.API.CallProcedure('public.update_project_states_mail_cc',{id:inserted[0].statedetail.id_state }).subscribe(function(inserted){})
                   //   _form.SendEvents.emit({eventname:'CreateProjectToSendMail' , inserted: inserted[0] })
                            
                          _form.API.Query('SELECT public.get_idea_document_new($1) ',[parseInt(_form.UserInfo.id)  ]).subscribe(function(output){
                          console.log(output)
                             
                                let newdoc = output[0]['get_idea_document_new']
                                if(newdoc){

                                                   


                                  for (let index = 0; index < newdoc.length; index++) {
                                    const element = newdoc[index];
                                    _form.API.MoveFile(element.filepath,element.newfilepath).subscribe(function(moved){
                                      console.log(moved)

                                      if(index == newdoc.length-1){
                                        _form.API.CallProcedure('public.move_new_docment_to_project',{id:inserted[0].id, create_by:inserted[0].create_by}).subscribe(function(doc){
                                        console.log('public.move_new_docment_to_project:',doc)
                                            if(doc[0]){   
                                            }
                                          })
                                             _form.SendEvents.emit({eventname:'CreateProjectToSendMail' , inserted: inserted[0] })
                                      }  
                                    })
                                  }
                                } else {
                                   _form.SendEvents.emit({eventname:'CreateProjectToSendMail' , inserted: inserted[0] })
                                }
                             
                            })
                        /* setTimeout(() => {
                       // _form.SendEvents.emit({eventname:'InsertProjectSuccess',id:1})
                       window.document.location.reload()
                      }, 1000);   */
                         _form.SendEvents.emit({eventname:'CreateProjectToSendMail' , inserted: inserted[0] })
                    }
                    
                  })  
                } else {
                  _form.AppService.setVariable('EnableCommandButton',true)
                    if(_form.ProjectDetail.current_status==10){
              if(_form.UserInfo.isadmin==1){
                 _form.setenabale()
              }
              }
                }
         
         break;
         
         case 'SaveDraft' :
      //console.log(v)
             if(_form.CheckTitleRequired()=='SAVE'){


              let _updater:any =  _form.CheckEditField()
          //console.log('CheckEditField:',_updater)

              /* 
               let _insert = _form.MapToTableProject()
           //console.log('ProjectForm:', _form.MapToTableProject());
*/
              _form.API.Query(_updater.updateStr,[]).subscribe(function(updated){
             //console.log('update project:',updated)
                 _form.snackBar.openSnackBar('Update idea success', 'Okey', 'center', 'top', ['green-snackbar','success-snackbar'])
                 
                   _form.SendEvents.emit({eventname:'UpdateProjectSuccess' })
                  setTimeout(() => {
                    // _form.SendEvents.emit({eventname:'InsertProjectSuccess',id:1})
                    window.document.location.reload()
                   }, 500);  
               })   
             } else {
   _form.AppService.setVariable('EnableCommandButton',true)
     if(_form.ProjectDetail.current_status==10){
              if(_form.UserInfo.isadmin==1){
                 _form.setenabale()
              }
              }
             }
      
      break;
        case 'BG_SaveDraft' :
      //console.log(v)
             if(_form.CheckTitleRequired()=='SAVE'){


              let _updater:any =  _form.CheckEditField()
          //console.log('CheckEditField:',_updater)

              /* 
               let _insert = _form.MapToTableProject()
           //console.log('ProjectForm:', _form.MapToTableProject());
*/
              _form.API.Query(_updater.updateStr,[]).subscribe(function(updated){
             //console.log('update project:',updated)
                 _form.snackBar.openSnackBar('Update idea success', 'Okey', 'center', 'top', ['green-snackbar','success-snackbar'])
                 
                   _form.SendEvents.emit({eventname:'UpdateProjectSuccess' })
               
               })   
             } else {
   _form.AppService.setVariable('EnableCommandButton',true)
     if(_form.ProjectDetail.current_status==10){
              if(_form.UserInfo.isadmin==1){
                 _form.setenabale()
              }
              }
             }
      
      break;

      case 'Applied' :
    //console.log(v)
           if(_form.CheckRequired()=='SAVE'){


            let _updater:any =  _form.CheckEditField()
        //console.log(_updater)

            /* 
             let _insert = _form.MapToTableProject()
         //console.log('ProjectForm:', _form.MapToTableProject());
*/
            _form.API.Query(_updater.updateStr,[]).subscribe(function(updated){
           //console.log('update project:',updated)
               _form.snackBar.openSnackBar('Update idea success', 'Okey', 'center', 'top', ['green-snackbar','success-snackbar'])
               
                 _form.SendEvents.emit({eventname:'AppliedOK' })
     
             })   
           } else {
 
                  _form.AppService.setVariable('EnableCommandButton',true)
                    if(_form.ProjectDetail.current_status==10){
              if(_form.UserInfo.isadmin==1){
                 _form.setenabale()
              }
              }
                
           }
    
    break;
      
      case 'SaveDefendBYOwner' : 

   /*    _form.API.CallProcedure('public.update_project_raise_defend_to_approver',{project_id:_form.ProjectDetail.id,target: _form.UserInfo.id , idea_by:_form.ProjectDetail.idea_by }).subscribe(function(updated){
    //console.log('public.update_project_raise_defend_to_approver:',updated)
        //_form.ProjectDetail = updated;
        //_form.setValue();
        _form.SendEvents.emit({eventname:'UpdateProjectToSendMail' , updated:_form.ProjectDetail })
      }) */
      if(_form.CheckRequired()=='SAVE'){


        let _updater:any =  _form.CheckEditField()
    //console.log(_updater)

        /* 
         let _insert = _form.MapToTableProject()
     //console.log('ProjectForm:', _form.MapToTableProject());
*/
        _form.API.Query(_updater.updateStr,[]).subscribe(function(updated){
       //console.log('update project:',updated)
           _form.snackBar.openSnackBar('Update idea success', 'OK', 'center', 'top', 'snack-style')
          
           if(updated){
            _form.SendEvents.emit({eventname:'UpdateProjectToSendMail' , updated:updated })
          } else {
            _form.SendEvents.emit({eventname:'UpdateProjectToSendMail' , updated:_form.ProjectDetail })
          }
            // _form.SendEvents.emit({eventname:'UpdateProjectToSendMail' , updated:updated })
          
            
             
         })   
       } else {
           _form.AppService.setVariable('EnableCommandButton',true)
             if(_form.ProjectDetail.current_status==10){
              if(_form.UserInfo.isadmin==1){
                 _form.setenabale()
              }
              }
       } 
                   
               
             break; 

           case 'SaveDraftAndApprove' :
      //console.log(v)
             if(_form.CheckRequired()=='SAVE'){


              let _updater:any =  _form.CheckEditField()
          //console.log(_updater)

              /* 
               let _insert = _form.MapToTableProject()
           //console.log('ProjectForm:', _form.MapToTableProject());
*/
              _form.API.Query(_updater.updateStr,[]).subscribe(function(updated){
             //console.log('update project:',updated)
                 _form.snackBar.openSnackBar('Update idea success', 'OK', 'center', 'top', 'snack-style')
                if(updated){
                  _form.SendEvents.emit({eventname:'UpdateProjectToSendMail' , updated:updated })
                } else {
                  _form.SendEvents.emit({eventname:'UpdateProjectToSendMail' , updated:_form.ProjectDetail })
                }
                 
                
                  
                   
               })   
             } else {
                 _form.AppService.setVariable('EnableCommandButton',true)
                   if(_form.ProjectDetail.current_status==10){
              if(_form.UserInfo.isadmin==1){
                 _form.setenabale()
              }
              }
             }
             break; 
             case 'SaveImplemetAndApprove' :
          //console.log(v)
                 if(_form.CheckRequired()=='SAVE'){
    
    
                  let _updater:any =  _form.CheckEditField()
              //console.log(_updater)
    
                  /* 
                   let _insert = _form.MapToTableProject()
               //console.log('ProjectForm:', _form.MapToTableProject());
    */
                  _form.API.Query(_updater.updateStr,[]).subscribe(function(updated){
                 //console.log('update project:',updated)
                     _form.snackBar.openSnackBar('Update idea success', 'OK', 'center', 'top', 'snack-style')                  
                       _form.SendEvents.emit({eventname:'UpdatedByImplementer' , updated:updated })
                       
                   })   
                 } else {
                     _form.AppService.setVariable('EnableCommandButton',true)
                       if(_form.ProjectDetail.current_status==10){
              if(_form.UserInfo.isadmin==1){
                 _form.setenabale()
              }
              }
                 }
                 break; 
                 case 'SaveImplemet' :
                     if(_form.CheckTitleRequired()=='SAVE'){
                      let _updater:any =  _form.CheckEditField()
                  //console.log(_updater)
                      /* 
                       let _insert = _form.MapToTableProject()
                   //console.log('ProjectForm:', _form.MapToTableProject());
        */
                      _form.API.Query(_updater.updateStr,[]).subscribe(function(updated){
                     //console.log('update project:',updated)
                              _form.API.CallProcedure('public.update_project_save_implement',{project_id:_form.ProjectDetail.id, target:_form.UserInfo.id }).subscribe(function(saved){
                              //console.log('update_project_save_implement:',saved)
                                  let _message:string =''
                                    if(!updated['status']){ 
                                      
                                    } else {

                                    }
                                  })

                         _form.snackBar.openSnackBar('Update idea success', 'OK', 'center', 'top', 'snack-style')                  
                           _form.setdisbale();
                             setTimeout(() => {
                            // _form.SendEvents.emit({eventname:'InsertProjectSuccess',id:1})
                            window.document.location.reload()
                           }, 500);    
                       })   
                     } else {
                         _form.AppService.setVariable('EnableCommandButton',true)
                           if(_form.ProjectDetail.current_status==10){
              if(_form.UserInfo.isadmin==1){
                 _form.setenabale()
              }
              }
                     }
                     break;

                 case 'SaveBYCoordinator' :
              //console.log(v)
                     if(_form.CheckRequired()=='SAVE'){
        
        
                      let _updater:any =  _form.CheckEditField()
                  //console.log(_updater)
        
                      /* 
                       let _insert = _form.MapToTableProject()
                   //console.log('ProjectForm:', _form.MapToTableProject());
        */
                      _form.API.Query(_updater.updateStr,[]).subscribe(function(updated){
                     //console.log('update project:',updated)
                        // _form.ProjectDetail = updated;
                       //  _form.setValue();
                         _form.snackBar.openSnackBar('Update idea success', 'OK', 'center', 'top', 'snack-style')
                         _form.setdisbale();
                           _form.SendEvents.emit({eventname:'UpdatedByCoordinator' , updated:updated })
                           setTimeout(() => {
                            // _form.SendEvents.emit({eventname:'InsertProjectSuccess',id:1})
                            window.document.location.reload()
                           }, 500);  
                       })   
                     } else {
                         _form.AppService.setVariable('EnableCommandButton',true)
                           if(_form.ProjectDetail.current_status==10){
              if(_form.UserInfo.isadmin==1){
                 _form.setenabale()
              }
              }
                     }
                     break; 
                 
                     case 'Save Defend' :
                  //console.log(v)
                         if(_form.CheckTitleRequired()=='SAVE'){
            
            
                          let _updater:any =  _form.CheckEditField()
                      //console.log(_updater)
            
                          /* 
                           let _insert = _form.MapToTableProject()
                       //console.log('ProjectForm:', _form.MapToTableProject());
            */
                          _form.API.Query(_updater.updateStr,[]).subscribe(function(updated){
                         //console.log('update project:',updated)                             
                             _form.snackBar.openSnackBar('Update idea success', 'OK', 'center', 'top', 'snack-style')
                             _form.setdisbale()
                             //_form.ProjectForm.get<Array>('statedetail').setValue( [].concat(updated[0].statedetail) )
                             _form.API.CallProcedure('public.update_project_defend',{project_id:_form.ProjectDetail.id,target: _form.UserInfo.id }).subscribe(function(defened){
                          //console.log('public.update_project_defend:',defened)

                              _form.SendEvents.emit({eventname:'Save Defend' , updated:defened })
                              setTimeout(() => {
                                // _form.SendEvents.emit({eventname:'InsertProjectSuccess',id:1})
                                window.document.location.reload()
                               }, 500);  
                            })
                              
                               
                           })   
                         } else {
                             _form.AppService.setVariable('EnableCommandButton',true)
                               if(_form.ProjectDetail.current_status==10){
              if(_form.UserInfo.isadmin==1){
                 _form.setenabale()
              }
              }
                         }
                         break; 
                    
             case 'NewSaveDraftAndApprove' :
          //console.log(v)
                 if(_form.CheckRequired()=='SAVE'){
                   
                  let _insert = _form.MapToTableProject()
                  let _message:string =''
              //console.log('ProjectForm:', _form.MapToTableProject());

                 _form.API.CallProcedure('public.insert_new_project',_insert).subscribe(function(inserted){
                //console.log('public.insert_new_project:',inserted)
                    _form.snackBar.openSnackBar('เพิ่มข้อมูลใหม่ เสร็จสมบูรณ์', 'OK', 'center', 'top', 'snack-style')
                    if(inserted[0]){
                      _form.ProjectDetail =inserted[0]
                      _message = 'add new IdeaNo. '+ inserted[0].running + ' success.'
                      _form.API.CallProcedure('public.insert_notifications',{project_id:inserted[0].id, user_id:inserted[0].create_by,textmessage:_message }).subscribe(function(output){
                          //console.log('insert_notifications:',output)                                                          
                              }) 

                            _form.API.Query('SELECT public.get_idea_document_new($1) ',[parseInt(_form.UserInfo.id)  ]).subscribe(function(output){
                          console.log(output)
                             
                                let newdoc = output[0]['get_idea_document_new']
                                if(newdoc){

                                  for (let index = 0; index < newdoc.length; index++) {
                                    const element = newdoc[index];
                                    _form.API.MoveFile(element.filepath,element.newfilepath).subscribe(function(moved){
                                      console.log(moved)

                                      if(index == newdoc.length-1){
                                        _form.API.CallProcedure('public.move_new_docment_to_project',{id:inserted[0].id, create_by:inserted[0].create_by}).subscribe(function(doc){
                                        console.log('public.move_new_docment_to_project:',doc)
                                            if(doc[0]){   
                                            }
                                          })
                                           _form.SendEvents.emit({eventname:'UpdateProjectToSendMail' , updated:inserted[0] })
                                            // _form.SendEvents.emit({eventname:'SendApprove' , inserted: inserted[0] })
                                      }  
                                    })
                                  }
                               
                              }else {
                                    _form.SendEvents.emit({eventname:'UpdateProjectToSendMail' , updated:inserted[0] })
                                }
                            })
                        
                       
                    }
                  })
                 }  else {
                     _form.AppService.setVariable('EnableCommandButton',true)
                       if(_form.ProjectDetail.current_status==10){
              if(_form.UserInfo.isadmin==1){
                 _form.setenabale()
              }
              }
                 }
          

      break;         
  
  case 'FormEnable' :
        _form.setenabale();
           _form.AppService.setVariable('EnableCommandButton',true)
             if(_form.ProjectDetail.current_status==10){
              if(_form.UserInfo.isadmin==1){
                 _form.setenabale()
              }
              }
        break;   
  case 'FormDisable' :
    _form.setdisbale();
    _form.AppService.setVariable('EnableCommandButton',false)
      if(_form.ProjectDetail.current_status==10){
              if(_form.UserInfo.isadmin==1){
                 _form.setenabale()
              }
              }

        

break;         
}
  

}

        
    })

    this.SendEvents.emit({eventname:'InitComplete',Name:this.Name})

   _form.AppService.setVariable('EnableCommandButton',true)

    }

    CategoryMasterChange(event:any){

    }


    CheckRequired(){
      const _form = this

      if (_form.ProjectForm.controls.title.hasError('required') ){
        _form.snackBar.openSnackBar('กรุณาป้อนชื่อเรื่อง ให้มากกว่า 9 ตัวอักษร', 'OK', 'center', 'top', 'snack-style')
        _form.ProjectForm.controls.title.markAsTouched();
       } else {
       if (_form.IdeaByControl.hasError('required') ){
        _form.snackBar.openSnackBar('กรุณาป้อนชื่อเจ้าของไอเดีย', 'OK', 'center', 'top', 'snack-style')
       } else {
        if (_form.ProjectForm.controls.category_master_id.hasError('required') ||  !_form.ProjectForm.controls.category_master_id.value ){
          _form.snackBar.openSnackBar('กรุณาป้อนประเภทไอเดีย', 'OK', 'center', 'top', 'snack-style')
         } else {
          if (_form.ProjectForm.controls.project_group.hasError('required') ||  _form.ProjectForm.controls.project_group.hasError('min')  ){
            _form.snackBar.openSnackBar('กรุณาป้อนกลุ่มไอเดีย', 'OK', 'center', 'top', 'snack-style')
            _form.ProjectForm.controls.project_group.markAsTouched();
           } else {
            if (_form.ProjectForm.controls.suggest_date.hasError('required') ){
              _form.snackBar.openSnackBar('กรุณาป้อนวันที่สร้าง', 'OK', 'center', 'top', 'snack-style')
             } else {
              if (_form.ProjectForm.controls.ext_partner.hasError('required') ||  _form.ProjectForm.controls.ext_partner.hasError('min')   ){
                _form.snackBar.openSnackBar('กรุณาป้อนการขอความร่วมมือจากภายนอก', 'OK', 'center', 'top', 'snack-style')
                _form.ProjectForm.controls.ext_partner.markAsTouched();
               } else {
                if (_form.ProjectForm.controls.partner_name.hasError('required') ){
                  _form.snackBar.openSnackBar('กรุณาระบุผู้มีส่วนได้เสีย', 'OK', 'center', 'top', 'snack-style')
                  _form.ProjectForm.controls.partner_name.markAsTouched();
                 } else {
                      if (_form.ProjectForm.controls.present_situation.hasError('required') ){
                        _form.snackBar.openSnackBar('กรุณาป้อนข้อมูลสภาพปัจจุบัน', 'OK', 'center', 'top', 'snack-style')
                        _form.ProjectForm.controls.present_situation.markAsTouched();
                      } else {
                        if (_form.ProjectForm.controls.innovation_detail.hasError('required') ){
                          _form.snackBar.openSnackBar('กรุณาป้อนรายละเอียดข้อเสนอแนะ', 'OK', 'center', 'top', 'snack-style')
                          _form.ProjectForm.controls.innovation_detail.markAsTouched();
                        } else {
                          if (_form.ProjectForm.controls.calculation_text.hasError('required') ){
                            _form.snackBar.openSnackBar('กรุณาป้อนรายละเอียดการคำนวณ', 'OK', 'center', 'top', 'snack-style')
                            _form.ProjectForm.controls.calculation_text.markAsTouched();
                          } else {                        
                            if (_form.ControlApprove_1.hasError('required') ){
                              _form.snackBar.openSnackBar('กรุณาเลือก  Approver level 1', 'OK', 'center', 'top', 'snack-style')
                            } else {  
                              if (_form.ProjectForm.controls.moc_ref.hasError('required') ){
                                _form.snackBar.openSnackBar('กรุณาป้อนรายละเอียด MOC', 'OK', 'center', 'top', 'snack-style')
                                 _form.ProjectForm.controls.moc_ref.markAsTouched();
                              } else {                        
                                if (_form.ProjectForm.controls.wi_ref.hasError('required') ){
                                  _form.snackBar.openSnackBar('กรุณาป้อนรายละเอียด WI', 'OK', 'center', 'top', 'snack-style')
                                   _form.ProjectForm.controls.wi_ref.markAsTouched();
                                } else {                        
                                  if (_form.ProjectForm.controls.other_doc.hasError('required') ){
                                    _form.snackBar.openSnackBar('กรุณาป้อนรายละเอียด เอกสารอื่น ๆ', 'OK', 'center', 'top', 'snack-style')
                                    _form.ProjectForm.controls.other_doc.markAsTouched();
                                  } else {                        
                                  if (_form.ProjectForm.controls.expect_result.hasError('required') ){
                                    _form.snackBar.openSnackBar('กรุณาป้อน ผลที่คาดว่าจะได้รับ', 'OK', 'center', 'top', 'snack-style')
                                    _form.ProjectForm.controls.expect_result.markAsTouched();
                                  } else {                        
                                        return 'SAVE'
                                  }
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                    }
               }
             }
           }
         }
       }
       }
       return 'not save'
    }
    CheckTitleRequired(){
      const _form = this

      if (_form.ProjectForm.controls.title.hasError('required') ||_form.ProjectForm.controls.title.hasError('minlength') ){
        _form.snackBar.openSnackBar('กรุณาป้อนชื่อเรื่อง ให้มากกว่า 9 ตัวอักษร', 'OK', 'center', 'top', 'snack-style')
        _form.ProjectForm.controls.title.markAsTouched();
        return 'not save'
      } else {                        
         return 'SAVE'
      }  
  

    }

    displayFn(user: datalist): string {
      return user && user.display ? user.display : '';
    }

    displayFnMember(user: datalist): string {
      return user && user.display && user.display.split(']')[1] && user.display.split(']')[1].split('[')[0]? user.display.split(']')[1].split('[')[0] : '';
      
      
    }

    NameOnly = function(user: datalist){
      try {
        if(user){
          if(user.display){
            return user.display.split(']')[1].split('[')[0];
          } else{
            return user && user.display ? user.display : '';
          }
         
        }else{
          return '' 
        }
      } catch (error) {
        return ''
      }
     
    }

    optionSelected(event:any,index:number){
 //console.log(event?.option?.value)
      switch (index) {
        case 1:
            if(event.option.value.value ==this.ControlApprove_2.getRawValue()?.value  || event.option.value.value ==this.ControlApprove_3.getRawValue()?.value || event.option.value.value ==this.ControlCoordinator_1.getRawValue()?.value || event.option.value.value ==this.ControlCoordinator_2.getRawValue()?.value  || event.option.value.value ==this.ControlCoordinator_3.getRawValue()?.value  ){
              this.ControlApprove_1.setValue(null)
              this.snackBar.openSnackBar('ไม่สามารถเลือก Approver  ซ้ำกับรายชื่อที่เลือกแล้ว', 'OK', 'center', 'top', 'snack-style')
            }
          break;
        case 2:
            if(event.option.value.value ==this.ControlApprove_1.getRawValue()?.value  || event.option.value.value ==this.ControlApprove_3.getRawValue()?.value || event.option.value.value ==this.ControlCoordinator_1.getRawValue()?.value || event.option.value.value ==this.ControlCoordinator_2.getRawValue()?.value  || event.option.value.value ==this.ControlCoordinator_3.getRawValue()?.value   ){
              this.ControlApprove_2.setValue(null)
              this.snackBar.openSnackBar('ไม่สามารถเลือก Approver  ซ้ำกับรายชื่อที่เลือกแล้ว', 'OK', 'center', 'top', 'snack-style')
            }  
              this.UpdateApprover()
            
          break;
        case 3:
            if(event.option.value.value ==this.ControlApprove_1.getRawValue()?.value  || event.option.value.value ==this.ControlApprove_2.getRawValue()?.value  || event.option.value.value ==this.ControlCoordinator_1.getRawValue()?.value || event.option.value.value ==this.ControlCoordinator_2.getRawValue()?.value  || event.option.value.value ==this.ControlCoordinator_3.getRawValue()?.value   ){
              this.ControlApprove_3.setValue(null)
              this.snackBar.openSnackBar('ไม่สามารถเลือก Approver  ซ้ำกับรายชื่อที่เลือกแล้ว', 'OK', 'center', 'top', 'snack-style')
            } 
              this.UpdateApprover()
            
          break;
        case 4:
            if(event.option.value.value ==this.ControlCoordinator_2.getRawValue()?.value  || event.option.value.value ==this.ControlCoordinator_3.getRawValue()?.value   || event.option.value.value ==this.ControlApprove_1.getRawValue()?.value  || event.option.value.value ==this.ControlApprove_2.getRawValue()?.value   || event.option.value.value ==this.ControlApprove_3.getRawValue()?.value  ){
              this.ControlCoordinator_1.setValue(null)
              this.snackBar.openSnackBar('ไม่สามารถเลือก Coordinator  ซ้ำกับรายชื่อที่เลือกแล้ว', 'OK', 'center', 'top', 'snack-style')
            }
          break;
        case 5:
            if(event.option.value.value ==this.ControlCoordinator_1.getRawValue()?.value  || event.option.value.value ==this.ControlCoordinator_3.getRawValue()?.value  || event.option.value.value ==this.ControlApprove_1.getRawValue()?.value  || event.option.value.value ==this.ControlApprove_2.getRawValue()?.value   || event.option.value.value ==this.ControlApprove_3.getRawValue()?.value   ){
              this.ControlCoordinator_2.setValue(null)
              this.snackBar.openSnackBar('ไม่สามารถเลือก Coordinator  ซ้ำกับรายชื่อที่เลือกแล้ว', 'OK', 'center', 'top', 'snack-style')
            }
          break;
        case 6:
            if(event.option.value.value ==this.ControlCoordinator_1.getRawValue()?.value  || event.option.value.value ==this.ControlCoordinator_2.getRawValue()?.value   || event.option.value.value ==this.ControlApprove_1.getRawValue()?.value  || event.option.value.value ==this.ControlApprove_2.getRawValue()?.value   || event.option.value.value ==this.ControlApprove_3.getRawValue()?.value   ){
              this.ControlCoordinator_3.setValue(null)
              this.snackBar.openSnackBar('ไม่สามารถเลือก Coordinator  ซ้ำกับรายชื่อที่เลือกแล้ว', 'OK', 'center', 'top', 'snack-style')
            }
          break;
      
        default:
          break;
      }
    }

    
    CheckDuplicationApprover(value:number,index:number){
 //console.log(event?.option?.value)
      switch (index) {
        case 1:
            if(value ==this.ControlApprove_2.getRawValue()?.value  || value ==this.ControlApprove_3.getRawValue()?.value || value ==this.ControlCoordinator_1.getRawValue()?.value || value ==this.ControlCoordinator_2.getRawValue()?.value  || value ==this.ControlCoordinator_3.getRawValue()?.value  ){
              this.ControlApprove_1.setValue(null)
              this.snackBar.openSnackBar('ไม่สามารถเลือก Approver  ซ้ำกับรายชื่อที่เลือกแล้ว', 'OK', 'center', 'top', 'snack-style')
            }
          break;
        case 2:
            if(value ==this.ControlApprove_1.getRawValue()?.value  || value ==this.ControlApprove_3.getRawValue()?.value || value ==this.ControlCoordinator_1.getRawValue()?.value || value ==this.ControlCoordinator_2.getRawValue()?.value  || value ==this.ControlCoordinator_3.getRawValue()?.value   ){
              this.ControlApprove_2.setValue(null)
              this.snackBar.openSnackBar('ไม่สามารถเลือก Approver  ซ้ำกับรายชื่อที่เลือกแล้ว', 'OK', 'center', 'top', 'snack-style')
            }  
              this.UpdateApprover()
            
          break;
        case 3:
            if(value ==this.ControlApprove_1.getRawValue()?.value  || value ==this.ControlApprove_2.getRawValue()?.value  || value ==this.ControlCoordinator_1.getRawValue()?.value || value ==this.ControlCoordinator_2.getRawValue()?.value  || value ==this.ControlCoordinator_3.getRawValue()?.value   ){
              this.ControlApprove_3.setValue(null)
              this.snackBar.openSnackBar('ไม่สามารถเลือก Approver  ซ้ำกับรายชื่อที่เลือกแล้ว', 'OK', 'center', 'top', 'snack-style')
            } 
              this.UpdateApprover()
            
          break;
        case 4:
            if(value ==this.ControlCoordinator_2.getRawValue()?.value  || value ==this.ControlCoordinator_3.getRawValue()?.value   || value ==this.ControlApprove_1.getRawValue()?.value  || value ==this.ControlApprove_2.getRawValue()?.value   || value ==this.ControlApprove_3.getRawValue()?.value  ){
              this.ControlCoordinator_1.setValue(null)
              this.snackBar.openSnackBar('ไม่สามารถเลือก Coordinator  ซ้ำกับรายชื่อที่เลือกแล้ว', 'OK', 'center', 'top', 'snack-style')
            }
          break;
        case 5:
            if(value ==this.ControlCoordinator_1.getRawValue()?.value  || value ==this.ControlCoordinator_3.getRawValue()?.value  || value ==this.ControlApprove_1.getRawValue()?.value  || value ==this.ControlApprove_2.getRawValue()?.value   || value ==this.ControlApprove_3.getRawValue()?.value   ){
              this.ControlCoordinator_2.setValue(null)
              this.snackBar.openSnackBar('ไม่สามารถเลือก Coordinator  ซ้ำกับรายชื่อที่เลือกแล้ว', 'OK', 'center', 'top', 'snack-style')
            }
          break;
        case 6:
            if(value ==this.ControlCoordinator_1.getRawValue()?.value  || value ==this.ControlCoordinator_2.getRawValue()?.value   || value ==this.ControlApprove_1.getRawValue()?.value  || value ==this.ControlApprove_2.getRawValue()?.value   || value ==this.ControlApprove_3.getRawValue()?.value   ){
              this.ControlCoordinator_3.setValue(null)
              this.snackBar.openSnackBar('ไม่สามารถเลือก Coordinator  ซ้ำกับรายชื่อที่เลือกแล้ว', 'OK', 'center', 'top', 'snack-style')
            }
          break;
      
        default:
          break;
      }
    }
    ApproverLostFocus(event:any,index:number){
 //console.log(event,':',index)
      switch (index) {
        case 1:
       //console.log( this.ControlApprove_1)
 
          break;
        case 2:
      //console.log( this.ControlApprove_2)
              this.UpdateApprover()
            
          break;
        case 3:
    //console.log( this.ControlApprove_3)
              this.UpdateApprover()
            
          break;
        case 4:
            if(event.option.value.value ==this.ControlCoordinator_2.getRawValue()?.value  || event.option.value.value ==this.ControlCoordinator_3.getRawValue()?.value   || event.option.value.value ==this.ControlApprove_1.getRawValue()?.value  || event.option.value.value ==this.ControlApprove_2.getRawValue()?.value   || event.option.value.value ==this.ControlApprove_3.getRawValue()?.value  ){
              this.ControlCoordinator_1.setValue(null)
              this.snackBar.openSnackBar('ไม่สามารถเลือก Coordinator  ซ้ำกับรายชื่อที่เลือกแล้ว', 'OK', 'center', 'top', 'snack-style')
            }
          break;
        case 5:
            if(event.option.value.value ==this.ControlCoordinator_1.getRawValue()?.value  || event.option.value.value ==this.ControlCoordinator_3.getRawValue()?.value  || event.option.value.value ==this.ControlApprove_1.getRawValue()?.value  || event.option.value.value ==this.ControlApprove_2.getRawValue()?.value   || event.option.value.value ==this.ControlApprove_3.getRawValue()?.value   ){
              this.ControlCoordinator_2.setValue(null)
              this.snackBar.openSnackBar('ไม่สามารถเลือก Coordinator  ซ้ำกับรายชื่อที่เลือกแล้ว', 'OK', 'center', 'top', 'snack-style')
            }
          break;
        case 6:
            if(event.option.value.value ==this.ControlCoordinator_1.getRawValue()?.value  || event.option.value.value ==this.ControlCoordinator_2.getRawValue()?.value   || event.option.value.value ==this.ControlApprove_1.getRawValue()?.value  || event.option.value.value ==this.ControlApprove_2.getRawValue()?.value   || event.option.value.value ==this.ControlApprove_3.getRawValue()?.value   ){
              this.ControlCoordinator_3.setValue(null)
              this.snackBar.openSnackBar('ไม่สามารถเลือก Coordinator  ซ้ำกับรายชื่อที่เลือกแล้ว', 'OK', 'center', 'top', 'snack-style')
            }
          break;
      
        default:
          break;
      }  
    }
    private _filter(name: string): datalist[] {
      const filterValue = name.toLowerCase();
  
      return this.memberlist.filter(option => option.display.toLowerCase().includes(filterValue));
    }

    private _filterIdeaBy(name: string): datalist[] {
      const filterValue = name.toLowerCase();
  
      return this.memberlist.filter(option => option.display.toLowerCase().includes(filterValue));
    }

    private _filterApprove(name: string): datalist[] {
      const filterValue = name.toLowerCase();      
   //  console.log(this.approverlist)      
      return this.approverlist.filter(option => option.display.toLowerCase().includes(filterValue));
    }

    private _filterCoordinator(name: string): datalist[] {
      const filterValue = name.toLowerCase();      
   //  console.log(this.approverlist)
      return this.coordinatorlist.filter(option => option.display.toLowerCase().includes(filterValue));
    }


    add(event: MatChipInputEvent): void {
      const value = (event.value || '').trim();
  //console.log(event)
      // Add our fruit
      if (value) {
       // this.memberlistfilter=value
        
        this.memberteams.update(fruits => [...fruits, {display: value,value: 9999,object:{}}]);
      }
  
      // Clear the input value
      event.chipInput!.clear();
    }
    MemberSelected(event:any){
  //console.log(event.option.value)
      let exists = this.memberteam?.filter(function(m) { return m.value == event.option.value.value } )[0]
      if(!exists){
        let _nameonly = event.option.value.display.split(']',2)[1]
        _nameonly = _nameonly.split('[',2)[0]
        let _seleted   =  {display:_nameonly,value:event.option.value.value,object:{new:true} }
        if(!this.memberteam){ this.memberteam=[]}
        this.memberteam.push(_seleted)
      }
  //console.log('MemberSelected=',this.memberteam) 
      
      this.myControl.setValue(null)

    }


    CalculateIG(type:string){
      if(type=='Plan'){
        if(!this.ProjectForm.controls.investment_plan.value || !this.ProjectForm.controls.cost_saving_plan.value){
          this.ProjectForm.controls.ig_expected_plan.setValue(0)
            
        } else {
          if(this.ProjectForm.controls.investment_plan.value==0 || this.ProjectForm.controls.cost_saving_plan.value==0){
            this.ProjectForm.controls.ig_expected_plan.setValue(0)
          } else {
            let _ig = parseFloat(this.ProjectForm.controls.investment_plan.value.toString().replaceAll(',','') ) /parseFloat(this.ProjectForm.controls.cost_saving_plan.value.toString().replaceAll(',','') )
            if (typeof(_ig)!='number'){
              _ig =0
            }
            _ig = parseFloat(_ig.toFixed(2))
            this.ProjectForm.controls.ig_expected_plan.setValue( _ig)
            
          }
        }
        this.ProjectForm.controls.ig_expected_plan.markAsTouched();
        
         //this.ig_expected_planRef.nativeElement.dispatchEvent(new Event('input'));
      } else{
        if(!this.ProjectForm.controls.investment_actual.value || !this.ProjectForm.controls.cost_saving_actual.value){
          this.ProjectForm.controls.ig_expected_actual.setValue(0)
        } else {
          if(this.ProjectForm.controls.investment_actual.value==0 || this.ProjectForm.controls.cost_saving_actual.value==0){
            this.ProjectForm.controls.ig_expected_actual.setValue(0)
          } else {
            let _ig = parseFloat(this.ProjectForm.controls.investment_actual.value.toString().replaceAll(',','') ) /parseFloat(this.ProjectForm.controls.cost_saving_actual.value.toString().replaceAll(',','') )
        //console.log(this.ProjectForm.controls.investment_actual.value,'/',this.ProjectForm.controls.cost_saving_actual.value,'=',_ig)
            if (typeof(_ig)!='number'){
              _ig =0
            }
            _ig = parseFloat(_ig.toFixed(2))
            this.ProjectForm.controls.ig_expected_actual.setValue(_ig)
          }
        }
        this.ig_expected_actualRef.nativeElement.blur();
      }
    }
    IdeaBySelected(event:any){
      const _detail = this
  //console.log(event.option.value)
      this.API.Query('SELECT public.get_user_detail($1) ',[parseInt(event.option.value.value)  ]).subscribe(function(output){
      //console.log(output)
          if(output[0]){
            let _userIdeaBy = output[0]['get_user_detail'][0]
        //console.log(_userIdeaBy)
            _detail.ProjectForm.controls.idea_by =_userIdeaBy['id']
            if(_userIdeaBy['default_approver']){
              
              let _approver_1:datalist = _detail.approverlist.filter(function(a1:datalist){   return a1.value == _userIdeaBy['default_approver'] })[0]
              let _approver_2:datalist = _detail.approverlist.filter(function(a1:datalist){   return a1.value == 0 })[0]
              let _approver_3:datalist = _detail.approverlist.filter(function(a1:datalist){   return a1.value == 0 })[0]
              _detail.ControlApprove_1.setValue(_approver_1)
              _detail.ControlApprove_2.setValue(_approver_2)
              _detail.ControlApprove_3.setValue(_approver_3)
              
            } else{

            }
            if(_userIdeaBy['default_coordinator']){
              
              let _coordinator_1:datalist = _detail.coordinatorlist.filter(function(c1:datalist){   return c1.value == _userIdeaBy['default_coordinator'] })[0]
              let _coordinator_2:datalist = _detail.coordinatorlist.filter(function(c1:datalist){   return c1.value ==0 })[0]
              let _coordinator_3:datalist = _detail.coordinatorlist.filter(function(c1:datalist){   return c1.value == 0 })[0]
              _detail.ControlCoordinator_1.setValue(_coordinator_1)
              _detail.ControlCoordinator_2.setValue(_coordinator_2)
              _detail.ControlCoordinator_3.setValue(_coordinator_3) 
               
            } else{

            }
          }
        })
      

  /*      let exists = this.memberteam.filter(function(m) { return m.value == event.option.value.value } )[0]
      if(!exists){
        let _nameonly = event.option.value.display.split(']',2)[1]
        _nameonly = _nameonly.split('[',2)[0]
        let _seleted   =  {display:_nameonly,value:event.option.value.value,object:{new:true} }
        this.memberteam.push(_seleted)
      } */
      
      //this.IdeaByControl

    }

    

    GetMemberNameOnly(name:string) : string{
      let _nameonly = name.split(']',2)[1]
      _nameonly = _nameonly.split('[',2)[0]
       return _nameonly
    }

    addFile(event: MatChipInputEvent): void {
      const value = (event.value || '').trim();
    //  console.log(event)
      // Add our fruit
      if (value) {
        this.memberlistfilter=value
        this.memberteams.update(fruits => [...fruits, {display: value,value: 9999,object:{}}]);
      }
  
      // Clear the input value
      event.chipInput!.clear();
    }
  
    remove_member(event:any,member:any): void {
      // console.log(event)
   //console.log(member)
       if (member.object.new) {
        let exists = this.memberteam.indexOf(member)
        if(exists > -1){
          this.memberteam.splice(exists,1)
        }
    //console.log(exists)
       } else {
        this.memberteam_removed.push(member)
        let exists2 = this.memberteam.indexOf(member)
        if(exists2 > -1){
          this.memberteam.splice(exists2,1)
        }
        
     //   let exists = this.memberteam.filter(function(m) { return m.value == event.option.value.value } )[0]
       }
    }

    remove_file(event:any,file:any): void {
  //console.log(event)
  //console.log(file)
      if(window.confirm('คุณต้องการลบไฟล์ [' + file.clientname  + '] จริง ๆ ใข่หรือไม่' )){
        let  _id_remove =  this.filedownload.indexOf(file)
        //this.fileremove.push(this.filedownload[_id_remove])
        this.API.DeleteFile([file]).subscribe(function(deleted){
          //console.log(deleted)          
            })
        this.filedownload.splice(_id_remove,1)

      }

   }

   
    remove_new_file(event:any,file:any): void {
  //console.log(event)
  //console.log(file)
  
      if(window.confirm('คุณต้องการลบไฟล์ [' + file.clientname  + '] จริง ๆ ใข่หรือไม่' )){
        let  _id_remove =  this.filedownload.indexOf(file)

        this.filedownload.splice(_id_remove,1)
        this.API.DeleteFile([file]).subscribe(function(deleted){
          //console.log(deleted)          
            })

      }

   }
   
    remove_all_new_file(): void {
  //console.log(event)
  //console.log(file)
  const that = this
  	
  this.API.Query('select * FROM public.project_document_new 	where user_id = $1 ',[parseInt(this.UserInfo.id)  ]).subscribe(function(output){
          console.log(output)
          if(output[0]){
                    that.API.DeleteFile(output).subscribe(function(deleted){
          console.log(deleted)          
            })
          }
     

      })

   }
    
    
       first() {
        return this.ProjectForm.get('first');
      }
    
      onSubmit(): void {
      //  console.log(this.ProjectForm.value); // {first: 'Nancy', last: 'Drew'}
      }


      MapToTableProject() {
        const _ProjectForm = this.ProjectForm.value;
        let _IdeaBy:any = this.IdeaByControl.value? this.IdeaByControl.value: {value:0,display:'-',object:{}};
        let blankList:datalist = {value:0,display:'-',object:{}}

        let _approvers = [this.ControlApprove_1.value?this.ControlApprove_1.value['value']:0,this.ControlApprove_2.value?this.ControlApprove_2.value['value']:0,this.ControlApprove_3.value?this.ControlApprove_3.value['value']:0]
        let _coordinators = [this.ControlCoordinator_1.value?this.ControlCoordinator_1.value['value']:0,this.ControlCoordinator_2.value?this.ControlCoordinator_2.value['value']:0,this.ControlCoordinator_3.value?this.ControlCoordinator_3.value['value']:0]
        let _member_team = []

        if(this.memberteam){
          for (let index = 0; index < this.memberteam.length; index++) {
            _member_team.push(this.memberteam[index].value)
          }
        }
        

    //console.log(_IdeaBy.value)



       

        if(_ProjectForm ){
                    if (!_ProjectForm.ig_expected_plan){_ProjectForm.ig_expected_plan=0 } 
          if (!_ProjectForm.ig_expected_actual){_ProjectForm.ig_expected_actual=0 } 
           if (!_ProjectForm.project_group){_ProjectForm.project_group=0 } 

          let _tableProject = {
            id : _ProjectForm.id,
            running_year : _ProjectForm.running_year,
            running_no : _ProjectForm.running_no,
            title : _ProjectForm.title,
            project_group : _ProjectForm.project_group,
            suggest_date :  _ProjectForm.suggest_date,
            user_number : _ProjectForm.user_number,
            category_master_id : _ProjectForm.category_master_id,
            subcategory_master_id : _ProjectForm.subcategory_master_id,
            idea_by : _IdeaBy['value'],
            status_detail :  _ProjectForm.status_detail,
            present_situation :  _ProjectForm.present_situation,
            innovation_detail :  _ProjectForm.innovation_detail,
            expect_result :  _ProjectForm.expect_result,
            ext_partner : _ProjectForm.ext_partner,
            partner_name :  _ProjectForm.partner_name,
            calculation_text :  _ProjectForm.calculation_text,
            investment_plan : _ProjectForm.investment_plan,
            investment_actual : _ProjectForm.investment_actual,
            cost_saving_plan : _ProjectForm.cost_saving_plan,
            cost_saving_actual :_ProjectForm.cost_saving_actual,
            ig_expected_plan : _ProjectForm.ig_expected_plan,
            ig_expected_actual : _ProjectForm.ig_expected_actual,
            hardsaving : _ProjectForm.hardsaving,
            softsaving : _ProjectForm.softsaving,
            score_in_month : _ProjectForm.score_in_month,
            score_in_month_logdate : _ProjectForm.score_in_month_logdate,
            current_status : _ProjectForm.current_status,
            active : _ProjectForm.active,
            create_by :  _ProjectForm.create_by,
            update_by : _ProjectForm.update_by,
            created_at :  _ProjectForm.created_at,
            updated_at :  _ProjectForm.updated_at,
            moc_ref :  _ProjectForm.moc_ref,
            wi_ref :  _ProjectForm.wi_ref,
            other_doc :  _ProjectForm.other_doc,
            are_related_doc :  _ProjectForm.are_related_doc,
            running :  _ProjectForm.running,
            subideasname : _ProjectForm.subideasname,
            pointcategory : _ProjectForm.pointcategory,
            division :  _ProjectForm.division,
            currentstatus :  _ProjectForm.currentstatus,
            pointstatus : _ProjectForm.pointstatus,
            approvers:  _approvers,
            coordinators:_coordinators,
            member_team:_member_team,

           
          };
          return _tableProject
        } else {
          return  {}
        }
      }
    
      CheckEditField() {
        const _ProjectForm:any = this.ProjectForm.getRawValue();
        const _form = this
        let blankList:datalist = {value:0,display:'-',object:{}}
    //console.log('CheckEditField',_ProjectForm)
        let _approvers = [this.ControlApprove_1.value?this.ControlApprove_1.value['value']:0,this.ControlApprove_2.value?this.ControlApprove_2.value['value']:0,this.ControlApprove_3.value?this.ControlApprove_3.value['value']:0]
        let _coordinators = [this.ControlCoordinator_1.value?this.ControlCoordinator_1.value['value']:0,this.ControlCoordinator_2.value?this.ControlCoordinator_2.value['value']:0,this.ControlCoordinator_3.value?this.ControlCoordinator_3.value['value']:0]
        let _UserInfo = this.AppService.getVariable('UserInfomation')
        let _IdeaBy:any = this.IdeaByControl.value? this.IdeaByControl.value: {value:0,display:'-',object:{}};

     

        if(this.ProjectDetail.current_status == 5 ){
          if(_coordinators[0]==0){
            _coordinators[0] =  this.UserInfo.default_coordinator
          }
        }
        

        if(_ProjectForm ){
          if (!_ProjectForm.ig_expected_plan){_ProjectForm.ig_expected_plan=0 } 
          if (!_ProjectForm.ig_expected_actual){_ProjectForm.ig_expected_actual=0 } 
           if (!_ProjectForm.project_group){_ProjectForm.project_group=0 } 
          let _tableProject:any = {
            title : _ProjectForm.title == this.ProjectDetail.title?"":" title ='" + _ProjectForm.title?.trim() +"'",
            project_group : _ProjectForm.project_group == this.ProjectDetail.project_group?"":" project_group =" + _ProjectForm.project_group?.toString() ,
            suggest_date :  _ProjectForm.suggest_date== this.ProjectDetail.suggest_date?"":" suggest_date ='" + _ProjectForm.suggest_date?.toString() +"'",
            user_number : _ProjectForm.user_number == this.ProjectDetail.user_number?"":" user_number =" + _ProjectForm.user_number?.toString() ,
            category_master_id : _ProjectForm.category_master_id == this.ProjectDetail.category_master_id?"":" category_master_id =" + _ProjectForm.category_master_id?.toString() ,
            subcategory_master_id : _ProjectForm.subcategory_master_id == this.ProjectDetail.subcategory_master_id?"":" subcategory_master_id =" + _ProjectForm.subcategory_master_id?.toString() ,
            status_detail :  _ProjectForm.status_detail== this.ProjectDetail.status_detail?"":" status_detail ='" + _ProjectForm.status_detail?.trim() +"'",
            present_situation :  _ProjectForm.present_situation== this.ProjectDetail.present_situation?"":" present_situation ='" + _ProjectForm.present_situation?.trim() +"'",
            innovation_detail :  _ProjectForm.innovation_detail== this.ProjectDetail.innovation_detail?"":" innovation_detail ='" + _ProjectForm.innovation_detail?.trim() +"'",
            expect_result :  _ProjectForm.expect_result== this.ProjectDetail.expect_result?"":" expect_result ='" + _ProjectForm.expect_result?.trim() +"'",
            ext_partner : _ProjectForm.ext_partner == this.ProjectDetail.ext_partner?"":" ext_partner =" + _ProjectForm.ext_partner?.toString() ,
            partner_name :  _ProjectForm.partner_name == this.ProjectDetail.partner_name?"":" partner_name ='" + _ProjectForm.partner_name?.trim() +"'",
            calculation_text :  _ProjectForm.calculation_text == this.ProjectDetail.calculation_text?"":" calculation_text ='" + _ProjectForm.calculation_text?.trim() +"'",
            investment_plan : _ProjectForm.investment_plan == this.ProjectDetail.investment_plan?"":" investment_plan =" + _ProjectForm.investment_plan?.toString() ,
            investment_actual : _ProjectForm.investment_actual == this.ProjectDetail.investment_actual?"":" investment_actual =" + _ProjectForm.investment_actual?.toString(),
            cost_saving_plan : _ProjectForm.cost_saving_plan== this.ProjectDetail.cost_saving_plan?"":" cost_saving_plan =" + _ProjectForm.cost_saving_plan?.toString(),
            cost_saving_actual :_ProjectForm.cost_saving_actual == this.ProjectDetail.cost_saving_actual?"":" cost_saving_actual =" + _ProjectForm.cost_saving_actual?.toString(),
            ig_expected_plan : _ProjectForm.ig_expected_plan == this.ProjectDetail.ig_expected_plan?"":" ig_expected_plan =" + _ProjectForm.ig_expected_plan?.toString(),
            ig_expected_actual : _ProjectForm.ig_expected_actual == this.ProjectDetail.ig_expected_actual?"":" ig_expected_actual =" + _ProjectForm.ig_expected_actual?.toString(),
            hardsaving : _ProjectForm.hardsaving == this.ProjectDetail.hardsaving?"":" hardsaving =" + _ProjectForm.hardsaving?.toString(),
            softsaving : _ProjectForm.softsaving == this.ProjectDetail.softsaving?"":" softsaving =" + _ProjectForm.softsaving?.toString(),
            score_in_month : _ProjectForm.score_in_month == this.ProjectDetail.score_in_month?"":" score_in_month =" + _ProjectForm.score_in_month?.toString(),
            score_in_month_logdate : _ProjectForm.score_in_month_logdate == this.ProjectDetail.score_in_month_logdate?"":" score_in_month_logdate =" + _ProjectForm.score_in_month_logdate?.toString(),            
            update_by : " update_by = " +  _UserInfo.id.toString() ,
            updated_at :  " updated_at = now() ",
            moc_ref :  _ProjectForm.moc_ref == this.ProjectDetail.moc_ref?"":" moc_ref ='" + _ProjectForm.moc_ref?.trim() +"'",
            wi_ref :  _ProjectForm.wi_ref == this.ProjectDetail.wi_ref?"":" wi_ref ='" + _ProjectForm.wi_ref?.trim() +"'",
            other_doc :  _ProjectForm.other_doc == this.ProjectDetail.other_doc?"":" other_doc ='" + _ProjectForm.other_doc?.trim() +"'",
            are_related_doc :  _ProjectForm.are_related_doc == this.ProjectDetail.are_related_doc?"":" are_related_doc ='" + _ProjectForm.are_related_doc?.trim() +"'",           
            approvers:  _approvers.toString() == this.ProjectDetail.approvers.toString()?"":" approvers ='{" + _approvers.toString() +"}'::int[]",
            coordinators:_coordinators.toString()== this.ProjectDetail.coordinators.toString()?"":" coordinators ='{" + _coordinators.toString() +"}'::int[]",
            idea_by : _IdeaBy == this.ProjectDetail.idea_by?"":" idea_by =" + _IdeaBy['value']?.toString() ,
           
          };

      //console.log(_approvers.toString() , '!==' ,this.ProjectDetail.approvers.toString() ) 
         
          let _updateStr = ''
          let _updateJSON:any={}
          let _updateKey = Object.keys(_tableProject)
          for (let index = 0; index < _updateKey.length; index++) {
            const element = _tableProject[_updateKey[index] ];
             if(element!=''){
              if(_updateKey[index] =='approvers' ){
                _updateJSON[_updateKey[index]] =_approvers
              } else {
                    if( _updateKey[index] =='coordinators'  ){
                      _updateJSON[_updateKey[index]] =_coordinators
                    } else {
                      _updateJSON[_updateKey[index]] =_ProjectForm[_updateKey[index]]
                    }
                
              }
              
              if(_updateStr==''){
                _updateStr =  element
              } else{
                _updateStr = _updateStr +  ", " + element
              }
              
             }
             if(index == _updateKey.length - 1){

             }
          }
      //console.log(this.memberteam_removed)
          let _member_remove = this.memberteam_removed
          let _member_new = this.memberteam?.filter(function(m:any){ return m.object.new == true })
      //console.log(_member_remove,_member_new)
          if(!_member_new){_member_new=[]}
          for (let index = 0; index < _member_remove.length; index++) {
            const remove = _member_remove[index];
            let _remove_str = 'DELETE FROM public.project_members WHERE project_id = $1 AND user_id=$2;'
            _form.API.Query(_remove_str,[ _ProjectForm.id,remove.value]).subscribe(function(removed){
              }) 

          }

          for (let index = 0; index < _member_new.length; index++) {
            const insert = _member_new[index];
            let _insert_str = "INSERT INTO public.project_members(project_id, user_id, role, points, created_at)	VALUES ( $1, $2, '1', 0, now());"
            _form.API.Query(_insert_str,[ _ProjectForm.id,insert.value]).subscribe(function(inserted){
              }) 

          }
          if(this.fileremove.length > 0){
            _form.API.DeleteFile(this.fileremove).subscribe(function(deleted){
          //console.log(deleted)          
            })
          }


          _updateStr = 'UPDATE public.projects SET ' + _updateStr + ' WHERE id =' + _ProjectForm.id.toString() + ';\n'
          _updateStr = _updateStr + 'SELECT public.get_ideas_detail(' + _ProjectForm.id.toString() + ',' + _UserInfo.id.toString() + ' );'
          return {updateStr:_updateStr ,updateJSON:_updateJSON }       
        } else {
          return  {}
        }
      }

      setValue() {
        if(this.ProjectDetail){
          this.ProjectForm.setValue({
            id : this.ProjectDetail.id,
            running_year : this.ProjectDetail.running_year,
            running_no : this.ProjectDetail.running_no,
            title : this.ProjectDetail.title,
            project_group : this.ProjectDetail.project_group,
            suggest_date :  this.ProjectDetail.suggest_date,
            user_number : this.ProjectDetail.user_number,
            category_master_id : this.ProjectDetail.category_master_id,
            subcategory_master_id : this.ProjectDetail.subcategory_master_id,
            idea_by : this.ProjectDetail.idea_by,
            status_detail :  this.ProjectDetail.status_detail,
            present_situation :  this.ProjectDetail.present_situation,
            innovation_detail :  this.ProjectDetail.innovation_detail,
            expect_result :  this.ProjectDetail.expect_result,
            ext_partner : this.ProjectDetail.ext_partner,
            partner_name :  this.ProjectDetail.partner_name,
            calculation_text :  this.ProjectDetail.calculation_text,
            investment_plan : this.ProjectDetail.investment_plan,
            investment_actual : this.ProjectDetail.investment_actual,
            cost_saving_plan : this.ProjectDetail.cost_saving_plan,
            cost_saving_actual :this.ProjectDetail.cost_saving_actual,
            ig_expected_plan : this.ProjectDetail.ig_expected_plan,
            ig_expected_actual : this.ProjectDetail.ig_expected_actual,
            hardsaving : this.ProjectDetail.hardsaving,
            softsaving : this.ProjectDetail.softsaving,
            score_in_month : this.ProjectDetail.score_in_month,
            score_in_month_logdate : this.ProjectDetail.score_in_month_logdate,
            current_status : this.ProjectDetail.current_status,
            active : this.ProjectDetail.active,
            create_by :  this.ProjectDetail.create_by,
            update_by : this.ProjectDetail.update_by,
            created_at :  this.ProjectDetail.created_at,
            updated_at :  this.ProjectDetail.updated_at,
            moc_ref :  this.ProjectDetail.moc_ref,
            wi_ref :  this.ProjectDetail.wi_ref,
            other_doc :  this.ProjectDetail.other_doc,
            are_related_doc :  this.ProjectDetail.are_related_doc,
            running :  this.ProjectDetail.running,
            subideasname : this.ProjectDetail.subideasname,
            pointcategory : this.ProjectDetail.pointcategory,
            division :  this.ProjectDetail.division,
            currentstatus :  this.ProjectDetail.currentstatus,
            pointstatus : this.ProjectDetail.pointstatus,
            fullname : this.ProjectDetail.fullname
      
           
          });
         
          const _form = this
          let _approver_1:datalist = this.approverlist.filter(function(a1:datalist){   return a1.value == _form.ProjectDetail.approvers[0] })[0]
          let _approver_2:datalist = this.approverlist.filter(function(a1:datalist){   return a1.value == _form.ProjectDetail.approvers[1] })[0]
          let _approver_3:datalist = this.approverlist.filter(function(a1:datalist){   return a1.value == _form.ProjectDetail.approvers[2] })[0]
          this.ControlApprove_1.setValue(_approver_1)
          this.ControlApprove_2.setValue(_approver_2)
          this.ControlApprove_3.setValue(_approver_3)

          let _coordinator_1:datalist = this.coordinatorlist.filter(function(c1:datalist){   return c1.value == _form.ProjectDetail.coordinators[0] })[0]
          let _coordinator_2:datalist = this.coordinatorlist.filter(function(c1:datalist){   return c1.value == _form.ProjectDetail.coordinators[1] })[0]
          let _coordinator_3:datalist = this.coordinatorlist.filter(function(c1:datalist){   return c1.value == _form.ProjectDetail.coordinators[2] })[0]
          this.ControlCoordinator_1.setValue(_coordinator_1)
          this.ControlCoordinator_2.setValue(_coordinator_2)
          this.ControlCoordinator_3.setValue(_coordinator_3)  
          
          let _idea_by :datalist = this.memberlist.filter(function(ib:datalist){   return ib.value == _form.ProjectDetail.idea_by })[0]
          this.IdeaByControl.setValue(_idea_by)
          //this.project_group.setValue(this.ProjectDetail['project_group'])
          this.filedownload=[]
          if(this.ProjectDetail['documents']){
            if(this.ProjectDetail['documents'].length>0){

              for (let index = 0; index < this.ProjectDetail['documents'].length; index++) {
                const element = this.ProjectDetail['documents'][index];
                this.filedownload.push(element)
                
              }
            
          //console.log(  this.filedownload)
            } 
          }


          _form.SendEvents.emit({eventname:'IdeaNewLoadComplete' , sender:this.Name })
                //console.log('project_group:',_form.ProjectForm.controls.project_group.getRawValue(),'->',_form.ProjectForm.controls.project_group)
      //console.log('ext_partner:',_form.ProjectForm.controls.ext_partner.getRawValue(),'->',_form.ProjectForm.controls.ext_partner)
        
          
          _form.API.Query('UPDATE public.notifications  SET   readed=true  WHERE user_id = $1 and  project_id = $2 and readed = false ;',[_form.UserInfo.id,_form.ProjectDetail.id ]).subscribe(function(updated){
        //console.log('update project:',updated)
          }) 
          
          this.rdo_ext_partner="1"
          if(_form.ProjectDetail.current_status > 2  ){
            _form.setdisbale()
          } else{
            _form.setenabale()
          }
          

        }
   
      }

      ext_partner_checker(value:number){
    //console.log('ext_partner_checker:',value,'=',this.ProjectForm.controls.ext_partner.getRawValue()==value)
        return this.ProjectForm.controls.ext_partner.getRawValue()==value
      }

      setValueNew() {
        if(this.ProjectDetail){
          this.ProjectForm.setValue({
            id : this.ProjectDetail.id,
            running_year : this.ProjectDetail.running_year,
            running_no : this.ProjectDetail.running_no,
            title : this.ProjectDetail.title,
            project_group : this.ProjectDetail.project_group,
            suggest_date :  this.ProjectDetail.suggest_date,
            user_number : this.ProjectDetail.user_number,
            category_master_id : this.ProjectDetail.category_master_id,
            subcategory_master_id : this.ProjectDetail.subcategory_master_id,
            idea_by : this.ProjectDetail.idea_by,
            status_detail :  this.ProjectDetail.status_detail,
            present_situation :  this.ProjectDetail.present_situation,
            innovation_detail :  this.ProjectDetail.innovation_detail,
            expect_result :  this.ProjectDetail.expect_result,
            ext_partner : this.ProjectDetail.ext_partner,
            partner_name :  this.ProjectDetail.partner_name,
            calculation_text :  this.ProjectDetail.calculation_text,
            investment_plan : this.ProjectDetail.investment_plan,
            investment_actual : this.ProjectDetail.investment_actual,
            cost_saving_plan : this.ProjectDetail.cost_saving_plan,
            cost_saving_actual :this.ProjectDetail.cost_saving_actual,
            ig_expected_plan : this.ProjectDetail.ig_expected_plan,
            ig_expected_actual : this.ProjectDetail.ig_expected_actual,
            hardsaving : this.ProjectDetail.hardsaving,
            softsaving : this.ProjectDetail.softsaving,
            score_in_month : this.ProjectDetail.score_in_month,
            score_in_month_logdate : this.ProjectDetail.score_in_month_logdate,
            current_status : this.ProjectDetail.current_status,
            active : this.ProjectDetail.active,
            create_by :  this.ProjectDetail.create_by,
            update_by : this.ProjectDetail.update_by,
            created_at :  this.ProjectDetail.created_at,
            updated_at :  this.ProjectDetail.updated_at,
            moc_ref :  this.ProjectDetail.moc_ref,
            wi_ref :  this.ProjectDetail.wi_ref,
            other_doc :  this.ProjectDetail.other_doc,
            are_related_doc :  this.ProjectDetail.are_related_doc,
            running :  this.ProjectDetail.running,
            subideasname : this.ProjectDetail.subideasname,
            pointcategory : this.ProjectDetail.pointcategory,
            division :  this.ProjectDetail.division,
            currentstatus :  this.ProjectDetail.currentstatus,
            pointstatus : this.ProjectDetail.pointstatus,
            fullname : this.ProjectDetail.fullname
      
          });
          const _form = this
          let _approver_1:datalist = this.approverlist.filter(function(a1:datalist){   return a1.value == _form.ProjectDetail.approvers[0] })[0]
          let _approver_2:datalist = this.approverlist.filter(function(a1:datalist){   return a1.value == _form.ProjectDetail.approvers[1] })[0]
          let _approver_3:datalist = this.approverlist.filter(function(a1:datalist){   return a1.value == _form.ProjectDetail.approvers[2] })[0]
          this.ControlApprove_1.setValue(_approver_1)
          this.ControlApprove_2.setValue(_approver_2)
          this.ControlApprove_3.setValue(_approver_3)

          let _coordinator_1:datalist = this.coordinatorlist.filter(function(c1:datalist){   return c1.value == _form.ProjectDetail.coordinators[0] })[0]
          let _coordinator_2:datalist = this.coordinatorlist.filter(function(c1:datalist){   return c1.value == _form.ProjectDetail.coordinators[1] })[0]
          let _coordinator_3:datalist = this.coordinatorlist.filter(function(c1:datalist){   return c1.value == _form.ProjectDetail.coordinators[2] })[0]
          this.ControlCoordinator_1.setValue(_coordinator_1)
          this.ControlCoordinator_2.setValue(_coordinator_2)
          this.ControlCoordinator_3.setValue(_coordinator_3)

          this.IdeaByControl.setValue(_form.ProjectDetail.idea_by)
          
         }
   
      }

      setdisbale(){
        console.log(' _form.ProjectDetail.current_status=', this.ProjectDetail.current_status )
        console.log(' UserInfo.isadmin==1=', this.UserInfo )
       
        const _form = this
        //this.current_status =  this.ProjectDetail?this.ProjectDetail.current_status:this.ProjectDetail
        _form.ProjectDetail.current_status
        this.ProjectForm.disable()

         this.ControlApprove_1.disable()
        this.ControlApprove_2.disable()
        this.ControlApprove_3.disable()

        this.ControlCoordinator_1.disable()
        this.ControlCoordinator_2.disable()
        this.ControlCoordinator_3.disable()
         
        let _statedetail = this.ProjectDetail.statedetail.filter(function(a:any){ return a.iscurrent ==1 })
        if(_statedetail[0]){
           if(_statedetail[0].state_types_id==2){
            this.ControlApprove_2.enable()
             this.ControlApprove_3.enable()
             
          }
        if(_statedetail[0].state_types_id==3){
            this.ControlApprove_3.enable()
          }
        }
       
       
        if(_statedetail[0] && this.ProjectDetail.current_status !=10){
           if(_statedetail[0].state_types_id==5){
            this.ControlCoordinator_2.enable()
             this.ControlCoordinator_3.enable()
          }
        if(_statedetail[0].state_types_id==6){
            this.ControlCoordinator_3.enable()
          }
        }

        this.IdeaByControl.disable()
       
      }

      setenabale(){
        const _control = this;

        this.ProjectForm.enable()       

        if (this.ProjectDetail.current_status < 4){
          this.IdeaByControl.enable()
        }
        if(!this.isImplementState(5)){
          this.ProjectForm.controls.moc_ref.disable()
          this.ProjectForm.controls.wi_ref.disable()
          this.ProjectForm.controls.other_doc.disable()
        }
        
if( this.ProjectDetail.current_status !=10){
        this.ControlApprove_1.enable()
        this.ControlApprove_2.enable()
        this.ControlApprove_3.enable()

        this.ControlCoordinator_1.enable()
        this.ControlCoordinator_2.enable()
        this.ControlCoordinator_3.enable()

}
        if(this.ProjectDetail){
          if(this.ProjectDetail.approvers_detail){
            for (let index = 0; index < this.ProjectDetail.approvers_detail.length; index++) {
              const element = this.ProjectDetail.approvers_detail[index];
              if(element.islock){
                if(_control.ControlApprove_1.getRawValue()?.value == element.value){
                  _control.ControlApprove_1.disable()
                }
                if(_control.ControlApprove_2.getRawValue()?.value == element.value){
                  _control.ControlApprove_2.disable()
                }
                if(_control.ControlApprove_3.getRawValue()?.value == element.value){
                  _control.ControlApprove_3.disable()
                }
              }
            }
          }
        }
       

 

        this.ProjectForm.controls.ig_expected_actual.disable()  
        this.ProjectForm.controls.ig_expected_plan.disable()  
       
          
      }

      onSelect(event:any) {

        if(this.ProjectDetail.id == -1){
               this.files.push(...event.addedFiles);
        //console.log( this.files)
          this.uploadNew()
        } else {
        //console.log(event);
                this.files.push(...event.addedFiles);
        //console.log( this.files)
          this.upload()
        }
    


      }

  /*     addFiles(event:any) {
    //console.log(event);
        let _newfile:File =   { name: event.image_name, size: 12345,  type: "image/*" };
{}
        this.files.push(_newfile);
      } */
      
        upload(){
          const _form = this
      //console.log(this.files)
        /*   this.API.UploadFile(this.files).subscribe(function(uploaded){
        //console.log(uploaded)
          }) */
           //let testData:FormData = new FormData();
           let testData:any[] =[];
           let attechfolder = this.API.getAttechFolder()
          for (let index = 0; index < _form.files.length; index++) {

            const element = _form.files[index];
            let _isExist = _form.filedownload.filter(function(fu:any){ return  fu.clientname == element.name })
            if(!_isExist[0]){
            //let _basefile = _form.handleUpload(element)
            _form.handleUpload(element).then(function(fileok){
              testData.push({file: fileok ,subfolder:attechfolder, filename:element.name,size:element.size,lastModified:element.lastModified,type:element.type,project_id: _form.ProjectDetail.id } )  
              if(index ==_form.files.length-1){

                _form.API.UploadFile(testData).subscribe(function(uploaded){
              //console.log(uploaded)
                  _form.SendEvents.emit({eventname:'UploadFileComplete' , sender:_form.Name })
                  _form.files=[]
                })
              }
            })
                       
      } else {
              _form.snackBar.openSnackBar(  element.name + ' is exist.', 'OK', 'center', 'top', 'snack-style')
            }
          
          }  
         


        }
         uploadNew(){
          const _form = this
      //console.log(this.files)
        /*   this.API.UploadFile(this.files).subscribe(function(uploaded){
        //console.log(uploaded)
          }) */
           //let testData:FormData = new FormData();
           let testData:any[] =[];
           let attechfolder = this.API.getAttechFolder()
           attechfolder = attechfolder + "new/" + _form.UserInfo.id + "/"

          for (let index = 0; index < _form.files.length; index++) {

            const element = _form.files[index];
            let _isExist = _form.filedownload.filter(function(fu:any){ return  fu.clientname == element.name })
            if(!_isExist[0]){
 //let _basefile = _form.handleUpload(element)
            _form.handleUpload(element).then(function(fileok){
              testData.push({file: fileok ,subfolder:attechfolder, filename:element.name,size:element.size,lastModified:element.lastModified,type:element.type,project_id:0,userid:_form.UserInfo.id  } )  
              if(index ==_form.files.length-1){

                _form.API.UploadFile(testData).subscribe(function(uploaded){
                  if(uploaded){
                    console.log('uploaded:',uploaded)
                    //console.log(uploaded)
                        _form.filedownload=[]
                         _form.get_idea_document_new()
          /* if(_form.ProjectDetail['documents']){
            if(_form.ProjectDetail['documents'].length>0){

              for (let index = 0; index < _form.ProjectDetail['documents'].length; index++) {
                const element = _form.ProjectDetail['documents'][index];
                _form.filedownload.push(element)
                
              }
            
          //console.log(  this.filedownload)
            } 
          } */
                  _form.SendEvents.emit({eventname:'UploadNewFileComplete' , sender:_form.Name })
                  _form.files=[]
                  }else{
                     _form.snackBar.openSnackBar(  element.name + ' not uploaded.', 'OK', 'center', 'top', 'snack-style')
                  }
              
                })
              }
            })
            
            } else {
              _form.snackBar.openSnackBar(  element.name + ' is exist.', 'OK', 'center', 'top', 'snack-style')
            }
                      

          
          }  
         


        }

        get_idea_document_new(){
          const _form = this
          console.log('UserInfo:',this.UserInfo)
          this.API.Query('SELECT public.get_idea_document_new($1) ',[parseInt(this.UserInfo.id)  ]).subscribe(function(output){
          console.log(output)
          if(output[0]){
            let _list_temp_document = output[0]['get_idea_document_new']
            _form.filedownload = [].concat(_list_temp_document) 
          }
        })

        }

        handleUpload(file:any) {
          const reader = new FileReader();
          return   new Promise((resolve, reject) => {
            reader.readAsDataURL(file);
            reader.onload = () => {
          //console.log(reader.result);
              resolve(reader.result ) 
            };
          })
           
      }
      Approverkeyup(event:any,level:number){
        switch (level) {
          case 1:
        if(this.approverlistone.value !=0){
            this.ControlApprove_1.setValue(this.approverlistone)
             this.CheckDuplicationApprover(this.approverlistone.value,level)
           }
            break;
          case 2:
          if(this.approverlistone.value !=0){
            this.ControlApprove_2.setValue(this.approverlistone)
             this.CheckDuplicationApprover(this.approverlistone.value,level)
           }
            break;
          case 3:
            
           console.log(this.approverlistone)
           if(this.approverlistone.value !=0){
            this.ControlApprove_3.setValue(this.approverlistone)
             this.CheckDuplicationApprover(this.approverlistone.value,level)
           }
             
            
             // console.log(this._filterApprove.)
            
            break;
        
          default:
            break;
        }
       

        this.approverlistone={
  value:0,
  display: '',
  object: {}
}
    
         
      }
      
       Coordinaterkeyup(event:any,level:number){
        switch (level) {
          case 1:
        if(this.approverlistone.value !=0){
            this.ControlCoordinator_1.setValue(this.approverlistone)
            this.CheckDuplicationApprover(this.approverlistone.value,level +3)
           }
            break;
          case 2:
          if(this.approverlistone.value !=0){
            this.ControlCoordinator_2.setValue(this.approverlistone)
            this.CheckDuplicationApprover(this.approverlistone.value,level +3)
           }
            break;
          case 3:
            
           console.log(this.approverlistone)
           if(this.approverlistone.value !=0){
            this.ControlCoordinator_3.setValue(this.approverlistone)
            this.CheckDuplicationApprover(this.approverlistone.value,level +3)
           }
             
            
             // console.log(this._filterApprove.)
            
            break;
        
          default:
            break;
        }
      
        this.approverlistone={
  value:0,
  display: '',
  object: {}
}
         
      }
      onRemove(event:any) {
    //console.log(event);
        this.files.splice(this.files.indexOf(event), 1);
      }

  /*     setProjectGroup(selected:number){
        this.ProjectForm.get('project_group')?.setValue(selected);
        this.ProjectDetail.project_group = selected;
      }

      setExtPartner(selected:number){
        this.ProjectForm.get('ext_partner')?.setValue(selected);
        
        this.ProjectDetail.ext_partner = selected;
      } */

      edit(fruit: datalist, event: any) {
        const value = event.value.trim();
    
        // Remove fruit if it no longer has a name
        if (!value) {
          //this.remove(fruit);
          return;
        }
    
        // Edit existing fruit
        const index = this.memberteam.indexOf(fruit);
        if (index >= 0) {
          this.memberteam[index].display = value;
        }
      }
      getDocRef(typedoc:string){

        if(this.ProjectDetail.statedetail){
          let _current_state =   this.ProjectDetail.statedetail.filter(function(cs:any){ return cs.iscurrent ==1 })[0]
//console.log('_current_state:',_current_state)
          switch (typedoc) {
            case 'MOC':
                  return _current_state.moc_doc == 1
              break;
            case 'WI':
                return _current_state.work_doc == 1
            break;
            case 'OTHER':
                return _current_state.other_doc == 1
            break;
            case 'OTHERNAME':
                return _current_state.other_doc_name?_current_state.other_doc_name :''
            break;
          
            default:
              break;
          }
        } else{
          return null
        }

      }
     /*  getUserLevel(tag:string):boolean{    
        // console.log(tag,'==',this.UserLevel)
         if(this.UserLevel) {
         //  console.log(tag,'==',this.UserLevel.indexOf(tag,1))
           return (this.UserLevel.indexOf(tag)>-1);
         } 
         else {
           return false;
         }  
        
       } */

         isCoordinaterState(value:any){
          if(this.ProjectDetail.current_status == 13  || this.ProjectDetail.current_status == 10  ){
            return true
          } else {
            return false
          }
         }
         isImplementState(value:any){
          if(this.ProjectDetail.current_status == 5 || this.ProjectDetail.current_status == 13   ){
            return true
          } else {
            return false
          }
         }
         changeproject_group(ev:any){
      //console.log(ev)
          this.ProjectForm.controls.project_group.setValue(ev.value)
         }

         changeext_partner(ev:any){
      //console.log(ev)
          this.ProjectForm.controls.ext_partner.setValue(ev.value)
         }

        UpdateApprover(){
          const _table = this;
          let _approvers = [this.ControlApprove_1.value?this.ControlApprove_1.value['value']:0,this.ControlApprove_2.value?this.ControlApprove_2.value['value']:0,this.ControlApprove_3.value?this.ControlApprove_3.value['value']:0]
        //  console.log('[' ,this.ControlApprove_1?.value,',',this.ControlApprove_2?.value,',',this.ControlApprove_3?.value,',' ,']')
      //console.log(_approvers.toString())
          if(_approvers.toString() != this.ProjectDetail.approvers.toString()) {
            let _updateStr = "UPDATE public.projects SET approvers ='{" + _approvers.toString() +"}'::int[]  WHERE id =" + this.ProjectDetail.id.toString() ;
            this.ProjectDetail.approvers =_approvers ;
             _table.API.Query(_updateStr,[]).subscribe(function(output){
                   //console.log(output)            
                       _table.SendEvents.emit({eventname:'EditApprover' , sender:_table.Name })           
                      });
          }
        } 

        OpenMailDetail(maildate:any){
          this.SendEvents.emit({eventname:'OpenMailDetail' , sender:this.Name,maildata:maildate })   

        }
        getColorMail(state:any){
         // console.log(state)
          switch (state?.status) {
            case 0:
                return 'accent'
              break;
            case 1:
                return 'primary'
              break;
            case 2:
                return 'warn'
              break;

            default:
                return 'warn'
              break;
          }
          
        }
         
}