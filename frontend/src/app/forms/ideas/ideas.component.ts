import {Component, OnInit} from '@angular/core';
import {Observable, Subject} from "rxjs";
import {map} from "rxjs/operators";
import {VariablesService} from '../../variables.service'
import { ApiService } from '../../api.service';
import { UserService } from '../../user/user.service';
import { FormControl, FormGroup } from '@angular/forms';
import { datalist, SendemailDialogComponent } from "../dialogs/sendemail-dialog.component";
import { MatDialog } from '@angular/material/dialog';
import { _getEventTarget } from '@angular/cdk/platform';
import { DatePipe, UpperCasePipe } from "@angular/common";
import { SnackBarService } from '../../snack-bar/snack-bar.service';
import { ConfirmStatusDialogComponent, ConfirmStatusDialogData } from '../dialogs/confirm-status-dialog.component';
@Component({
    selector: 'cus-ideas',
    templateUrl: './ideas.component.html',
    styleUrls: ['./ideas.component.scss']
})
export class IdeasComponent implements OnInit {

        selectedIndex:number = 0
        ProjectDetail:any = {}
        ProjectDetailNew:any = {}
        stepBar:any =[]
        stepBarNew:any =[]
        CurrentIdDeatil:number =0
        Me:Subject<any> = new Subject();
        UserInfo:any = {}
        controlsinited:number = 0
        memberlist:any
        ActiveView:string = 'Idea List'
        BaseHref:string=''
        CommandButtonDisable=false
        tigger_command:boolean =true;
    constructor(
        private AppService:VariablesService , 
        private api:ApiService,
        private user:UserService  ,
        private dialog: MatDialog ,
        private dialogConfirm: MatDialog ,
        private dateformat:DatePipe, 
        private snackBar:SnackBarService) {
        
    }

    ngAfterViewInit(): void {
        //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
        //Add 'implements AfterViewInit' to the class.
      //  console.log('ngAfterViewInit')
      
      }

    ngOnInit() {
      const  _table = this      
    //  console.log('ngOnInit')
  //    _table.selectedIndex = 0

      let _id_from_myhome =  this.AppService.getVariable('MyIdeasSelectID')
      this.UserInfo = this.AppService.getVariable('UserHome')
      this.memberlist = this.AppService.getVariable('datalistsources')['all_member_list']
       this.BaseHref = this.api.getBaseHref();
       this.AppService.setVariable('EnableCommandButton',false) 
 
     
   //  console.log('_id_from_myhome:',_id_from_myhome)
 /*      if(_id_from_myhome){
        if(_id_from_myhome.toString()!==''){
                if(_id_from_myhome.toString()=='OpenNew'){
                        
                        _table.SetNewDetail()
                        _table.AppService.setVariable('MyIdeasSelectID','')
                        _table.selectedIndex = 2
                } else {
                        _table.selectedIndex = 0
                        _table.OpenDetail(_id_from_myhome)
                        _table.AppService.setVariable('MyIdeasSelectID','')
                }
                

        } 
      } */
      
       
        this.AppService.AppVars.subscribe(function(v:any){
  //console.log(v)
if(v['target']){
if(  v['target'].toLowerCase() =='ideas'){
               // console.log(v)
                switch (v.eventname) {
                        
                         case 'VariablesChanging':
                            //console.log(v)
                                       
                                        _table.CommandButtonDisable = !_table.AppService.getVariable('EnableCommandButton') 
                
                        break; 

                        case 'SelectIdeaDetail':
                            //console.log(v)
                                       
                                        _table.CurrentIdDeatil=v.id
                                        _table.OpenDetail(v.id,false)
                                        _table.selectedIndex = 1
                                
                                                
                
                        break; 
                        case 'DirectToIdeaDetail':
                            //console.log(v)
                                       
                            console.log(v)
                                     _table.api.Query('SELECT public.get_project_id_by_ideanumber($1) ',[v.id ]).subscribe(function(output){
                                        console.log(output)
                                                if(output[0]){  
                                                let _project_id:any = output[0]['get_project_id_by_ideanumber']
                                                _table.CurrentIdDeatil=_project_id
                                                _table.OpenDetail(_project_id,false)
                                                _table.selectedIndex = 1
                                                }
                                
                                     } )             
                
                        break; 

                        case 'OpenNewIdeas':
                                
                                _table.SetNewDetail();                        
                                _table.selectedIndex = 2        
        
                break;  
                
                case 'ExportExcel':
                        v['activeView'] =   _table.selectedIndex          
                        setTimeout(() => {
                                _table.Me.next(v)  
                        }, 500);     

                break;             
 
                        default:
                        break;
                             
                }
               }
}
               

        })
       
    }

    getHasCommandButton(){
        if( this.ProjectDetail.userlevel){
                 if( this.ProjectDetail.userlevel.trim()==='' || this.ProjectDetail.userlevel.trim()==='READONLY' ){
                        return false        
                        }       
        } else {
                return false
        }
        return true;

    }
    OpenDetail(id:number,enabled:boolean){
        const _table = this
        let _curProjectId =  id
                                
                
        setTimeout(() => {
              
        if(_curProjectId){
                _table.api.Query('SELECT public.get_ideas_detail($1,$2) ',[_curProjectId ,_table.UserInfo.id]).subscribe(function(output){
                   //console.log(output)
                        if(output[0]){
                        let _my_ideas:any = output[0]['get_ideas_detail'][0]
        
                        _table.ProjectDetail = _my_ideas   
                        
                        _table.stepBar = []
                        _table.stepBar.push(_table.ProjectDetail ['step_open'])
                        _table.stepBar.push(_table.ProjectDetail ['step_approve'])
                        _table.stepBar.push(_table.ProjectDetail ['step_implement'])
                        _table.stepBar.push(_table.ProjectDetail ['step_apply'])
                        _table.Me.next({eventname:'IdeaTabChange',target:'ProjectDetail', ProjectDetail:_table.ProjectDetail,enabled:enabled}) 
                        _table.Me.next({eventname:'IdeaTabChange',target:'stepBar' ,stepBar:_table.stepBar}) 
                        //_table.AppService.AppVars.next({eventname:'loaddatacomplete',dataset:'ProjectDetail' , value:_table.ProjectDetail})
                        
                        } else{
                        /* _table.snackBar.openSnackBar( 'not found user data!!',
                        'OK', 'center', 'top', 'snack-style'); */
                        }
                        
                })
        }
        /*  if (!_table.ProjectDetail.userlevel || _table.ProjectDetail.userlevel.trim()===''){
              _table.CommandButtonDisable=true
        } else {
                _table.CommandButtonDisable=false
        } */ 
        
        }, 200);
             
    }

    RefreshDetail(id:number){
        const _table = this
        let _curProjectId =  id
                                
                
        setTimeout(() => {
              
        if(_curProjectId){
                _table.api.Query('SELECT public.get_ideas_detail($1,$2) ',[_curProjectId ,_table.UserInfo.id]).subscribe(function(output){
                   //console.log(output)
                        if(output[0]){
                        let _my_ideas:any = output[0]['get_ideas_detail'][0]
        
                        _table.ProjectDetail = _my_ideas   
                        
                        _table.stepBar = []
                        _table.stepBar.push(_table.ProjectDetail ['step_open'])
                        _table.stepBar.push(_table.ProjectDetail ['step_approve'])
                        _table.stepBar.push(_table.ProjectDetail ['step_implement'])
                        _table.stepBar.push(_table.ProjectDetail ['step_apply'])
                        _table.Me.next({eventname:'RefreshDetail',target:'ProjectDetail', ProjectDetail:_table.ProjectDetail}) 
                        _table.Me.next({eventname:'RefreshDetail',target:'stepBar' ,stepBar:_table.stepBar}) 
                        //_table.AppService.AppVars.next({eventname:'loaddatacomplete',dataset:'ProjectDetail' , value:_table.ProjectDetail})
                        
                        } else{
                        /* _table.snackBar.openSnackBar( 'not found user data!!',
                        'OK', 'center', 'top', 'snack-style'); */
                        }
                        
                })
        }
        
        }, 200);
             
    }

    SetNewDetail(){
        const _table = this
        let _curProjectId =  -1
                
       
        //console.log(this.UserInfo)
        
        setTimeout(() => {
                
        if(this.UserInfo.id){
                _table.api.Query('SELECT public.get_ideas_new($1) ',[this.UserInfo.id ]).subscribe(function(output){
                     //  console.log('get_ideas_new:',output)
                        if(output[0]){
                        let _my_ideas:any = output[0]['get_ideas_new'][0]
        
                        _table.ProjectDetailNew = _my_ideas   

                        _table.Me.next({eventname:'loadNewIdea', target:'ProjectDetailNew',dataset:'NewProjectDetail' , value:_table.ProjectDetailNew})

                        } else{
                        /* _table.snackBar.openSnackBar( 'not found user data!!',
                        'OK', 'center', 'top', 'snack-style'); */
                        }
                        
                })
        }
        
        }, 200);
             
    }

    selectedIndexChange(event:any){
        const _table = this
        if (this.selectedIndex==2){
               
                if(!_table.ProjectDetailNew['currentstatus']){
                        _table.SetNewDetail();
                }
        }
    }


