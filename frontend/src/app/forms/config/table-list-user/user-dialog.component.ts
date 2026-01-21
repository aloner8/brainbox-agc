import {Component, inject, Inject, OnInit, signal} from '@angular/core';
import {
  MatDialog,
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions,
  MatDialogClose,
} from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material/button';
import {FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatChip, MatChipInputEvent } from "@angular/material/chips";
import { map, Observable, startWith } from 'rxjs';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {AsyncPipe, DatePipe} from '@angular/common';
import {LiveAnnouncer} from '@angular/cdk/a11y';
import { ApiService } from '../../../api.service';
import { UserService } from '../../../user/user.service';
import { SnackBarService } from '../../../snack-bar/snack-bar.service';
import { VariablesService } from '../../../variables.service';
 


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

export interface datalist {
  value:number;
  display: string;
  object: any;
}
 
@Component({
    selector: 'user-dialog',
    templateUrl: './user-dialog.component.html',
    styleUrls: ['./user-dialog.component.css'],
   // standalone: true,
  /*   imports: [
      MatFormFieldModule,
      MatInputModule,
      FormsModule,
      MatButtonModule,
      MatDialogTitle,
      MatDialogContent,
      MatDialogActions,
      MatDialogClose,
      MatChip,
      MatAutocompleteModule,
      
      
    ],
    providers:[AsyncPipe,LiveAnnouncer ] */
})
export class UserDetailDialogComponent  {
 
  memberteam:datalist[] =[]
  memberlist:datalist[] =[]
  to_list:datalist[] =[]
  hideSingleSelectionIndicator = signal(false);
  readonly addOnBlur = true;
  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  blankList:datalist = {value:0,display:'-',object:{}}

  readonly announcer = inject(LiveAnnouncer);
  myControl = new FormControl<datalist>(this.blankList);
  ContextControl = new FormControl<string>('');
  options: datalist[] = [];
  listseleted:number = 1;
  comment:string = ''
  showRemark:boolean=true
  showYes:boolean=false
  showNo:boolean=false
  showQuetion:boolean=false
  showSelectDoc:boolean=false
  MOC:boolean=false
  WI:boolean=false
  OTHER:boolean=false
  DOC:string = ''
  MOCDOC:string = ''
  WIDOC:string = ''
  
  showCaptionHerder:boolean = true
  iconname:string ='info'
  remake_require:boolean=false
  showErrorLabel:boolean=false
  ErrorLabel:string = ''
  departmentlist:any =[]
  department_master_id:number=0
    approverlist:datalist[] = []
    coordinatorlist:datalist[] = []
    coordinafilter:any
    approverfilter:any
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
    ,"default_coordinator":[0]
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
   ControlApprove_1 = new FormControl<datalist>(this.blankList);
      filteredApprove_1: Observable<datalist[]> =this.ControlApprove_1.valueChanges.pipe(
        startWith(''),
        map(value => {
          const display = typeof value === 'string' ? value : value?.display;
          return display ? this._filterApprove(display as string) : this.approverlist.slice();
        }),
      ); 
    ControlCoordinator_1 = new FormControl<datalist>(this.blankList);
        filteredCoordinator_1: Observable<datalist[]> =this.ControlCoordinator_1.valueChanges.pipe(
          startWith(''),
          map(value => {
            const display = typeof value === 'string' ? value : value?.display;
            return display ? this._filterCoordinator(display as string) : this.coordinatorlist.slice();
          }),
        ); 

    constructor(
        public dialogRef: MatDialogRef<UserDetailDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private dateformat:DatePipe, 
        private API:ApiService
        ,private user:UserService 
        ,private fb: FormBuilder
        , private snackBar:SnackBarService
        ,private VarService:VariablesService
        
      ) {
        dialogRef.disableClose=true;
        
      }
    ngOnInit(): void {
      const _dialog = this
  //console.log(this.data)
      let _list_filter = _dialog.VarService.getVariable('datalistsources') 
      if(_list_filter){   
        _dialog.departmentlist = _list_filter['department_list']
        _dialog.coordinatorlist = _list_filter['coordinator_list']    
        _dialog.approverlist = _list_filter['appover_list']
      }
      _dialog.UserForm.setValue({
      "id": this.data.id
      ,"username": this.data.username
      ,"name": this.data.name
      ,"initial": this.data.initial
      ,"email": this.data.email
      ,"department_master_id": this.data.department_master_id
      ,"division": this.data.division      
  
  
      ,"isapprover": this.data.isapprover
      ,"iscoordinator": this.data.iscoordinator
      ,"isadmin": this.data.isadmin
      ,"default_coordinator": this.data.default_coordinator
      ,"active": this.data.active
      ,"created_at": this.data.created_at
      ,"updated_at": this.data.updated_at
      ,"user_id_code": this.data.user_id_code
      ,"location": this.data.location
      ,"site": this.data.site
      ,"own_ideas": this.data.own_ideas
      ,"my_participate": this.data.my_participate
      ,"my_level": this.data.my_level
      
      ,"default_approver": this.data.default_approver
      ,"profile_filepath": this.data.profile_filepath
      ,"profile_filename": this.data.profile_filename
      ,"profile_filetype": this.data.profile_filetype  
        
    })  
    _dialog.coordinafilter=this.data.default_coordinator
    _dialog.approverfilter=this.data.default_approver
    let _begin_division = _dialog.departmentlist.filter(function(d:datalist){ return d.value ==  _dialog.data.department_master_id})
    _dialog.myControl.setValue(_begin_division[0])
    _dialog.department_master_id = _dialog.data.department_master_id
   

    let _approver_1 = this.approverlist.filter(function(a1:datalist){   return a1.value == _dialog.data.default_approver })    
    this.ControlApprove_1.setValue(_approver_1[0])
//console.log(_dialog.department_master_id, '==',_approver_1[0])
    let _default_coordinator = this.coordinatorlist.filter(function(c1:datalist){   return c1.value == _dialog.data.default_coordinator }) 
    this.ControlCoordinator_1.setValue(_default_coordinator[0])


    _dialog.UserForm.disable()
    this.myControl.disable()
    this.ControlApprove_1.disable()
    this.ControlCoordinator_1.disable()


  }
  ApproverChange(e:any){

  }
  coordinatorChange(e:any){

  }
          displayFnMember(user: datalist): string {
            return user && user.display && user.display.split(']')[1] && user.display.split(']')[1].split('[')[0]? user.display.split(']')[1].split('[')[0] : '';
            
            
          }
    onEdit(){
      this.UserForm.enable()
      this.UserForm.controls.id.disable()
       this.UserForm.controls.user_id_code.disable()
      this.UserForm.controls.created_at.disable()
      this.UserForm.controls.updated_at.disable()
      this.myControl.enable()
      this.ControlApprove_1.enable()
      this.ControlCoordinator_1.enable()
     
    }
    private _filter(name: string): datalist[] {
      const filterValue = name.toLowerCase();
  
      return this.memberlist.filter(option => option.display.toLowerCase().includes(filterValue));
    }
      onCloseClick(): void {        
        this.dialogRef.close();
      }



