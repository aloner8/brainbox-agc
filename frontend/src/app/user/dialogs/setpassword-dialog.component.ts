import {Component, Inject, OnInit} from '@angular/core';
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
import {FormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { OnlyNumber } from '../../only-number.directive';

export interface DialogData {
  
  name: string;
  email: string;
  username: string;
  fullname: string;  
  otp: string;
  password: string;
 
}
 

@Component({
    selector: 'setpassword-dialog',
    templateUrl: './setpassword-dialog.component.html',
    styleUrls: ['./setpassword-dialog.component.css'] ,
     standalone: true,
     
    imports: [
      MatFormFieldModule,
      MatInputModule,
      FormsModule,
      MatButtonModule,
      MatDialogTitle,
      MatDialogContent,
      MatDialogActions,
      MatDialogClose 
    ],
})
export class SetPasswordComponent implements OnInit {

    constructor(
        public dialogRef: MatDialogRef<SetPasswordComponent>,
        @Inject(MAT_DIALOG_DATA) public data: DialogData,
      ) {}
    ngOnInit(): void {
       // throw new Error('Method not implemented.');
    }
    
      onNoClick(): void {
        this.dialogRef.close();
      }
      onSendMailClick(): void {
        this.dialogRef.close(this.data);
      }
      onSaveClick(): void {
        
        if(!this.data.otp  || this.data.otp.length != 6 ){
          alert('Otp must 6 digit')
        } else {
          this.dialogRef.close(this.data);
        }
        if(!this.data.password  || this.data.password.length < 8 ){
          alert('password ต้องมากกว่า 8 ตัวอักษร')
        } else {
          this.dialogRef.close(this.data);
        } 
        
      }
}









