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
import {FormBuilder, FormControl, FormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatChip, MatChipInputEvent } from "@angular/material/chips";
import { map, Observable, startWith } from 'rxjs';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {AsyncPipe} from '@angular/common';
import {LiveAnnouncer} from '@angular/cdk/a11y';
import { MatListOption } from '@angular/material/list';
import { DatePipe } from "@angular/common";

export interface NotificationDialogData {
  id:number,
  datealert:Date,
  user_id:number,
  project_id:number,
  textmessage:string,
  readed:boolean
}

export interface datalist {
  value:number;
  display: string;
  object: any;
}
 
@Component({
    selector: 'notification-dialog',
    templateUrl: './notification-dialog.component.html',
    styleUrls: ['./notification-dialog.component.css'],
})
export class NotificationDialogComponent  {
 
  memberteam:NotificationDialogData[] =[]
  memberlist:NotificationDialogData[] =[]
  selectedOptions:any =[]
  selected:any = {}
  
    constructor(
        public dialogRef: MatDialogRef<NotificationDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: NotificationDialogData[],
        private dateformat:DatePipe,
      ) {
        dialogRef.disableClose=false;
        
      }
    ngOnInit(): void {
  //console.log(this.data)
      this.memberlist = this.data

         
    }

    
    
      onNoClick(): void {        
        this.dialogRef.close();
      }

      onReadAllClick(): void { 
        this.memberlist = []   
        setTimeout(() => {
          this.dialogRef.close('readall');
        }, 500);    
        
      }

      Close(): void {

        if(this.selected ){
          this.dialogRef.close(this.selected);
        } else {
          this.dialogRef.close();
        }
        

        //this.textmessage.selectedOptions.selected
      }

      selectionChange(event:any){
          let _seleted = event.options.filter(function(o:MatListOption){ return o.selected ==true}) 
      //console.log(_seleted)
          this.selected =   _seleted[0]._value        
      //console.log(this.selected )

          if(this.selected ){
            this.dialogRef.close(this.selected);
          } 
      }
      
      

}