    ChildEvent(event:any){
        //console.log(event)
        const _table = this
        let premail:  any  = {};
        let _dear:string = '';

        if(event.sender == 'IdeasCommandButtonNew'){
                _table.CommandButtonDisable=true
        }
        switch (event.eventname) {
                case 'InitComplete':

                _table.controlsinited = _table.controlsinited+1
            //console.log('_table.controlsinited:',_table.controlsinited)
                if(_table.controlsinited>4){
                       // if(!_table.ProjectDetailNew['step_open']){
        
                                         
                        //}
                }

       
                        
                        break;

                        
                        case 'UploadFileComplete':
                            //console.log(event)
                                _table.CurrentIdDeatil =_table.ProjectDetail.id
                                _table.Me.next({eventname:'BG_SaveDraft',target:'ProjectDetail', ProjectDetail:_table.ProjectDetail }) 
                                _table.OpenDetail(_table.ProjectDetail.id,true)
                              
                                break;
                        case 'UploadNewFileComplete':
                            //console.log(event)
                                //_table.CurrentIdDeatil =_table.ProjectDetail.id
                                //_table.OpenDetail(_table.ProjectDetail.id,true)
                              
                                break;
                        case 'EditApprover':
                            //console.log(event)
                                _table.CurrentIdDeatil =_table.ProjectDetail.id
                                _table.Me.next({eventname:'BG_SaveDraft',target:'ProjectDetail', ProjectDetail:_table.ProjectDetail }) 
                                _table.OpenDetail(_table.ProjectDetail.id,false)
                        
                        break;

                        case 'OpenMailDetail':
                            //console.log(event)
                             //console.log(_table.ProjectDetail.statedetail)
                                _table.CurrentIdDeatil =_table.ProjectDetail.id
                                
                                  let _cur_state :any
                                let _cur_state_row :any
                                
                                _cur_state_row =  _table.ProjectDetail.statedetail.filter(function(s:any){ return s.id_state == event.maildata.project_states_id })[0]
                                 if(_cur_state_row['states_mail']){
                
                                premail['from'] =  _table.api.getSystemMailSender()
                                premail['to'] = _cur_state_row.states_mail[0]['send_to_text']
                                premail['cc'] = _cur_state_row.states_mail[0]['send_to_text']
                                premail['Subject'] =   _cur_state_row.states_mail[0]['detail']
                                premail['from_email'] =  _table.api.getSystemMailSender()
                                premail['to_email'] = _cur_state_row.states_mail[0]['send_to']
                                premail['cc_email'] = _cur_state_row.states_mail[0]['send_cc']
                                premail['body'] = _cur_state_row.states_mail[0]['body']
                                premail['state_id'] = _cur_state_row.id_state
                                        premail['status_id'] = _cur_state_row.id_status
                                premail['ideanumber'] =_table.ProjectDetail.running
                                premail['send_next'] = _cur_state_row.states_mail[0]['send_next']
                                premail['send_at'] = _cur_state_row.states_mail[0]['send_at']
                                 premail['repeat_time'] = _cur_state_row.states_mail[0]['repeat_time']
                                _table.openDialog(premail)

                                 } else {
                                        alert('Not found mail data!')
                                 }
                        
                        break;
                        

                        case 'SelectIdeaDetail':
                            //console.log(event)
                                _table.CurrentIdDeatil =event.id
                                _table.OpenDetail(event.id,false)
                                setTimeout(() => {
                                        _table.stepBar = []
                                        _table.stepBar.push(_table.ProjectDetail['step_open'])
                                        _table.stepBar.push(_table.ProjectDetail['step_approve'])
                                        _table.stepBar.push(_table.ProjectDetail['step_implement'])
                                        _table.stepBar.push(_table.ProjectDetail['step_apply'])
                
                                        _table.Me.next({eventname:'IdeaTabChange',target:'ProjectDetail', ProjectDetail:_table.ProjectDetail}) 
                                        _table.Me.next({eventname:'IdeaTabChange',target:'stepBar' ,stepBar:_table.stepBar}) 
                                       }, 1000);
                                       
                                      
                                       setTimeout(() => {
                                        _table.selectedIndex = 1
                                       }, 1000);
                                break;
                                case 'FirstIdeaDetail':
                            //console.log(event)
                                 
                                        if(! _table.CurrentIdDeatil){
                                                _table.CurrentIdDeatil =event.id
                                                _table.OpenDetail(event.id,false)
                                                setTimeout(() => {
                                                        _table.stepBar = []
                                                        _table.stepBar.push(_table.ProjectDetail['step_open'])
                                                        _table.stepBar.push(_table.ProjectDetail['step_approve'])
                                                        _table.stepBar.push(_table.ProjectDetail['step_implement'])
                                                        _table.stepBar.push(_table.ProjectDetail['step_apply'])
                                
                                                        _table.Me.next({eventname:'IdeaTabChange',target:'ProjectDetail', ProjectDetail:_table.ProjectDetail}) 
                                                        _table.Me.next({eventname:'IdeaTabChange',target:'stepBar' ,stepBar:_table.stepBar}) 
                                                       }, 1000);
                                        }
                                
                                       
                                       _table.selectedIndex = 1  
                   
                                break;
                                case 'IdeaNewLoadComplete':
                            //console.log('IdeaNewLoadComplete:',event)
                                  
                                                setTimeout(() => {
                                                        _table.stepBarNew = []
                                                        _table.stepBarNew.push(_table.ProjectDetailNew['step_open'])
                                                        _table.stepBarNew.push(_table.ProjectDetailNew['step_approve'])
                                                        _table.stepBarNew.push(_table.ProjectDetailNew['step_implement'])
                                                        _table.stepBarNew.push(_table.ProjectDetailNew['step_apply'])
                                
                                                       // _table.Me.next({eventname:'IdeaTabChange',target:'ProjectDetailNew', ProjectDetail:_table.ProjectDetailNew }) 
                                                        _table.Me.next({eventname:'IdeaTabChange',target:'stepBarNew' ,stepBar:_table.stepBarNew}) 
                                                        _table.Me.next({eventname:'IdeaNewLoadComplete',target:'IdeasCommandButton' ,userlevel:_table.ProjectDetail.userlevel}) 
                                                       }, 1000);
                                       
                                                       
                                       
                                       //_table.selectedIndex = 1  
                   
                                break;

                case 'SaveDraft':
                    //console.log(event)
                     setTimeout(() => {
                        
                        if(event.sender == 'IdeasCommandButtonNew'){
                                _table.Me.next({eventname:'BeginSaveDraft',target:'ProjectDetailNew', ProjectDetail:_table.ProjectDetailNew }) 
                        } else{
                                _table.Me.next({eventname:'SaveDraft',target:'ProjectDetail', ProjectDetail:_table.ProjectDetail }) 
                        }

                        
                     }, 500);
                        
                        break;
                case 'InsertProjectSuccess':
                    //console.log(event)
                        _table.AppService.AppVars.next({eventname:'RefreshApp'})
                        
                        break;
                case 'UpdateProjectSuccess':
                    //console.log(event)
                        _table.AppService.AppVars.next({eventname:'RefreshApp'})
                        
                        break;
                case 'Save Defend':
                    //console.log(event)
                       // _table.ProjectDetail = event.updated[0]
                        //_table.AppService.AppVars.next({eventname:'RefreshApp'})
                        
                        break;
                case 'UpdatedByCoordinator':
                    //console.log(event)
                      //  _table.ProjectDetail = event.updated[0]
                     
                        
                        break;
                
                case 'CreateProjectToSendMail':
                        
                
                
                _table.api.Query('SELECT public.get_ideas_detail($1,$2) ',[event.inserted.id ,_table.UserInfo.id]).subscribe(function(output){
                    //console.log(output)
                         if(output[0]){
                         let _my_ideas:any = output[0]['get_ideas_detail'][0]
         
                         _table.ProjectDetail = _my_ideas   
                         let _idea_by :datalist = _table.memberlist.filter(function(ib:datalist){   return ib.value == _table.ProjectDetail.idea_by })[0] 

                         
                     //console.log('event.inserted:',event.inserted)
                      //   _table.SendMailIdeaOwnBackground(_idea_by,'C')
                       setTimeout(() => {
                                // _form.SendEvents.emit({eventname:'InsertProjectSuccess',id:1})
                                window.document.location.reload()
                               }, 500); 

                               

                         }
                })

                

                        break;    
                        
                        
              case 'Delete':
                        
                _table.api.CallProcedure('public.update_project_to_delete',{project_id:_table.ProjectDetail.id, user_id:_table.UserInfo.id }).subscribe(function(updated){
                    //console.log('update_project_not_approve:',updated)
                        let _message:string =''
                        if(!updated['status']){
                        _message = ' Idea No. '+ _table.ProjectDetail.running + ' was rejected.' 
                        _table.api.CallProcedure('public.insert_notifications',{project_id:_table.ProjectDetail.id, user_id:_table.UserInfo.id,textmessage:_message }).subscribe(function(output){
                            //console.log('insert_notifications:',output)                                                          
                                })
                                
                                
                                        _message = ' Idea No. ' + _table.ProjectDetail.running + ' was rejected.' 
                                        _table.api.CallProcedure('public.insert_notifications',{project_id:_table.ProjectDetail.id, user_id:_table.ProjectDetail.idea_by,textmessage:_message }).subscribe(function(output){
                                            //console.log('insert_notifications:',output)                                                          
                                                })    
                                        let _idea_by :datalist = _table.memberlist.filter(function(ib:datalist){   return ib.value == _table.ProjectDetail.idea_by })[0] 
                                        _table.SendMailIdeaOwnBackground(updated['id_state'],'B')
                                        if(updated['id_state_next']){_table.SendMailBackground(updated['id_state_next'])} 

                                setTimeout(() => {
                                window.document.location.reload()        
                        }, 500);    
                        } else {
                                if(updated['status']=='error'){
                                        _message = 'Not delte IdeaNo. '+ _table.ProjectDetail.running + ' :' + updated['error'].toString()
                                        _table.api.CallProcedure('public.insert_notifications',{project_id:_table.ProjectDetail.id, user_id:_table.UserInfo.id,textmessage:_message }).subscribe(function(output){
                                            //console.log('insert_notifications:',output)                                                          
                                                })
                                }
                                else{

                                }
                        }

                        


                
        })  
                

                        break;    
                        
                               

                case 'UpdateProjectToSendMail':
                    //console.log(event)
                        
                               /*  if(event['updated']){
                                _table.ProjectDetail = event['updated']
                                } */
                               let id_state = 0;
 
                                 _table.api.Query('SELECT public.get_ideas_detail($1,$2) ',[event['updated'].id ,_table.UserInfo.id]).subscribe(function(output){
                                    //console.log(output)
                                         if(output[0]){
                                         let _my_ideas:any = output[0]['get_ideas_detail'][0]
                         
                                         _table.ProjectDetail = _my_ideas     
                                         let _cur_state :any
                                         let _cur_state_row :any
                                        
                                         let _cureent_state :any
                                         let _approver_level = 0
                                         _cur_state_row =  _table.ProjectDetail.statedetail.filter(function(s:any){ return s.iscurrent==1})[0]
                                         if( _table.ProjectDetail.current_status == 6 || _table.ProjectDetail.current_status == 9  ) {
                                                _cureent_state = _table.ProjectDetail.statedetail.filter(function(s:any){ return s.iscurrent==1})[0].state_types_id
                                                _cur_state = _cureent_state - 2                                       
                                         } else {
                                                _cur_state=0
                                         }
                                         
                                         _approver_level =_table.ProjectDetail.approvers[_cur_state]
                                        /*  if(!_cureent_state){
                                                _cureent_state = _table.ProjectDetail.statedetail.filter(function(al:any){ return al.iscurrent == 1 && al.status_id == 9 })[0]?.running
                                                if(!_cureent_state){
                                                        _approver_level =  _table.ProjectDetail.approvers[0]
                                                } else {
                                                        _approver_level =  _table.ProjectDetail.statedetail.filter(function(al:any){ return al.running == (_cureent_state-1) })[0]?.target
                                                }
                                                
                                               
                                         } else{
                                                _approver_level =  _table.ProjectDetail.statedetail.filter(function(al:any){ return al.running == _cureent_state })[0]?.target
                                         } */
                                         
                                         
                                                if(_cur_state_row['states_mail']){

            //console.log('_cur_state_row:',_cur_state_row)    
                                                        premail['from'] =  _table.api.getSystemMailSender()
                                                        premail['to'] = _cur_state_row.states_mail[0]['send_to_text']
                                                        premail['cc'] = _cur_state_row.states_mail[0]['send_to_text']
                                                        premail['Subject'] =   _cur_state_row.states_mail[0]['detail']
                                                        premail['from_email'] =  _table.api.getSystemMailSender()
                                                        premail['to_email'] = _cur_state_row.states_mail[0]['send_to']
                                                        premail['cc_email'] = _cur_state_row.states_mail[0]['send_cc']
                                                        premail['body'] = _cur_state_row.states_mail[0]['body']
                                                        premail['state_id'] = _cur_state_row.id_state
                                                         premail['status_id'] = _cur_state_row.id_status
                                                        premail['ideanumber'] =_table.ProjectDetail.running
                                                        premail['send_next'] = _cur_state_row.states_mail[0]['send_next']
                                                        premail['send_at'] = _cur_state_row.states_mail[0]['send_at']
                                                        premail['repeat_time'] = _cur_state_row.states_mail[0]['repeat_time']
                                                        _table.openDialog(premail)
                                                } else {
                                                            _table.snackBar.openSnackBar( 'not found state data!!',
                                         'OK', 'center', 'top', 'snack-style');  
                                                }

                                        
                                         
                                         } else{
                                         /* _table.snackBar.openSnackBar( 'not found user data!!',
                                         'OK', 'center', 'top', 'snack-style'); */
                                         }
                                         
                                 })
                                
                               
                            
                               

                               
                        
                        
                        break;

                case 'SendApprove':
                    //console.log(event)
                        //  let premail:  any  = {};
                        if(event.sender == 'IdeasCommandButtonNew'){
                        _table.Me.next({eventname:'NewSaveDraftAndApprove',target:'ProjectDetailNew', ProjectDetail:_table.ProjectDetailNew })                                 
                        } else {
                        _table.Me.next({eventname:'SaveDraftAndApprove',target:'ProjectDetail', ProjectDetail:_table.ProjectDetail })                                 
                        }
                        
                        
                        break;
                                                
                case 'ApproverClickButton':
                    //console.log(event)
                        //  let premail:  any  = {};
                        _table.openConfirmStatusDialog(event.buttonname)
                        break;
                        
                case 'ImplementerClickButton':
                    //console.log(event)
                        //  let premail:  any  = {};
                       if(event.buttonname=='Implement Save & Send to Coordinator') {

                                _table.Me.next({eventname:'SaveImplemetAndApprove',target:'ProjectDetail', ProjectDetail:_table.ProjectDetail })  

                       } else {

                        
                        if(event.buttonname=='Save Draft Implement' ) {
                                _table.Me.next({eventname:'SaveImplemet',target:'ProjectDetail' })  

                        } else{
                                if(event.buttonname=='FormEnable'  || event.buttonname=='FormDisable') {

                                        _table.Me.next({eventname:event.buttonname,target:'ProjectDetail' })  
        
                                        } else {
                                                _table.openConfirmStatusDialog(event.buttonname)
                                        }
                               }
                        }
                        

                        
                        break;                               

                        case 'UpdatedByImplementer':
                            //console.log(event)
                                //  let premail:  any  = {};
                               

                                _table.api.Query('SELECT public.get_ideas_detail($1,$2) ',[_table.ProjectDetail.id ,_table.UserInfo.id]).subscribe(function(output){
                                    //console.log(output)
                                      
                                         let _my_ideas:any = output[0]['get_ideas_detail'][0]
                                         let _cur_state :any
                                         let _cur_state_row :any
                                         _table.ProjectDetail = _my_ideas                                            
                                         let _coordinator_level = _table.ProjectDetail.coordinators_detail.filter(function(cc:any){ return cc.value == _table.ProjectDetail.coordinators[0]  })
                                        _cur_state_row =  _table.ProjectDetail.statedetail.filter(function(s:any){ return s.iscurrent==1})[0]

                                       if(_cur_state_row['states_mail']){

                                                     //console.log('_cur_state_row:',_cur_state_row)    
                                                        premail['from'] =  _table.api.getSystemMailSender()
                                                        premail['to'] = _cur_state_row.states_mail[0]['send_to_text']
                                                        premail['cc'] = _cur_state_row.states_mail[0]['send_to_text']
                                                        premail['Subject'] =   _cur_state_row.states_mail[0]['detail']
                                                        premail['from_email'] =  _table.api.getSystemMailSender()
                                                        premail['to_email'] = _cur_state_row.states_mail[0]['send_to']
                                                        premail['cc_email'] = _cur_state_row.states_mail[0]['send_cc']
                                                        premail['body'] = _cur_state_row.states_mail[0]['body']
                                                        premail['state_id'] = _cur_state_row.id_state
                                                         premail['status_id'] = _cur_state_row.id_status
                                                        premail['ideanumber'] =_table.ProjectDetail.running
                                                        premail['send_next'] = _cur_state_row.states_mail[0]['send_next']
                                                        premail['send_at'] = _cur_state_row.states_mail[0]['send_at']
                                                        premail['repeat_time'] = _cur_state_row.states_mail[0]['repeat_time']
                                                        _table.openDialog(premail)
                                                } else {
                                                            _table.snackBar.openSnackBar( 'not found state data!!',
                                         'OK', 'center', 'top', 'snack-style');  
                                                }
                                 })


                           
                                
                              
                                
        
                                break;                               
   
                case 'ApplyClickButton':
                    //console.log(event)
                        //  let premail:  any  = {};
                        if(event.buttonname=='Implement Save By Coordinator') {

                                _table.Me.next({eventname:'SaveBYCoordinator',target:'ProjectDetail', ProjectDetail:_table.ProjectDetail })  

                        } else {
                                if(event.buttonname=='FormEnable'  || event.buttonname=='FormDisable' || event.buttonname== 'Applied' ) {

                                        _table.Me.next({eventname:event.buttonname,target:'ProjectDetail' })  
        
                                        } else {
                                                _table.openConfirmStatusDialog(event.buttonname)
                                        }
                        }

                        
                        break; 
                case 'AppliedOK':
                        
                                                _table.openConfirmStatusDialog('Applied')

                        
                        break;  
                        
                case 'DefendClickButton':
                    //console.log(event)
                        //  let premail:  any  = {};
                        if(event.buttonname=='Raise Defend to Approver') {
 
                                _table.Me.next({eventname:'SaveDefendBYOwner',target:'ProjectDetail', ProjectDetail:_table.ProjectDetail })  


                        }  else {
                                if(event.buttonname=='FormEnable'  || event.buttonname=='FormDisable') {

                                        _table.Me.next({eventname:event.buttonname,target:'ProjectDetail' })  
        
                                        }  else {
                                                if(event.buttonname=='Save Defend' ) {
        
                                                        _table.Me.next({eventname:event.buttonname,target:'ProjectDetail' })  
                        
                                                        } else {
                                                                _table.openConfirmStatusDialog(event.buttonname)
                                                        } 
                                        }
                        }

                 

                        
                        break;  
                        

                default:
                        break;
                }        
    }

