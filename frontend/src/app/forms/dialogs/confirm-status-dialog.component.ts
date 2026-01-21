import {Component, ElementRef, inject, Inject, OnInit, signal, ViewChild} from '@angular/core';
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
import {AsyncPipe} from '@angular/common';
import {LiveAnnouncer} from '@angular/cdk/a11y';

export interface ConfirmStatusDialogData {
  current_status:number,
  Caption: string,
  SubCaption: string,  
  caption_color: string,  
  Reason: string,
  Comment:string,
  selectDoc:any,
  action:string,
  showconfirm:boolean,
  showcancel:boolean,
  showapprove:boolean,
  shownotappove:boolean,
  showback:boolean,
  showok:boolean,
  ListLabel:string,
  ListSource:any,
  showIconHerder:boolean,
  showList:boolean,  
   approve_level:number,
  BaseHref:string,
}

export interface datalist {
  value:number;
  display: string;
  object: any;
}
 
@Component({
    selector: 'confirm-status-dialog',
    templateUrl: './confirm-status-dialog.component.html',
    styleUrls: ['./confirm-status-dialog.component.css'],
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
export class ConfirmStatusDialogComponent  {
 
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

   @ViewChild('otherdoc') otherdocInput!: ElementRef;
   
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
  BaseHref =''
    constructor(
        public dialogRef: MatDialogRef<ConfirmStatusDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: ConfirmStatusDialogData,
        
      ) {
        dialogRef.disableClose=true;
        
      }
    ngOnInit(): void {
  //console.log('this.data:',this.data)
  this.BaseHref = this.data.BaseHref;
    //console.log(this.to_list)
        this.comment = this.data.Comment
        if(this.data.Caption.indexOf('ASK MORE')>-1 ){
          this.iconname='question'
          this.ErrorLabel='You need to write reason!'
          this.ContextControl.setErrors({require:true})
        }

        if(this.data.Caption == 'NOT APPLIED IDEA'){
          this.iconname='question'
          this.ErrorLabel='You need to write reason!'
          this.ContextControl.setErrors({require:true})
        }

        if(this.data.Caption == 'APPLIED IDEA'){
          this.showCaptionHerder = false
          this.showRemark = false
        }

        if(this.data.Caption == 'APPROVE IDEA'){
          this.showRemark = true
          this.ErrorLabel='You need to write comment!'
          this.ContextControl.setErrors({require:true})
         // this.onYesClick()
        }
        if(this.data.Caption == 'Appile Save By Admin'){
          this.showRemark = true
          this.data.SubCaption='What have you changed this time?'
          this.ErrorLabel='You need to write comment!'
          this.ContextControl.setErrors({require:true})
         // this.onYesClick()
        }
        
        
    }

    
    private _filter(name: string): datalist[] {
      const filterValue = name.toLowerCase();
  
      return this.memberlist.filter(option => option.display.toLowerCase().includes(filterValue));
    }
      onCloseClick(): void {        
        this.dialogRef.close();
      }



      onConfirm(): void {   

        switch (this.data.Caption) {
          case 'APPROVE IDEA': 
               if(this.ContextControl.hasError('required') || this.comment.length < 1 ){
                this.showErrorLabel=true
                this.ContextControl.errors
                 this.ErrorLabel='You need to write Comment!'
              } else {
                this.data.Comment =this.comment
                this.data.action ="Confirm Approve" 
                this.dialogRef.close(this.data);
              }           

            break;
          
            case 'NOT APPROVE':
              if(this.ContextControl.hasError('required') || this.comment.length < 1 ){
                this.showErrorLabel=true
                this.ContextControl.errors
                 this.ErrorLabel='You need to write Comment!'
              } else {
          this.data.Reason =this.listseleted.toString()     
              this.data.Comment =this.comment
              this.data.action ="Confirm Not Approve"  
              this.dialogRef.close(this.data);   
              }

          
            break;
            case 'OWNER NOT IMPLEMENT IDEA':
                
              if(this.ContextControl.hasError('required') || this.comment.length < 1 ){
                this.showErrorLabel=true
                 this.ErrorLabel='You need to write Comment!'
                this.ContextControl.errors
              } else {
              this.data.Comment =this.comment
              this.data.action ="Confirm Not Implement"  
              this.dialogRef.close(this.data);  
              }   
     
            break;
            
            case 'ASK MORE EVIDENCE':
            
              if(this.ContextControl.hasError('required') || this.comment.length < 1 ){
                this.showErrorLabel=true
                this.ContextControl.errors
              } else {
                this.data.Reason =this.comment  
                this.data.Comment =this.comment
                this.data.action ="Confirm Ask more" 
                this.dialogRef.close(this.data);
              }

 
            break;
            case 'NOT APPLIED IDEA':
              if(this.ContextControl.hasError('required') || this.comment.length < 1 ){
                this.showErrorLabel=true
                this.ContextControl.errors
                 this.ErrorLabel='You need to write Comment!'
              } else {
                this.data.Reason =this.listseleted.toString()     
                this.data.Comment =this.comment
                this.data.action ="Confirm Not Applied"  
                this.dialogRef.close(this.data);   
              }
    
            break;
            case 'APPLIED IDEA':

              if(this.ContextControl.hasError('required') || this.comment.length < 1 ){
                this.showErrorLabel=true
                this.ContextControl.errors
                 this.ErrorLabel='You need to write Comment!'
              } else {
               this.data.Reason =this.listseleted.toString()     
              this.data.Comment =this.comment
              this.data.action ="Confirm Applied"  
              this.dialogRef.close(this.data);  
              }
   

            break;
              case 'Save By Admin':
             // this.data.Reason =this.listseleted.toString()     
              if(this.ContextControl.hasError('required') || this.comment.length < 1 ){
                this.showErrorLabel=true
                this.ContextControl.errors
                 this.ErrorLabel='You need to write Comment!'
              } else {
                          this.data.Comment =this.comment
              this.data.action ="Confirm Save By Admin"  
              this.dialogRef.close(this.data); 
              }
      
            break;          
            
          default:
            break;
        }



    //console.log(this.data)
       
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

        if( this.showSelectDoc != true){
      
   if(this.ContextControl.hasError('required') || this.comment.length < 1 ){
                this.showErrorLabel=true
                this.ContextControl.errors
                  this.ErrorLabel='You need to write Comment!'
              } else {
        this.showSelectDoc=true
        this.showQuetion = false
                      this.showErrorLabel=false
                this.ContextControl.enabled
                  this.ErrorLabel=''
        this.showYes=true
        this.showNo=true
        this.data.showok=false
        this.data.showcancel=false
        this.data.Comment = this.comment
        this.showRemark=false
        this.showCaptionHerder=false
              }
        //this.data.SubCaption = ''

       // this.showCaptionHerder=false

         /*  this.showRemark=false
          this.data.showok=false
          this.data.showcancel=false
         // this.data.showback=false
          this.showCaptionHerder=false
          //this.showSelectDoc=true
          this.showQuetion = true
          
          this.showYes=true
          this.showNo=true */
        } else{
         // if( this.showSelectDoc== true){
if(this.ContextControl.hasError('required') || this.comment.length < 1 ){
                this.showErrorLabel=true
                this.ContextControl.errors
                  this.ErrorLabel='You need to write Comment!'
              } else {
            this.data.action="Confirm Approve With Document"
           // this.data.selectDoc =  {MOC:this.MOC,WI:this.WI,OTHER:this.OTHER,DOC:this.DOC}
            this.data.Comment = this.comment
            this.dialogRef.close(this.data)
              }
           
         // }
        }  

       

      }
      if(this.data.Caption=='APPLIED IDEA') {
              if(this.ContextControl.hasError('required') || this.comment.length < 1 ){
                this.showErrorLabel=true
                this.ContextControl.errors
                  this.ErrorLabel='You need to write Comment!'
              } else {
               this.data.Reason =this.listseleted.toString()     
              this.data.Comment =this.comment
              this.data.action ="Confirm Applied"  
              this.dialogRef.close(this.data);  
              }

   
      }

    }

    onYesClick(){
      console.log(this.data.Caption)
      if(this.data.Caption=='APPROVE IDEA') {
        
        // this.showSelectDoc=true
        // this.showQuetion = false
        
        // this.showYes=false
        // this.showNo=false
        // this.data.showok=true
        // this.data.showcancel=true
 console.log(this.data.selectDoc)
          if(this.data.selectDoc.OTHER){
            if(this.data.selectDoc.DOC){
             if(this.data.selectDoc.DOC.trim()!=''){
            this.data.action="Confirm Approve With Document"
                  this.data.Comment = this.comment
                  this.dialogRef.close(this.data)
             
            } else {
             // console.log(this.data.selectDoc)
              this.showErrorLabel=true
              this.ErrorLabel='You need to enter name document!'
              this.otherdocInput.nativeElement.focus();

              //this.otherdocInput.nativeElement.setDirty();
            }
            } else {
               //             console.log(this.data.selectDoc)
                            this.showErrorLabel=true
                            this.ErrorLabel='You need to enter name document!'
              this.otherdocInput.nativeElement.focus();
               
            }
          } else {
             if(this.ContextControl.hasError('required') || this.comment.length < 1 ){
                  this.showErrorLabel=true
                  this.ContextControl.errors
                  this.ErrorLabel='You need to write Comment!'
              } else {
                    if(!this.data.selectDoc.MOC && !this.data.selectDoc.WI){
                      this.showErrorLabel=true
                      this.ContextControl.errors
                      this.ErrorLabel='You need select doc!'
                    } else {
                        this.data.action="Confirm Approve With Document"
                      // this.data.selectDoc =  {MOC:this.MOC,WI:this.WI,OTHER:this.OTHER,DOC:this.DOC}
                        this.data.Comment = this.comment
                        this.dialogRef.close(this.data)
                    }
              }
          }
         




      }
    }

/*       onYesClick(){
      if(this.data.Caption=='APPROVE IDEA') {
        
        this.showSelectDoc=true
        this.showQuetion = false
        
        this.showYes=false
        this.showNo=false
        this.data.showok=true
        this.data.showcancel=true

      }
    } */

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
      console.log(this.data.Caption)
      if(this.data.Caption=='APPROVE IDEA') {

        // if(this.showQuetion==true){
        //   this.data.action="Confirm Approve"
        //  // this.data.selectDoc =  {}
        //   this.data.Comment = this.comment
        //   this.dialogRef.close(this.data)
        // } else {
        //   this.dialogRef.close()
        // }
        this.data.Comment = this.comment
        this.data.selectDoc =  {}
         this.data.action="Confirm Approve"
        console.log(this.data)
        this.dialogRef.close(this.data)
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

}









