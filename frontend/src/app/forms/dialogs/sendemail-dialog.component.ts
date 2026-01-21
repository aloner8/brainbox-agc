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
import {AbstractControl, FormBuilder, FormControl, FormGroup, FormsModule} from '@angular/forms';
 
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatChip, MatChipInputEvent } from "@angular/material/chips";
import { map, Observable, startWith } from 'rxjs';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import {COMMA, ENTER, T} from '@angular/cdk/keycodes';
import {AsyncPipe} from '@angular/common';
import {LiveAnnouncer} from '@angular/cdk/a11y';
import { SnackBarService } from '../../snack-bar/snack-bar.service';
import { VariablesService } from '../../variables.service';
import { NgxEditorComponent,Editor, Validators,Toolbar } from 'ngx-editor';


export interface sendMailDialogData {
  from: string,
  to: string,
  cc: any,
  Subject: string,
  dear:string,
  detail:string,
  ideanumber:string,
  createdate:string,
  linkidea:string,
  from_email: string,
  to_email: any,  
  cc_email: any,  
  cc_external:any,
  member_list:any,
  notify:string,
  Please:string,
  state_id:number
  send_next:string,
  send_at: string ,
  repeat_time: number 
}

export interface datalist {
  value:number;
  display: string;
  object: any;
  email?:string
}
 
@Component({
    selector: 'sendemail-dialog',
    templateUrl: './sendemail-dialog.component.html',
    styleUrls: ['./sendemail-dialog.component.css'],
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
export class SendemailDialogComponent  {
 
  memberteam:datalist[] =[]
  memberlist:datalist[] =[]
  to_list:datalist[] =[]
  cc_list:datalist[] =[]
  cc_external:string[] = []
  hideSingleSelectionIndicator = signal(false);
  readonly addOnBlur = true;
  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  blankList:datalist = {value:0,display:'-',object:{}}

  readonly announcer = inject(LiveAnnouncer);
  myControl = new FormControl<datalist>(this.blankList);
  myControlEx = new FormControl<string>('');
  ContextControl = new FormControl<string>('');
  options: datalist[] = [];


    filteredOptions: Observable<datalist[]> =this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => {
        const display = typeof value === 'string' ? value : value?.display;
        return display ? this._filter(display as string) : this.options.slice();
      }),
    ); 
  
      editor!: Editor;
  html = '';
   htmledit = '';
 
  
    constructor(
        public dialogRef: MatDialogRef<SendemailDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: sendMailDialogData,
        private snackBar:SnackBarService,
        private AppService:VariablesService
      ) {
        dialogRef.disableClose=true;
        
      }
    ngOnInit(): void {
      const _dialog = this
  //console.log(this.data)
     // this.memberlist = this.data['member_list']
      this.memberlist = this.AppService.getVariable('datalistsources')['all_member_list']
        //throw new Error('Method not implemented.');
        this.to_list = this.data['to_email']
        this.cc_list = this.data['cc_email']
    //console.log('this.data.detail',this.data.detail)
          this.editor = new Editor();
  
         this.html = this.data.detail

         this.editor.valueChanges.subscribe(function(et){
          
          
          _dialog.editor.setContent(et);
           
        //  console.log('editor.valueChanges:',  _dialog.html)
          //_dialog.data.detail =et.
         })

    
        _dialog.editor.update.subscribe(function(et){
          _dialog.htmledit = _dialog.editor.view.dom.innerHTML.toString();
       //console.log('editor.update:', _dialog.editor.view.dom.innerHTML)
        })

  }
  
 
    
    private _filter(name: string): datalist[] {
      const filterValue = name.toLowerCase();
  
      return this.memberlist.filter(option => option.display.toLowerCase().includes(filterValue));
    }
      onNoClick(): void {        
        this.dialogRef.close();
      }

      sendemail(): void {

       // this.data.detail = this.ContextControl.value?this.ContextControl.value:''
        this.data.cc_email = this.cc_list
        this.cc_external.forEach(element => {
          let _newmail:datalist  =  {display:element,value:0,object:{},email:element}
          this.data.cc_email.push(_newmail)
        });
      //  this.data.cc = this.memberteam
     // this.htmledit = this.editor.view.dom.innerHTML;
  //console.log('this.htmledit=',this.htmledit)
      if(  this.htmledit != '' ){
        this.data.detail = this.htmledit
        
      }
        this.dialogRef.close(this.data);
      }
      displayFn(user: datalist): string {
        return user && user.display ? user.display : '';
      }

      
    add(event: MatChipInputEvent): void {
      const value:any = (event.value );
      //console.log('MatChipInputEvent:',event)
      //console.log('myControl:',this.myControl.getRawValue())
       if(value.email){
        if(this.validateEmail(value.email)){
          this.cc_list.push(value)
        } else {
          this.snackBar.openSnackBar('not email format. ', 'OK', 'center', 'top', 'snack-style')
        }
        
       } else {
        //this.snackBar.openSnackBar('not email format. ', 'OK', 'center', 'top', 'snack-style')
       }
      
      // Clear the input value
  //console.log(' this.cc_list:', this.cc_list)

      event.chipInput!.clear();
    }
    addEx(event: MatChipInputEvent): void {
      const value = (event.value ).trim();
  //console.log('MatChipInputEvent:',event)
  //console.log('myControl:',this.myControlEx.getRawValue())
      if(this.validateEmail(value)){
        this.cc_external.push(value)
      } else {
        this.snackBar.openSnackBar('not email format. ', 'OK', 'center', 'top', 'snack-style')
      }
    
  
      // Clear the input value
      event.chipInput!.clear();
    }
  
    remove(fruit: datalist): void {
  //console.log(fruit)
       

        const index = this.cc_list.indexOf(fruit); 
       
        this.cc_list.splice(index, 1);
        this.announcer.announce(`Removed ${fruit.display}`);

          
    }
    removeEx(ccmail: string): void {
  //console.log(ccmail)
       

        const index = this.cc_external.indexOf(ccmail); 
       
        this.cc_external.splice(index, 1);
        this.announcer.announce(`Removed ${ccmail}`);

          
    }
    validateEmail(email:string) {

      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      
      return emailPattern.test(email);
      
      }
 

      MemberSelected(event:any){
    //console.log(event.option.value)
        let exists = this.cc_list?.filter(function(m) { return m.value == event.option.value.value } )[0]
        if(!exists){
          let _nameonly = event.option.value.display.split(']',2)[1]
          _nameonly = _nameonly.split('[',2)[0]
          let _seleted   =  {display:_nameonly,value:event.option.value.value,object:{new:true},email:event.option.value.email }
          if(!this.cc_list){ this.cc_list=[]}
          if(_seleted.display){
            this.cc_list.push(_seleted)
          }
          
        }
        
        this.myControl.setValue(null)
  
      }

}