    openDialog(premail:any): void {
        let mailinfo = {
                from: premail.from,
                to: premail.to,
                cc: premail.cc,
                Subject: premail.Subject,
                detail:premail.body,
                from_email:premail.from_email,
                to_email:premail.to_email,
                cc_email:premail.cc_email,
                state_id:premail.state_id,
                ideanumber:premail.ideanumber,
                 send_next:  premail['send_next']? this.dateformat.transform(premail['send_next'],'d MMMM yyyy HH:mm:ss'):null  ,
                 send_at:  premail['send_at'] ? this.dateformat.transform(premail['send_at'],'d MMMM yyyy HH:mm:ss'):null  ,
                 repeat_time:  premail['repeat_time'] 
        }
        const dialogRef = this.dialog.open(SendemailDialogComponent, {
          data: mailinfo,
        });
    
        dialogRef.afterClosed().subscribe(result => {
           const _form = this             
      //console.log('The dialog was closed',result);
          let _update_str = ''
     

          if(result){
             if(result.cc_email && result.detail){
                if(JSON.stringify(premail.cc_email)!=JSON.stringify(result.cc_email)){
                        _update_str = 'update public.project_states_mail set send_cc = $1::json where project_states_id = $2'
                        _form.api.Query(_update_str,[result.cc_email ,premail.state_id]).subscribe(function(output){
                            //console.log(output)
                        });
                }
                if(premail.body!=result.detail){
                        _update_str = 'update public.project_states_mail set body = $1 where project_states_id = $2'
                        _form.api.Query(_update_str,[result.detail ,premail.state_id]).subscribe(function(output){
                            //console.log(output)
                        });
                }
          }

                switch ( premail['status_id']) {
                        case 1:
                                //this.SendMailToApprover(result)  
                                _form.api.sendMailByIdState(premail.state_id).subscribe(function(m){
                                    //console.log(m)
                                                                setTimeout(() => {
                                window.document.location.reload()        
                        }, 1000);   
                                })
                                if (_form.ProjectDetail.current_status < 4){
                                        _form.UpdateWaitApprove(result)
                                }


                                break;
                        case 4:
                                //this.SendMailToApprover(result)  
                                _form.api.sendMailByIdState(premail.state_id).subscribe(function(m){
                                    //console.log(m)
                                                                setTimeout(() => {
                                window.document.location.reload()        
                        }, 1000);   
                                })
                                if (_form.ProjectDetail.current_status < 4){
                                        _form.UpdateWaitApprove(result)
                                }
                                 

                                break;
                        case 5:
                        
                                let _cur_state_row:any;
                                _cur_state_row =  _form.ProjectDetail.statedetail.filter(function(s:any){ return s.iscurrent==1})[0]

                                if(_cur_state_row.state_types_id==8)   {
                                        _form.api.CallProcedure('public.update_project_implement',{project_id:_form.ProjectDetail.id, target:_form.UserInfo.id }).subscribe(function(updated){
                                            //console.log('update_project_implement:',updated)
                                                let _message:string =''
                                                if(!updated['status']){                                   
                                                        
                                                        for (let index = 0; index < _form.ProjectDetail.coordinators_detail.length; index++) {
                                                                const _approvers:any = _form.ProjectDetail.coordinators_detail[index];
                                                                let _message
                                                                _message =  _form.ProjectDetail.title  + ' has been implementedand waiting for your approval.' 
                                                                _form.api.CallProcedure('public.insert_notifications',{project_id:_form.ProjectDetail.id, user_id:_approvers.value,textmessage:_message }).subscribe(function(output){
                                                                    //console.log('insert_notifications:',output)                                                          
                                                                        })    
                                                        }
                                                        
        
                                                setTimeout(() => {
                                                        window.document.location.reload()        
                                                }, 500)  
                                                } else {
                                                        if(updated['status']=='error'){
                                                                _message = 'Not Update IdeaNo. '+ _form.ProjectDetail.ideanumber + ' to wait approve :' + updated['error'].toString()
                                                                _form.api.CallProcedure('public.insert_notifications',{project_id:_form.ProjectDetail.id, user_id:_form.UserInfo.id,textmessage:_message }).subscribe(function(output){
                                                                    //console.log('insert_notifications:',output)                                                          
                                                                        })
                                                        }
                                                        else{
                
                                                        }
                                                }
        
                                                
        
                
                                        
                                })  
                                        _form.api.sendMailByIdState(premail.state_id).subscribe(function(m){
                                                    //console.log(m)
                                                                                setTimeout(() => {
                                                window.document.location.reload()        
                                        }, 500);   
                                                })
                                } else {
                                        _form.api.sendMailByIdState(premail.state_id).subscribe(function(m){
                                                    //console.log(m)
                                                                                setTimeout(() => {
                                                window.document.location.reload()        
                                        }, 500);   
                                                })
                                    setTimeout(() => {
                                        window.document.location.reload()        
                                    }, 500);       
                                }

                             
                                 

                                break;

                        case 6:
                                //this.SendMailToApprover(result)  
                                _form.api.sendMailByIdState(premail.state_id).subscribe(function(m){
                                    //console.log(m)
      /*                                                           setTimeout(() => {
                                window.document.location.reload()        
                        }, 500);   */
                                })
                              
                                if (_form.ProjectDetail.current_status == 6){
                                        _form.UpdateRaiseDefend (result)
                                       // window.document.location.reload()  
                                }

                                break;
                
                        case 9:
                                //this.SendMailToApprover(result)  
                                _form.api.sendMailByIdState(premail.state_id).subscribe(function(m){
                                    //console.log(m)
                                                               /*  setTimeout(() => {
                                window.document.location.reload()        
                        }, 1000);   */
                                }) 
                                if (_form.ProjectDetail.current_status == 9){
                                        _form.UpdateRaiseDefend(result)
                                       // window.document.location.reload()  
                                }
                                 

                                break;
                      
                        case 13:

                          
                                _form.api.sendMailByIdState(premail.state_id).subscribe(function(m){
                                    //console.log(m)
                                        setTimeout(() => {
                                window.document.location.reload()        
                        }, 500);   
                                
                                })
                                 
                                //this.SendMailToCoordinator(result)                                
                                break;
                
                        default:
                                        _form.api.sendMailByIdState(premail.state_id).subscribe(function(m){
                                                    //console.log(m)
                                                                                setTimeout(() => {
                                                window.document.location.reload()        
                                        }, 1000);   
                                })
                                break;
                }
               
          } else{
    /*          setTimeout(() => {
                                                window.document.location.reload()        
                                        }, 200);   */    
          }
          //this.password = result;
            this.AppService.setVariable('EnableCommandButton',true) 
        });
      }

