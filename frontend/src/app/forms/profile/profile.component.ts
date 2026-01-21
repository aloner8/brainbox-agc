import {Component, Input, OnInit} from '@angular/core';
import {Observable, Subject} from "rxjs";
import {map} from "rxjs/operators";
import {VariablesService} from '../../variables.service'
import { ApiService } from '../../api.service';
import { UserService } from '../../user/user.service';
import {FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import { FloatLabelType } from '@angular/material/form-field';
import { datalist } from '../config/table-list-user/user-dialog.component';

export interface UserDetailDialogData {
  "id": number
  ,"username":string
  ,"name":string
  ,"initial":string
  ,"email":string
  ,"department_master_id":number
  ,"division":string      


  ,"isapprover":number
  ,"iscoordinator":number
  ,"isadmin":number
  ,"default_coordinator":number
  ,"active":number
  ,"created_at":string
  ,"updated_at":string
  ,"user_id_code":string
  ,"location":string
  ,"site":string
  ,"own_ideas":number
  ,"my_participate":number
  ,"my_level":string
  
  ,"default_approver":any
  ,"profile_filepath":string
  ,"profile_filename":string
  ,"profile_filetype":string  
  ,IsAdmin:boolean
  
}

@Component({
    selector: 'cus-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

    @Input() UserInfo:any = {}
    
    ProfileForm = this.fb.group({     
        fullname :[''],       
        division : [''],        
        email : [''],
    })
  

    BaseHref = ''
    UserForm = this.fb.group({ 
  "id": [0]
    ,"username":['']
    ,"name":['']
    ,"initial":['']
    ,"email":['']
    ,"department_master_id":[0]
    ,"division":['']        


    ,"isapprover":[0]
    ,"iscoordinator":[0]
    ,"isadmin":[0] 
    ,"default_coordinator":['']
    ,"active":[0]
    ,"created_at":['']
    ,"updated_at":['']
    ,"user_id_code":['']
    ,"location":['']
    ,"site":['']
    ,"own_ideas":[0]
    ,"my_participate":[0]
    ,"my_level":['']
    
    ,"default_approver":['']
    ,"profile_filepath":['']
    ,"profile_filename":['']
    ,"profile_filetype":['']          
  })
  approverlist:datalist[] = []
  coordinatorlist:datalist[] = []
  
  default_coordinator:string=''
  default_approver:string=''

    constructor(private AppService:VariablesService , private API:ApiService,private user:UserService ,private fb: FormBuilder) {
        
    }

    ngAfterViewInit(): void {
        //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
        //Add 'implements AfterViewInit' to the class.
      //  console.log('ngAfterViewInit')

     // this.UserInfo = this.AppService.getVariable('UserHome')
    //console.log( this.UserInfo)
        //this.ProfileForm.setValue({fullname:this.UserInfo.name,division: this.UserInfo.division,email:this.UserInfo.email})
      }

    ngOnInit() {
      const  that = this
    //  console.log('ngOnInit')
    this.BaseHref = this.API.getBaseHref();
                   this.approverlist =  this.AppService.getVariable('datalistsources')['appover_list']
               this.coordinatorlist =   this.AppService.getVariable('datalistsources')['coordinator_list']
    /*     this.AppService.AppVars.subscribe(function(v:any){
            that.ProfileForm.setValue({fullname:that.UserInfo.name,division: that.UserInfo.division,email:that.UserInfo.email})
        }) */

            setTimeout(() => {
                 let data = this.AppService.getVariable('UserHome')
                 console.log(data)

     
  this.default_coordinator = this.coordinatorlist.filter(function(co){ return co.value== data.default_coordinator })[0]?.display
    this.default_approver = this.approverlist.filter(function(aa){ return aa.value== data.default_approver })[0]?.display
  
  

                  this.UserForm.setValue({
      "id": data.id
      ,"username": data.username
      ,"name": data.name
      ,"initial": data.initial
      ,"email": data.email
      ,"department_master_id": data.department_master_id
      ,"division": data.division      
  
  
      ,"isapprover": data.isapprover
      ,"iscoordinator": data.iscoordinator
      ,"isadmin": data.isadmin
      ,"default_coordinator":this.default_coordinator?this.default_coordinator:''
      ,"active": data.active
      ,"created_at": data.created_at
      ,"updated_at": data.updated_at
      ,"user_id_code": data.user_id_code
      ,"location": data.location
      ,"site": data.site
      ,"own_ideas": data.own_ideas
      ,"my_participate": data.my_participate
      ,"my_level": data.my_level
      
      ,"default_approver": this.default_approver?this.default_approver:''
      ,"profile_filepath": data.profile_filepath
      ,"profile_filename": data.profile_filename
      ,"profile_filetype": data.profile_filetype  
        
    }) 
      
            }, 500);
      
    //console.log( this.UserInfo)
        //this.ProfileForm.setValue({fullname:this.UserInfo.name,division: this.UserInfo.division,email:this.UserInfo.email})
 this.UserForm.disable()
       
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
   

   

}
