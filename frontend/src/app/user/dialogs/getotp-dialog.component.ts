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

export interface DialogData {
  
  name: string;
  email: string;
  username: string;
  fullname: string;  
  otp: string;
 
}
 

@Component({
    selector: 'getotp-dialog',
    templateUrl: './getotp-dialog.component.html',
    styleUrls: ['./getotp-dialog.component.css'] ,
     standalone: true,
    imports: [
      MatFormFieldModule,
      MatInputModule,
      FormsModule,
      MatButtonModule,
      MatDialogTitle,
      MatDialogContent,
      MatDialogActions,
      MatDialogClose,
    ],
})
export class GetOTPDialogComponent implements OnInit {

    constructor(
        public dialogRef: MatDialogRef<GetOTPDialogComponent>,
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
}