      SendMailBackground(id_state:number): void {
        const _form = this
        let premail:any= {}
        _form.api.sendMailByIdState(id_state).subscribe(function(m){
            //console.log(m)
        })
       }

  
        SendMailCoordinatorBackground(id_state:number): void {
                const _table = this
                let premail:any= {}
                let _dear
                  _table.api.sendMailByIdState(id_state).subscribe(function(m){
            //console.log(m)
        })
                }
        
                SendMailIdeaOwnBackground(id_state:number,state:string): void {
                        const _table = this
                        let premail:any= {}
                         
                        let _dear
                                           _table.api.sendMailByIdState(id_state).subscribe(function(m){
            //console.log(m)
        })
                        }
                
                        

      openMailToCoordinatorDialog(premail:any): void {
        let mailinfo = {
                from: premail.from,
                to: premail.to,
                cc: premail.cc,
                Subject: premail.Subject,
                dear: premail.dear ,
                detail:'',
                ideanumber:premail.ideanumber,
                createdate:premail.createdate,
                linkidea:premail.linkidea,
                from_email:premail.from_email,
                to_email:premail.to_email,
                cc_email:premail.cc_email,
                member_list: [],
                notify:'Notify idea has been implemented.',
                Please:'Please apply idea number ' + premail.ideanumber + '.'

        }
        const dialogRef = this.dialog.open(SendemailDialogComponent, {
          data: mailinfo,
        });
    
        dialogRef.afterClosed().subscribe(result => {

      //console.log('The dialog was closed',result);
          if(result){
                this.SendMailToCoordinator(result)
          }
          //this.password = result;

           this.AppService.setVariable('EnableCommandButton',true) 
        });
      }

      openConfirmStatusDialog(buttonname:string): void {
        let confirminfo = {}
        let _states = this.ProjectDetail.statedetail.filter(function(s:any){ return s.iscurrent == 1 })[0]
    //console.log('this.ProjectDetail.statedetail:',this.ProjectDetail.statedetail)
    //console.log('_states:',_states)
    console.log('buttonname:',buttonname)       
        switch (buttonname) {
                case 'Not Approve':
                        confirminfo = {
                                current_status: this.ProjectDetail.current_status,
                                Caption: 'NOT APPROVE',
                                caption_color:'white',
                  SubCaption: 'Tell us a reason',  
                  Reason: '',
                  Comment:'',
                  selectDoc:[],
                  action:'',
                  showconfirm:true,
                  showcancel:true,
                  showapprove:false,
                  shownotappove:false,
                  showback:false,
                  showok:false,
                  showList:true,
                  ListLabel:'Type of Reason:',
                  ListSource:[{value:1,display:'Not necessary'},{value:2,display:'Not available resource'}],
                  showIconHerder:true,
                  BaseHref:this.BaseHref,
                 
                        }
                
                        
                        break;
                        case 'Not Implement':
                                confirminfo = {
                                        current_status: this.ProjectDetail.current_status,
                                        Caption: 'OWNER NOT IMPLEMENT IDEA',
                                        caption_color:'white',
                          SubCaption: 'Tell us a reason',  
                          Reason: '',
                          Comment:'',
                          selectDoc:[],
                          action:'',
                          showconfirm:true,
                          showcancel:true,
                          showapprove:false,
                          shownotappove:false,
                          showback:false,
                          showok:false,
                          showList:false,
                          ListLabel:'',
                          ListSource:[],
                          showIconHerder:true,
                          BaseHref:this.BaseHref,
                         
                                }
                        
                                
                                break;
                
                case 'Approve':
                                confirminfo = {
                                        current_status: this.ProjectDetail.current_status,
                                        approve_level: this.getNextLevel(),
                                        Caption: 'APPROVE IDEA',
                                        caption_color:'white',
                          SubCaption: 'Tell us a comment',  
                          Reason: '',
                          Comment:'',
                          selectDoc:{MOC:_states?.moc_doc ,WI:_states?.work_doc,OTHER:_states?.other_doc,DOC:_states?.other_doc_name},
                          action:'',
                          showconfirm:false,
                          showcancel:true,
                          showapprove:false,
                          shownotappove:false,
                          showback:false,
                          showok:true,
                          showSelectDoc:false,
                          showList:false,
                          ListLabel:'',
                          ListSource:[],
                          showIconHerder:false,
                          BaseHref:this.BaseHref,
                                }
                            //console.log('confirminfo:',confirminfo)
                                
                                break;
                case 'Ask More':
                        confirminfo = {
                                current_status: this.ProjectDetail.current_status,
                                Caption: 'ASK MORE EVIDENCE',
                                caption_color:'white',
                        SubCaption: 'Tell us a reason',  
                        Reason: '',
                        Comment:'',
                        selectDoc:{MOC:_states?.moc_doc ,WI:_states?.work_doc,OTHER:_states?.other_doc,DOC:_states?.other_doc_name},
                        action:'',
                        showconfirm:true,
                        showcancel:true,
                        showapprove:false,
                        shownotappove:false,
                        showback:false,
                        showok:false,
                        showList:false,
                        ListLabel:'',
                        ListSource:[],
                        showIconHerder:true,
                        BaseHref:this.BaseHref,
                        
                        }
                
                        
                        break;
                case 'Not Applied':
                        confirminfo = {
                                current_status: this.ProjectDetail.current_status,
                                Caption: 'NOT APPLIED IDEA',
                                caption_color:'white',
                        SubCaption: 'Tell us a reason',  
                        Reason: '',
                        Comment:'',
                        selectDoc:{MOC:_states?.moc_doc==1 ,WI:_states?.work_doc==1,OTHER:_states?.other_doc==1,DOC:_states?.other_doc_name},
                        action:'',
                        showconfirm:true,
                        showcancel:true,
                        showapprove:false,
                        shownotappove:false,
                        showback:false,
                        showok:false,
                        showList:false,
                        ListLabel:'',
                        ListSource:[],
                        showIconHerder:true,
                        BaseHref:this.BaseHref,
                        
                        }
                        break;  
                 case 'Appile Save By Admin':
                        confirminfo = {
                                current_status: this.ProjectDetail.current_status,
                                Caption: 'Save By Admin',
                                caption_color:'white',
                        SubCaption: 'What have you changed this time?',  
                        Reason: '',
                        Comment:'',
                        selectDoc:{MOC:_states?.moc_doc==1 ,WI:_states?.work_doc==1,OTHER:_states?.other_doc==1,DOC:_states?.other_doc_name},
                        action:'',
                        showconfirm:true,
                        showcancel:true,
                        showapprove:false,
                        shownotappove:false,
                        showback:false,
                        showok:false,
                        showList:false,
                        ListLabel:'',
                        ListSource:[],
                        showIconHerder:true,
                        BaseHref:this.BaseHref,
                        
                        }
                        break;  
                        

                case 'Applied':
                        confirminfo = {
                                current_status: this.ProjectDetail.current_status,
                                Caption: 'APPLIED IDEA',
                                caption_color:'white',
                        SubCaption: "<p>Have you already confirmed to ensure <br> the related documents was revised or <br> established as idead owner's manager <br> defined?</p>",  
                        Reason: '',
                        Comment:'',
                        selectDoc:this.getSelectDoc(),
                        action:'',
                        showconfirm:false,
                        showcancel:true,
                        showapprove:false,
                        shownotappove:false,
                        showback:false,
                        showok:false,
                        showList:false,
                        ListLabel:'',
                        ListSource:[],
                        showIconHerder:true,
                        BaseHref:this.BaseHref,
                        
                        }
                                
                        
                        break;                                
                default:
                        break;
        }

        const dialogRef = this.dialogConfirm.open(ConfirmStatusDialogComponent, {
          data: confirminfo,
        });
    
        dialogRef.afterClosed().subscribe(result => {

      //console.log('The dialog was closed',result);
          if(result){
              //  this.SendMailToApprover(result)
              
              switch ( parseInt(result.current_status)  ) {
                case 4:
                      if  (result.action=='Confirm Not Approve'){
                        this.SetToNotApprover(result)
                      }
                      if  (result.action.indexOf('Confirm Approve')> -1 ){
                                this.SetApprove (result)
                      }
                      if  (result.action.indexOf('Confirm Ask more')> -1 ){
                        this.SetAskMore (result)
                        }
                      
                        break;
                case 5:
                        if  (result.action=='Confirm Not Implement'){
                                this.SetToNotImplement(result)
                        }
                        if  (result.action.indexOf('Confirm Approve')> -1 ){
                                        this.SetApprove (result)
                        }
                        if  (result.action.indexOf('Confirm Ask more')> -1 ){
                                this.SetAskMore (result)
                                }
                        
                                break;

                case 6 | 9:
                        if  (result.action=='Raise Defend to Approver'){
                                this.SetToNotApplied(result)
                        }
                        if  (result.action=='Confirm Applied' ){
                                this.SetApplied (result)
                        }
                        if  (result.action=='Not Confirm Applied' ){
                                this.NotConfirmApplied (result)
                        }

                        
                                break;
                case 13:
                        if  (result.action=='Confirm Not Applied'){
                                this.SetToNotApplied(result)
                        }
                        if  (result.action=='Confirm Applied' ){
                                this.SetApplied (result)
                        }
                        if  (result.action=='Not Confirm Applied' ){
                                this.NotConfirmApplied (result)
                        }

                        
                                break;

                 case 10:
                       // alert(result.action)
                        if  (result.action=='Confirm Save By Admin'){
                                this.AdminSaveApplied(result)
                        }
                         
                        
                                break;                       
                                    
                default:
                        break;
              }
          }
          //this.password = result;

         this.AppService.setVariable('EnableCommandButton',true) 

        });
      }

