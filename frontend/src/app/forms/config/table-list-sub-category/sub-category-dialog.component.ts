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


export interface LevelDetailDialogData {
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
  
}

export interface datalist {
  value:number;
  display: string;
  object: any;
}
 
@Component({
    selector: 'sub-category-dialog',
    templateUrl: './sub-category-dialog.component.html',
    styleUrls: ['./sub-category-dialog.component.css'],
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
export class SubCategoryDetailDialogComponent  {
 
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
  
    constructor(
        public dialogRef: MatDialogRef<SubCategoryDetailDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private dateformat:DatePipe, 
        
      ) {
        dialogRef.disableClose=true;
        
      }
    ngOnInit(): void {
  //console.log(this.data)
   
 
        
    }

    
    private _filter(name: string): datalist[] {
      const filterValue = name.toLowerCase();
  
      return this.memberlist.filter(option => option.display.toLowerCase().includes(filterValue));
    }
      onCloseClick(): void {        
        this.dialogRef.close();
      }



      onConfirm(): void {   
        
        this.dialogRef.close(this.data);        
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

}