      onSubmit(): void {   
        
        this.dialogRef.close(this.data);        
    //console.log(this.data)
       
      }
      onConfirm(): void {   
       
    //console.log( this.UserForm.getRawValue())
        this.dialogRef.close( this.UserForm.getRawValue());        
       
       
      }
      
      displayFn(user: datalist): string {
        return user && user.display ? user.display : '';
      }

      listseletedChange(event:any){

        //listseletedChange
      }
      
    add(event: MatChipInputEvent): void {
      const value = (event.value ).trim();
  //console.log('MatChipInputEvent:',event)
  //console.log('myControl:',this.myControl.getRawValue())
      
  
      // Clear the input value
      event.chipInput!.clear();
    }
  
    remove(fruit: datalist): void {
  //console.log(fruit)
       

        const index = this.memberteam.indexOf(fruit); 
       
        this.memberteam.splice(index, 1);
        this.announcer.announce(`Removed ${fruit.display}`);

          
    }

    onOkClick(){
      if(this.data.Caption=='APPROVE IDEA') {

        if( this.showRemark == true){
          if (this.comment=='No comment' || this.comment==''){
            this.comment='Approver ไม่ต้องการเลือก Approver คนต่อไป'
            
          } else {
  
          }
  
          this.showRemark=false
          this.data.showok=false
          this.data.showcancel=false
         // this.data.showback=false
          this.showCaptionHerder=false
          //this.showSelectDoc=true
          this.showQuetion = true
          
          this.showYes=true
          this.showNo=true
        } else{
          if( this.showSelectDoc== true){

            this.data.action="Confirm Approve With Document"
            this.data.selectDoc =  {MOC:this.MOC,WI:this.WI,OTHER:this.OTHER,DOC:this.DOC}
            this.data.Comment = this.comment
            this.dialogRef.close(this.data)
           
          }
        }

       

      }
      if(this.data.Caption=='APPLIED IDEA') {
        this.data.Comment = this.comment
        this.dialogRef.close(this.data)
      }

    }

    onYesClick(){
      if(this.data.Caption=='APPROVE IDEA') {
        
        this.showSelectDoc=true
        this.showQuetion = false
        
        this.showYes=false
        this.showNo=false
        this.data.showok=true
        this.data.showcancel=true

      }
    }

    CheckedChange(name:string){
  //console.log(name,'==' , this.UserForm.get(name)?.value )
      if( this.UserForm.get(name)?.value==true){
        this.UserForm.get(name)?.setValue(1)
      } else {
        this.UserForm.get(name)?.setValue(0)
      }
    
    }
    DivisionChange(e:any){
  //console.log(e)
    }
    onBackClick(){
      if(this.data.Caption=='APPROVE IDEA') {

        if(this.showSelectDoc==true){

          this.showSelectDoc=false
          this.data.showok=false
          this.data.showcancel=false

          this.showQuetion = true          
          this.showYes=true
          this.showNo=true

        } else{
          if(this.showQuetion==true){

            this.showRemark=true
            this.data.showok=true
            this.data.showcancel=true           
            this.showCaptionHerder=true

            
            this.showQuetion = false            
            this.showYes=false
            this.showNo=false
  
          } else{
            this.dialogRef.close()
          }
        }
        


      }
    }
    onNoClick(): void {        
      if(this.data.Caption=='APPROVE IDEA') {

        if(this.showQuetion==true){
          this.data.action="Confirm Approve"
          this.data.selectDoc =  {}
          this.data.Comment = this.comment
          this.dialogRef.close(this.data)
        } else {
          this.dialogRef.close()
        }
      }
    }

    APPLIEDConfirm(yes:string){
      if(yes=='yes'){
        this.data.action='Confirm Applied'
      } else {
        this.data.action='Not Confirm Applied'
      }

      this.showCaptionHerder=true
      this.showRemark=true
      this.data.showok =true
      this.data.showcancel=false
    }

          private _filterApprove(name: string): datalist[] {
            const filterValue = name.toLowerCase();      
          // console.log(this.approverlist)
            return this.approverlist.filter(option => option.display.toLowerCase().includes(filterValue));
          }
    
              private _filterCoordinator(name: string): datalist[] {
                const filterValue = name.toLowerCase();      
             //  console.log(this.approverlist)
                return this.coordinatorlist.filter(option => option.display.toLowerCase().includes(filterValue));
              }

}