      getMyApproveLevel(){

    //console.log('getMyApproveLevel:', this.ProjectDetail,'>>',this.UserInfo)
        
        if(this.ProjectDetail.approvers[0] == this.UserInfo.id){
                return 1
        } else {
                if(this.ProjectDetail.approvers[1] == this.UserInfo.id){
                        return 2
                } else {
                        if(this.ProjectDetail.approvers[2] == this.UserInfo.id){
                                return 3
                        } else {
                                return 0
                        }
                }
        }
      }

       getNextLevel(){
        let level =1
        let state_types_id =2
    //console.log('getNextLevel:', this.ProjectDetail.approvers[level])
        state_types_id = this.ProjectDetail.statedetail.filter(function(s:any){ return s.iscurrent == 1})[0].state_types_id
        level = state_types_id-1
        return this.ProjectDetail.approvers[level]
     
      }

      getSelectDoc(){

    //console.log('getSelectDoc:', this.ProjectDetail,'>>',this.UserInfo)
        let _laststate =  this.ProjectDetail.statedetail.filter(function(l:any){ return l.iscurrent})
        let _doclist = []
        let _moc = _laststate[0].moc_doc?{label:'MOC',value: _laststate[0].moc_ref?_laststate[0].moc_ref:'-' }:{label:'MOC',value:'-' };
        let _wi = _laststate[0].work_doc?{label:'Work Instruction',value:_laststate[0].wi_ref?_laststate[0].wi_ref:'-' }:{label:'Work Instruction',value:'-' };
        let _orther = _laststate[0].other_doc?{label:_laststate[0].other_doc_name ,value:_laststate[0].other_ref?_laststate[0].other_ref:'-' }:{label:'Other Doc',value:'-' };
       if(_moc){_doclist.push(_moc )} 
       if(_wi){_doclist.push(_wi )} 
       if(_orther){_doclist.push(_orther )} 
        return _doclist
        
      }

      SetToNotApprover(confirmdata:ConfirmStatusDialogData){
        const _page = this
        let _remark=''
        if(confirmdata.Comment){
                _remark = confirmdata.Reason + ':' +confirmdata.Comment
        } else {
                _remark = confirmdata.Reason
        }
        _page.api.CallProcedure('public.update_project_not_approve',{project_id:_page.ProjectDetail.id, target:_page.UserInfo.id,remark:_remark }).subscribe(function(updated){
                    //console.log('update_project_not_approve:',updated)
                        let _message:string =''
                        if(!updated['status']){
                        _message = ' Idea No. '+ _page.ProjectDetail.running + ' was rejected.' 
                        _page.api.CallProcedure('public.insert_notifications',{project_id:_page.ProjectDetail.id, user_id:_page.UserInfo.id,textmessage:_message }).subscribe(function(output){
                            //console.log('insert_notifications:',output)                                                          
                                })
                                
                                
                                        _message = ' Idea No. ' + _page.ProjectDetail.running + ' was rejected.' 
                                        _page.api.CallProcedure('public.insert_notifications',{project_id:_page.ProjectDetail.id, user_id:_page.ProjectDetail.idea_by,textmessage:_message }).subscribe(function(output){
                                            //console.log('insert_notifications:',output)                                                          
                                                })    
                                        let _idea_by :datalist = _page.memberlist.filter(function(ib:datalist){   return ib.value == _page.ProjectDetail.idea_by })[0] 
                                        _page.SendMailIdeaOwnBackground(updated['id_state'],'B')
                                        if(updated['id_state_next']){_page.SendMailBackground(updated['id_state_next'])} 

                                setTimeout(() => {
                                window.document.location.reload()        
                        }, 500);    
                        } else {
                                if(updated['status']=='error'){
                                        _message = 'Not Update IdeaNo. '+ _page.ProjectDetail.running + ' :' + updated['error'].toString()
                                        _page.api.CallProcedure('public.insert_notifications',{project_id:_page.ProjectDetail.id, user_id:_page.UserInfo.id,textmessage:_message }).subscribe(function(output){
                                            //console.log('insert_notifications:',output)                                                          
                                                })
                                }
                                else{

                                }
                        }

                        


                
        })  
                        
         
    }
    SetToNotImplement(confirmdata:ConfirmStatusDialogData){
        const _page = this
        let _remark=''
        
         _remark = confirmdata.Comment
        
        _page.api.CallProcedure('public.update_project_not_implement',{project_id:_page.ProjectDetail.id, target:_page.UserInfo.id,remark:_remark }).subscribe(function(updated){
                    //console.log('update_project_not_implement:',updated)
                        let _message:string =''
                        if(!updated['status']){
                        _message = ' Idea No. '+ _page.ProjectDetail.running + ' was rejected.' 
                        _page.api.CallProcedure('public.insert_notifications',{project_id:_page.ProjectDetail.id, user_id:_page.UserInfo.id,textmessage:_message }).subscribe(function(output){
                            //console.log('insert_notifications:',output)                                                          
                                })
                                
                                
                                        _message = ' Idea No. ' + _page.ProjectDetail.running + ' was rejected.' 
                                        _page.api.CallProcedure('public.insert_notifications',{project_id:_page.ProjectDetail.id, user_id:_page.ProjectDetail.idea_by,textmessage:_message }).subscribe(function(output){
                                            //console.log('insert_notifications:',output)                                                          
                                                })    
                                                let _idea_by :datalist = _page.memberlist.filter(function(ib:datalist){   return ib.value == _page.ProjectDetail.idea_by })[0] 
                                                _page.SendMailIdeaOwnBackground(updated['id_state'],'B')
                                                if(updated['id_state_next']){_page.SendMailBackground(updated['id_state_next'])} 
                                setTimeout(() => {
                                window.document.location.reload()        
                        }, 500 )  
                        } else {
                                if(updated['status']=='error'){
                                        _message = 'Not Update IdeaNo. '+ _page.ProjectDetail.running + ' :' + updated['error'].toString()
                                        _page.api.CallProcedure('public.insert_notifications',{project_id:_page.ProjectDetail.id, user_id:_page.UserInfo.id,textmessage:_message }).subscribe(function(output){
                                            //console.log('insert_notifications:',output)                                                          
                                                })
                                }
                                else{

                                }
                        }

                        


                
        })  
                        
         
    }

