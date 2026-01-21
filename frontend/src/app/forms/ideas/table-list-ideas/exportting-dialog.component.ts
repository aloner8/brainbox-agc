import {Component, Inject} from '@angular/core';
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
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';

export interface DialogData {
  caption: string;
  totalrow: number;
  currentindex: number;
}
 

@Component({
  selector: 'exportting-dialog',
  templateUrl: 'exportting-dialog.component.html',
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
    MatProgressSpinnerModule
  ],
})
export class ExporttingDialog {
  constructor(
    public dialogRef: MatDialogRef<ExporttingDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
  ) {
    dialogRef.disableClose=true;
//console.log(data)
/*     setInterval(() => {
      if( data.currentindex == data.totalrow - 1 ){
        this.dialogRef.close();
      }
    }, 100); */
    
  }
  


  onNoClick(): void {
    this.dialogRef.close();
  }
}