    SetToNotApplied(confirmdata:ConfirmStatusDialogData){
        const _page = this
        let _remark=''
        
         _remark = confirmdata.Comment
        
        _page.api.CallProcedure('public.update_project_not_applied',{project_id:_page.ProjectDetail.id, target:_page.UserInfo.id,remark:_remark }).subscribe(function(updated){
                    //console.log('update_project_not_applied:',updated)
                        let _message:string =''
                        if(!updated['status']){
                        _message = ' Idea No. '+ _page.ProjectDetail.running + ' was rejected.' 
                        _page.api.CallProcedure('public.insert_notifications',{project_id:_page.ProjectDetail.id, user_id:_page.UserInfo.id,textmessage:_message }).subscribe(function(output){
                            //console.log('insert_notifications:',output)                                                          
                                })
                                
                                
                                        _message = ' Idea No. ' + _page.ProjectDetail.running + ' was rejected.' 
                                        _page.api.CallProcedure('public.insert_notifications',{project_id:_page.ProjectDetail.id, user_id:_page.ProjectDetail.idea_by,textmessage:_message }).subscribe(function(output){
                                            //console.log('insert_notifications:',output)                                                          
                                                })    
                                        let _idea_by :datalist = _page.memberlist.filter(function(ib:datalist){   return ib.value == _page.ProjectDetail.idea_by })[0] 
                                        _page.SendMailIdeaOwnBackground(updated['id_state'],'B')
                                       if(updated['id_state_next']){_page.SendMailBackground(updated['id_state_next'])} 


                                setTimeout(() => {
                                window.document.location.reload()        
                        }, 500);    
                        } else {
                                if(updated['status']=='error'){
                                        _message = 'Not Update IdeaNo. '+ _page.ProjectDetail.running + ' :' + updated['error'].toString()
                                        _page.api.CallProcedure('public.insert_notifications',{project_id:_page.ProjectDetail.id, user_id:_page.UserInfo.id,textmessage:_message }).subscribe(function(output){
                                            //console.log('insert_notifications:',output)                                                          
                                                })
                                }
                                else{

                                }
                        }

        })                          
         
    }
     AdminSaveApplied(confirmdata:ConfirmStatusDialogData){
        const _page = this
        let _remark=''
        
         _remark = confirmdata.Comment
        
       
        
        _page.api.CallProcedure('public.insert_project_applied_edit',{project_id:_page.ProjectDetail.id, target:_page.UserInfo.id,remark:_remark }).subscribe(function(updated){
                    console.log('insert_project_applied_edit:',updated)
        _page.Me.next({eventname:'SaveBYCoordinator',target:'ProjectDetail' })                          

        })                          
         
    }
    SetAskMore(confirmdata:ConfirmStatusDialogData){
        const _page = this
        let _remark=''
        
         _remark = confirmdata.Comment
        
        _page.api.CallProcedure('public.update_project_ask_more',{project_id:_page.ProjectDetail.id, target:_page.UserInfo.id,remark:_remark }).subscribe(function(updated){
                    //console.log('update_project_ask_more:',updated)
                        let _message:string =''
                        if(!updated['status']){
                        _message = ' Idea No. '+ _page.ProjectDetail.running + ' Approver - ' + _page.UserInfo.name + ' asked more evidence.'
                        _page.api.CallProcedure('public.insert_notifications',{project_id:_page.ProjectDetail.id, user_id:_page.ProjectDetail.idea_by,textmessage:_message }).subscribe(function(output){
                            //console.log('insert_notifications:',output)                                                          
                                })
                                /* 
                                
                                        _message = ' Idea No. ' + _page.ProjectDetail.running + ' was rejected.' 
                                        _page.api.CallProcedure('public.insert_notifications',{project_id:_page.ProjectDetail.id, user_id:_page.ProjectDetail.idea_by,textmessage:_message }).subscribe(function(output){
                                            //console.log('insert_notifications:',output)                                                          
                                                })    */ 
                               

                                setTimeout(() => {
                                        console.log('updated:',updated)

                                         _page.SendMailBackground(updated['id_state'])   
                                window.document.location.reload()        
                        }, 500);    
                        } else {
                                if(updated['status']=='error'){
                                        _message = 'Not Update IdeaNo. '+ _page.ProjectDetail.running + ' :' + updated['error'].toString()
                                        _page.api.CallProcedure('public.insert_notifications',{project_id:_page.ProjectDetail.id, user_id:_page.UserInfo.id,textmessage:_message }).subscribe(function(output){
                                            //console.log('insert_notifications:',output)                                                          
                                                })
                                }
                                else{

                                }
                        }

                        


                
        })  
                        
         
    }

    SetDefend(){
        const _page = this
         
        
        _page.api.CallProcedure('public.update_project_defend',{project_id:_page.ProjectDetail.id, target:_page.UserInfo.id }).subscribe(function(updated){
                    //console.log('update_project_ask_more:',updated)
                        let _message:string =''
                        if(!updated['status']){
                        _message = ' Idea No. '+ _page.ProjectDetail.running + ' Approver - ' + _page.UserInfo.name + ' asked more evidence.'
                        _page.api.CallProcedure('public.insert_notifications',{project_id:_page.ProjectDetail.id, user_id:_page.ProjectDetail.idea_by,textmessage:_message }).subscribe(function(output){
                            //console.log('insert_notifications:',output)                                                          
                                })
                                /* 
                                
                                        _message = ' Idea No. ' + _page.ProjectDetail.running + ' was rejected.' 
                                        _page.api.CallProcedure('public.insert_notifications',{project_id:_page.ProjectDetail.id, user_id:_page.ProjectDetail.idea_by,textmessage:_message }).subscribe(function(output){
                                            //console.log('insert_notifications:',output)                                                          
                                                })    */ 

                                setTimeout(() => {
                                        window.document.location.reload()        
                                }, 1000);    
                        } else {
                                if(updated['status']=='error'){
                                        _message = 'Not Update IdeaNo. '+ _page.ProjectDetail.running + ' :' + updated['error'].toString()
                                        _page.api.CallProcedure('public.insert_notifications',{project_id:_page.ProjectDetail.id, user_id:_page.UserInfo.id,textmessage:_message }).subscribe(function(output){
                                            //console.log('insert_notifications:',output)                                                          
                                                })
                                }
                                else{

                                }
                        }

                        


                
        })  
                        
         
    }

    SetApprove(confirmdata:ConfirmStatusDialogData){
        const _page = this
        let _remark=''
        let _are_related_doc = 0
        let _MOC = 0
        let _WI = 0
        let _ORTHER = 0
        let _DOC =''

        let _updatedata ={}

        if(confirmdata.action !='Confirm Approve'){
                _are_related_doc = 1
                _MOC = confirmdata.selectDoc['MOC']?1:0
                _WI = confirmdata.selectDoc['WI']?1:0
                _ORTHER = confirmdata.selectDoc['OTHER']?1:0
                _DOC = confirmdata.selectDoc['DOC']?confirmdata.selectDoc['DOC']:''

        } 

        _updatedata = {project_id:_page.ProjectDetail.id,
                         target:_page.UserInfo.id,
                         remark:confirmdata.Comment,
                         are_related_doc:_are_related_doc,
                         moc_doc:_MOC,
                         work_doc:_WI,
                         other_doc:_ORTHER,
                         other_doc_name:_DOC
                         }

        _page.api.CallProcedure('public.update_project_to_approved',_updatedata).subscribe(function(updated){
                    //console.log('update_project_to_approved:',updated)
                        let _message:string =''
                        if(!updated['status']){
                                if(updated['level']){
                                        _message = ' Idea No. '+ _page.ProjectDetail.running + ' is waiting for approval level' + updated['level'].toString() +'.' 
                                        _page.api.CallProcedure('public.insert_notifications',{project_id:_page.ProjectDetail.id, user_id:updated['next_approver'],textmessage:_message }).subscribe(function(output){
                                            //console.log('insert_notifications:',output) 
                                                _page.SendMailBackground(updated['id_state'])                                                         
                                                })
                                                
                                                
                                                        _message = ' Idea No. ' + _page.ProjectDetail.running + ' is waiting for approval level' + updated['level'].toString() +'.' 
                                                        _page.api.CallProcedure('public.insert_notifications',{project_id:_page.ProjectDetail.id, user_id:_page.ProjectDetail.idea_by,textmessage:_message }).subscribe(function(output){
                                                            //console.log('insert_notifications:',output)                                                          
                                                                
                                                                }) 
                                                                
                                                                
                
                                                 setTimeout(() => {
                                                window.document.location.reload()        
                                        }, 500);   
                                }
                                else{
                                        _message = ' Idea No. '+ _page.ProjectDetail.running + ' was approved.' 
                                        _page.api.CallProcedure('public.insert_notifications',{project_id:_page.ProjectDetail.id, user_id:_page.UserInfo.id,textmessage:_message }).subscribe(function(output){
                                            //console.log('insert_notifications:',output)                                                          
                                                })
                                                
                                                
                                                        _message = ' Idea No. ' + _page.ProjectDetail.running + ' was approved.' 
                                                        _page.api.CallProcedure('public.insert_notifications',{project_id:_page.ProjectDetail.id, user_id:_page.ProjectDetail.idea_by,textmessage:_message }).subscribe(function(output){
                                                            //console.log('insert_notifications:',output)                                                          
                                                                })   
                                                                let _idea_by :datalist = _page.memberlist.filter(function(ib:datalist){   return ib.value == _page.ProjectDetail.idea_by })[0] 
                                                                _page.SendMailIdeaOwnBackground(updated['id_state'],'A')
                                                                if(updated['id_state_next']){_page.SendMailBackground(updated['id_state_next'])} 
                                                                
                
                                                setTimeout(() => {
                                                window.document.location.reload()        
                                        }, 500);  
                                }
                         
                        } else {
                            //console.log('updated[status]=',updated['status'])
                                if(updated['status']=='error'){
                                        _message = 'Not approving IdeaNo. '+ _page.ProjectDetail.running + ' :' + JSON.stringify(updated['error']) 
                                        _page.api.CallProcedure('public.insert_notifications',{project_id:_page.ProjectDetail.id, user_id:_page.UserInfo.id,textmessage:_message }).subscribe(function(output){
                                            //console.log('insert_notifications:',output)                                                          
                                                })

                                }
                                else{

                                }
                                   setTimeout(() => {
                                                window.document.location.reload()        
                                        }, 500);   
                        }

                        


                
        })  
                        
         
    }

    SetApplied(confirmdata:ConfirmStatusDialogData){
        const _page = this
        let _remark=''
        let _are_related_doc = 0
        let _MOC = 0
        let _WI = 0
        let _ORTHER = 0
        let _DOC =''

        let _updatedata ={}

       

        _updatedata = {project_id:_page.ProjectDetail.id,
                         target:_page.UserInfo.id,
                         remark:confirmdata.Comment,                         
                         }

        _page.api.CallProcedure('public.update_project_applied',_updatedata).subscribe(function(updated){
                    //console.log('update_project_applied:',updated)
                        let _message:string =''
                        if(!updated['status']){
                                if(updated['level']){
                                        _message = ' Idea No. '+ _page.ProjectDetail.running + ' was applied.' 
                                        _page.api.CallProcedure('public.insert_notifications',{project_id:_page.ProjectDetail.id, user_id:_page.UserInfo.id,textmessage:_message }).subscribe(function(output){
                                            //console.log('insert_notifications:',output)    
                                                _page.SendMailCoordinatorBackground(updated['id_state']);                                                 
                                                })
                                                _message = ' Idea No. ' + _page.ProjectDetail.running + ' was approved.' 
                                                _page.api.CallProcedure('public.insert_notifications',{project_id:_page.ProjectDetail.id, user_id:_page.ProjectDetail.idea_by,textmessage:_message }).subscribe(function(output){
                                                    //console.log('insert_notifications:',output)                                                          
                                                        })                    
                                        setTimeout(() => {
                                                window.document.location.reload()        
                                        }, 1000); 
                                } else {
                                        _message = ' Idea No. '+ _page.ProjectDetail.running + ' was applied.' 
                                        _page.api.CallProcedure('public.insert_notifications',{project_id:_page.ProjectDetail.id, user_id:_page.UserInfo.id,textmessage:_message }).subscribe(function(output){
                                    //console.log('insert_notifications:',output)        
                                        _page.SendMailCoordinatorBackground(updated['id_state']);                                                   
                                        })
                                        
                                        
                                        _message = ' Idea No. ' + _page.ProjectDetail.running + ' was approved.' 
                                        _page.api.CallProcedure('public.insert_notifications',{project_id:_page.ProjectDetail.id, user_id:_page.ProjectDetail.idea_by,textmessage:_message }).subscribe(function(output){
                                            //console.log('insert_notifications:',output)                                                          
                                                })    
        
                                        setTimeout(() => {
                                                window.document.location.reload()        
                                        }, 500); 
                                }
                               

                         
                        } else {
                                if(updated['status']=='error'){
                                        _message = 'Not approving IdeaNo. '+ _page.ProjectDetail.running + ' :' + updated['error'].toString()
                                        _page.api.CallProcedure('public.insert_notifications',{project_id:_page.ProjectDetail.id, user_id:_page.UserInfo.id,textmessage:_message }).subscribe(function(output){
                                            //console.log('insert_notifications:',output)                                                          
                                                })
                                }
                                else{

                                }
                        }

                        


                
        })  
                        
         
    }
    NotConfirmApplied(confirmdata:ConfirmStatusDialogData){
        const _page = this
        let _remark=''
        let _are_related_doc = 0
        let _MOC = 0
        let _WI = 0
        let _ORTHER = 0
        let _DOC =''

        let _updatedata ={}

        

        _updatedata = {project_id:_page.ProjectDetail.id,
                         target:_page.UserInfo.id,
                         remark:confirmdata.Comment,                     
                         }

        _page.api.CallProcedure('public.update_project_renew_approved',_updatedata).subscribe(function(updated){
                    //console.log('update_project_renew_approved:',updated)
                        let _message:string =''
                        if(!updated['status']){
                        _message = ' Idea No. '+ _page.ProjectDetail.running + ' was renew approved.' 
                        _page.api.CallProcedure('public.insert_notifications',{project_id:_page.ProjectDetail.id, user_id:_page.ProjectDetail.approvers[0],textmessage:_message }).subscribe(function(output){
                            //console.log('insert_notifications:',output)                                                          
                                })
                                
                                
                                        _message = ' Idea No. ' + _page.ProjectDetail.running + ' was renew approved.' 
                                        _page.api.CallProcedure('public.insert_notifications',{project_id:_page.ProjectDetail.id, user_id:_page.ProjectDetail.idea_by,textmessage:_message }).subscribe(function(output){
                                            //console.log('insert_notifications:',output)                                                          
                                                })    

                                setTimeout(() => {
                                window.document.location.reload()        
                        }, 1000);    
                        } else {
                                if(updated['status']=='error'){
                                        _message = 'Not approving IdeaNo. '+ _page.ProjectDetail.running + ' :' + updated['error'].toString()
                                        _page.api.CallProcedure('public.insert_notifications',{project_id:_page.ProjectDetail.id, user_id:_page.UserInfo.id,textmessage:_message }).subscribe(function(output){
                                            //console.log('insert_notifications:',output)                                                          
                                                })
                                }
                                else{

                                }
                        }

        })  
    }

    SendMailToApprover(maildata:any){
        const _page = this
        let _mailconfig:any = {}
    //console.log(maildata)
        _mailconfig['from'] = '"' + maildata.from + '" <' + maildata.from_email + '>;'
        if(maildata.to_email.length>1){
                let _reciver='['
                for (let index = 0; index < maildata.to_email.length; index++) {
                        const reciver =  maildata.to_email[index];
                        _reciver   = _reciver + '"' + reciver.display + '" <' + reciver.email + '>;'
                }
                _mailconfig['to'] =_reciver + ']'
        } else {
                if(maildata.to_email[0]){
                        _mailconfig['to'] = maildata.to_email[0].display + ' <' + maildata.to_email[0].email + '>;'
                }
                
        }
        if(maildata.cc_email.length>1){
                let _reciver='['
                for (let index = 0; index < maildata.cc_email.length; index++) {
                        const reciver =  maildata.cc_email[index];
                        if(reciver.email){
                                _reciver   = _reciver + '"' + reciver.display?reciver.display:reciver.email + '" <' + reciver.email + '>;'
                        }
                        
                }
                _mailconfig['cc'] =_reciver + ']'
        } else {
                if(maildata.cc_email.length==1){
                _mailconfig['cc'] = maildata.cc_email[0].display?maildata.cc_email[0].display:maildata.cc_email[0].email + ' <' + maildata.cc_email[0].email + '>;'
                } else {
                        _mailconfig['cc'] =''
                }
                
        }
        _mailconfig['subject'] =  maildata.Subject      
        _mailconfig['text'] = maildata.dear + '\n' + '\t\t' +  maildata.detail
        let _html:string = ''
        _html = _html + '<p>' +  maildata.dear + '</p> ';
        _html = _html + '<p> &emsp; &emsp;'  +  maildata.Subject + '</p> ';
        _html = _html + '<p>'+ maildata.notify +'</p> ';
        _html = _html + '<p  style="font-weight: bolder;" >' + maildata.Please + '</p>' ;
        _html = _html + '<p> Link to Brainbox : <a href="' + maildata.linkidea + '"> ' + maildata.linkidea + '</a></p>  ' ;
        // _html = _html + '<p>Note:Please copy this link and open in Google Chrome</p>';
        _html = _html + '<br>';
        _html = _html + '<p>Best Regards</p>';
        _html = _html + '<p> ' + maildata.from + '</p>';
        
        
        _mailconfig['html'] =  _html
       
        this.api.sendMail(_mailconfig.from,_mailconfig.to,_mailconfig.cc,_mailconfig.subject,_mailconfig.text,_mailconfig.html,{}).subscribe(function(m){
            //console.log(m)
                if(m['status']=="success"){
                        _page.snackBar.openSnackBar('Email is successfully sent. ', 'OK', 'center', 'top', 'snack-style')



                        
                } else {
                        _page.snackBar.openSnackBar('Error sent Email. ' +  JSON.stringify(m) , 'OK', 'center', 'top', 'snack-style')
                }
                _page.UpdateWaitApprove(maildata)
        })
    }

    UpdateWaitApprove(maildata:any){
        const _page = this

                                  
        _page.api.CallProcedure('public.update_project_wait_approve',{project_id:_page.ProjectDetail.id, user_id:_page.UserInfo.id }).subscribe(function(updated){
                //console.log('update_project_wait_approve:',updated)
                let _message:string =''
                        if(!updated['status']){
                        _message = maildata.ideanumber  + ':' +  _page.ProjectDetail.title   + ',is waiting for approval.' 
                        _page.api.CallProcedure('public.insert_notifications',{project_id:_page.ProjectDetail.id, user_id:_page.UserInfo.id,textmessage:_message }).subscribe(function(output){
                                //console.log('insert_notifications:',output)                                                          
                                })
                                
                                for (let index = 0; index < _page.ProjectDetail.approvers_detail.length; index++) {
                                        const _approvers:any = _page.ProjectDetail.approvers_detail[index];
                                        let _message
                                        _message = maildata.ideanumber  + ':' +  _page.ProjectDetail.title   + ', is waiting for your approval.' 
                                        _page.api.CallProcedure('public.insert_notifications',{project_id:_page.ProjectDetail.id, user_id:_approvers.value,textmessage:_message }).subscribe(function(output){
                                                //console.log('insert_notifications:',output)                                                          
                                                })    
                                }
                                

                        setTimeout(() => {
                                window.document.location.reload()        
                        }, 500);    
                        } else {
                                if(updated['status']=='error'){
                                        _message = 'Not Update IdeaNo. '+ maildata.ideanumber + ' to wait approve :' + updated['error'].toString()
                                        _page.api.CallProcedure('public.insert_notifications',{project_id:_page.ProjectDetail.id, user_id:_page.UserInfo.id,textmessage:_message }).subscribe(function(output){
                                                //console.log('insert_notifications:',output)                                                          
                                                })
                                }
                                else{

                                }
                        }

                        


                
        })  
                         
    }

        UpdateRaiseDefend(maildata:any){
        const _page = this

                                if(_page.ProjectDetail.current_status == 9 || _page.ProjectDetail.current_status == 6) {

                                _page.api.CallProcedure('public.update_project_raise_defend_to_approver',{project_id:_page.ProjectDetail.id,target: _page.UserInfo.id , idea_by:_page.ProjectDetail.idea_by }).subscribe(function(updated){
                                  //  console.log('public.update_project_raise_defend_to_approver:',updated)
                                        let _message:string =''
                                let _cur_state = _page.ProjectDetail.statedetail.filter(function(s:any){ return s.iscurrent==1})[0].state_types_id
                                _cur_state = _cur_state - 2
                                        if(!updated['status']){
                                            _message = maildata.Subject
                                            _page.api.CallProcedure('public.insert_notifications',{project_id:_page.ProjectDetail.id, user_id:_page.UserInfo.id,textmessage:_message }).subscribe(function(output){
                                               // console.log('insert_notifications:',output)                                                          
                                                    })
                                                    
                                                    for (let index = 0; index < _page.ProjectDetail.approvers_detail.length; index++) {
                                                            const _approvers:any = _page.ProjectDetail.approvers_detail[index];
                                                            let _message
                                                              
                                                            _message =    maildata.Subject
                                                            _page.api.CallProcedure('public.insert_notifications',{project_id:_page.ProjectDetail.id, user_id:_approvers.value,textmessage:_message }).subscribe(function(output){
                                                                //console.log('insert_notifications:',output)                                                          
                                                                    })    
                                                    }
                                                   
    
                                             setTimeout(() => {
                                                    window.document.location.reload()        
                                            }, 500);   
                                            } else {
                                                    if(updated['status']=='error'){
                                                            _message = 'Not Update IdeaNo. '+ maildata.ideanumber + ' to wait approve :' + updated['error'].toString()
                                                            _page.api.CallProcedure('public.insert_notifications',{project_id:_page.ProjectDetail.id, user_id:_page.UserInfo.id,textmessage:_message }).subscribe(function(output){
                                                                console.log('insert_notifications:',output)                                                          
                                                                    })
                                                                     setTimeout(() => {
                                                                        window.document.location.reload()        
                                                                }, 500);
                                                    }
                                                    else{
            
                                                    }
                                            }
                                      })
                        }  
    }

    SendMailToCoordinator(maildata:any){
        const _page = this
        let _mailconfig:any = {}
        let _idea_by :datalist = _page.memberlist.filter(function(ib:datalist){   return ib.value == _page.ProjectDetail.idea_by })[0] 
        maildata.cc_email.push(_idea_by)
        _mailconfig['from'] = '"' + maildata.from + '" <' + maildata.from_email + '>;'
        if(maildata.to_email.length>1){
                let _reciver='['
                for (let index = 0; index < maildata.to_email.length; index++) {
                        const reciver =  maildata.to_email[index];
                        _reciver   = _reciver + '"' + reciver.display + '" <' + reciver.email + '>;'
                }
                _mailconfig['to'] =_reciver + ']'
        } else {
                if(maildata.to_email[0]){
                        _mailconfig['to'] = maildata.to_email[0].display + ' <' + maildata.to_email[0].email + '>;'
                }
                
        }
        if(maildata.cc_email.length>1){
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
                
        }
        _mailconfig['subject'] =  maildata.Subject      
        _mailconfig['text'] = maildata.dear + '\n' + '\t\t' +  maildata.detail
        let _html:string = ''
        _html = _html + '<p>' +  maildata.dear + '</p> ';
        _html = _html + '<p> &emsp; &emsp;'  +  maildata.detail + '</p> ';
        _html = _html + '<p>'+ maildata.notify +'</p> ';
        _html = _html + '<p  style="font-weight: bolder;" >' + maildata.Please + '</p>' ;
        _html = _html + '<p> Link to Brainbox : <a href="' + maildata.linkidea + '"> ' + maildata.linkidea + '</a></p>  ' ;
        // _html = _html + '<p>Note:Please copy this link and open in Google Chrome</p>';
        _html = _html + '<br>';
        _html = _html + '<p>Best Regards</p>';
        _html = _html + '<p> ' + maildata.from + '</p>';
        
        _mailconfig['html'] =  _html
       
        this.api.sendMail(_mailconfig.from,_mailconfig.to,_mailconfig.cc,_mailconfig.subject,_mailconfig.text,_mailconfig.html,{}).subscribe(function(m){
            //console.log(m)
                if(m['status']=="success"){
                        _page.snackBar.openSnackBar('Email is successfully sent. ', 'OK', 'center', 'top', 'snack-style')
                        if(!maildata.isBackground){
                                _page.api.CallProcedure('public.update_project_implement',{project_id:_page.ProjectDetail.id, target:_page.UserInfo.id }).subscribe(function(updated){
                                    //console.log('update_project_implement:',updated)
                                        let _message:string =''
                                          if(!updated['status']){                                   
                                                      
                                                      for (let index = 0; index < _page.ProjectDetail.coordinators_detail.length; index++) {
                                                              const _approvers:any = _page.ProjectDetail.coordinators_detail[index];
                                                              let _message
                                                              _message =  _page.ProjectDetail.title  + ' has been implementedand waiting for your approval.' 
                                                              _page.api.CallProcedure('public.insert_notifications',{project_id:_page.ProjectDetail.id, user_id:_approvers.value,textmessage:_message }).subscribe(function(output){
                                                                  //console.log('insert_notifications:',output)                                                          
                                                                      })    
                                                      }
                                                     
      
                                               setTimeout(() => {
                                                      window.document.location.reload()        
                                              }, 500)  
                                              } else {
                                                      if(updated['status']=='error'){
                                                              _message = 'Not Update IdeaNo. '+ maildata.ideanumber + ' to wait approve :' + updated['error'].toString()
                                                              _page.api.CallProcedure('public.insert_notifications',{project_id:_page.ProjectDetail.id, user_id:_page.UserInfo.id,textmessage:_message }).subscribe(function(output){
                                                                  //console.log('insert_notifications:',output)                                                          
                                                                      })
                                                      }
                                                      else{
              
                                                      }
                                              }
      
                                           
      
         
                                      
                              })  
                              
                        } else {
                                for (let index = 0; index < _page.ProjectDetail.coordinators_detail.length; index++) {
                                        const _approvers:any = _page.ProjectDetail.coordinators_detail[index];
                                        let _message
                                        _message =  _page.ProjectDetail.title  + ' has been implemented and waiting for your approval.' 
                                        _page.api.CallProcedure('public.insert_notifications',{project_id:_page.ProjectDetail.id, user_id:_approvers.value,textmessage:_message }).subscribe(function(output){
                                            //console.log('insert_notifications:',output)                                                          
                                                })    
                                }
                               

                         setTimeout(() => {
                                window.document.location.reload()        
                        }, 500)    
                        }
                        
                      
                        
                } else {
                        _page.snackBar.openSnackBar('Error sent Email. ' +  JSON.stringify(m) , 'OK', 'center', 'top', 'snack-style')
                }
        })
    }

    SendMailToIdeaOwn(maildata:any){
        const _page = this
        let _mailconfig:any = {}
        _mailconfig['from'] = '"' + maildata.from + '" <' + maildata.from_email + '>;'
        if(maildata.to_email.length>1){
                let _reciver='['
                for (let index = 0; index < maildata.to_email.length; index++) {
                        const reciver =  maildata.to_email[index];
                        _reciver   = _reciver + '"' + _page.NameOnly(reciver) + '" <' + reciver.email + '>;'
                }
                _mailconfig['to'] =_reciver + ']'
        } else {
                if(maildata.to_email[0]){
                        _mailconfig['to'] = maildata.to_email[0].display + ' <' + maildata.to_email[0].email + '>;'
                }
                
        }
        if(maildata.cc_email.length>1){
                let _reciver='['
                for (let index = 0; index < maildata.cc_email.length; index++) {
                        const reciver =  maildata.cc_email[index];
                        _reciver   = _reciver + '"' + reciver.display + '" <' + reciver.email + '>;'
                }
                _mailconfig['cc'] =_reciver + ']'
        } else {
                if(maildata.cc_email.length==1){
                _mailconfig['cc'] = maildata.cc_email[0].display + ' <' + maildata.cc_email[0].email + '>;'
                } else {
                        _mailconfig['cc'] =''
                }
                
        }
        _mailconfig['subject'] =  maildata.Subject      
        _mailconfig['text'] = maildata.dear + '\n' + '\t\t' +  maildata.detail
        let _html:string = ''
        _html = _html + '<p>' +  maildata.dear + '</p> ';
        _html = _html + '<p> &emsp; &emsp;'  +  maildata.detail + '</p> ';
        _html = _html + '<p>'+ maildata.notify +'</p> ';
        _html = _html + '<p  style="font-weight: bolder;" >' + maildata.Please + '</p>' ;
        _html = _html + '<p> Link to Brainbox : <a href="' + maildata.linkidea + '"> ' + maildata.linkidea + '</a></p>  ' ;
        // _html = _html + '<p>Note:Please copy this link and open in Google Chrome</p>';
        _html = _html + '<br>';
        _html = _html + '<p>Best Regards</p>';
        _html = _html + '<p> ' + maildata.from + '</p>';
        
        _mailconfig['html'] =  _html
       
        this.api.sendMail(_mailconfig.from,_mailconfig.to,_mailconfig.cc,_mailconfig.subject,_mailconfig.text,_mailconfig.html,{}).subscribe(function(m){
            //console.log('sendMail:',m)
                if(m['status']=="success"){                         
                        
                } else {
                        _page.snackBar.openSnackBar('Error sent Email. ' +  JSON.stringify(m) , 'OK', 'center', 'top', 'snack-style')
                }
        })
    }
    setScreenSize(){
       const that=this 
       /*  switch (that.currentScreenSize) {
            case 'XLarge': 
                    that.cols=3;              
                    break;
            case 'Large': 
                    that.cols=3 ;
                    that.captionlevelfontsize='large';
                    that.RankingSize= 'Large'; 
                    that.totalNumber = 'large'
                    that.totallabel = 'x-small'
                    that.WelcomelabelfontSize ='32px'
                    that.UserNamelabelfontSize ='25px'
                    break;
            case 'Medium': 
                    that.cols=3;that.captionlevelfontsize='medium';
                    that.RankingSize= 'Medium';  
                    that.totalNumber = 'small'
                    that.totallabel = 'xx-small'
                    that.WelcomelabelfontSize ='25px'
                    that.UserNamelabelfontSize ='20px'
                    break;
            case 'Small': 
                    that.cols=3; that.captionlevelfontsize='medium'; 
                    that.RankingSize= 'Small'; 
                    that.totalNumber = 'x-small'
                    that.totallabel = 'xx-small'
                    that.WelcomelabelfontSize ='25px'
                    that.UserNamelabelfontSize ='20px'
                    break;
            case 'XSmall': 
                    that.cols=1;that.captionlevelfontsize='Smaller'; 
                    that.RankingSize= 'Large';                             
                    that.WelcomelabelfontSize ='32px'
                    that.UserNamelabelfontSize ='25px'
                    break;
            
        
            default:
                break;
        }
        setTimeout(() => {
            
            that.HomePage.next({eventname:'ChangeScreenSize',value:{RankingSize:that.RankingSize} })
        }, 200); */
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
   
}
