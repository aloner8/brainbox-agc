import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms'; // <-- NgModel lives here
import{MatlibModule} from '../matlib.module';

import{PagesMatComponent}from './pages-mat.component';
import {FormMatComponent} from '../form-mat/form-mat.component'
import {FormMatFieldComponent} from '../form-mat-field/form-mat-field.component'
import {FormMatCollectionComponent} from '../form-mat-collection/form-mat-collection.component'
import{ApiService} from '../api.service'
import {MenuLeftComponent} from '../menu-left/menu-left.component'
import {FormCustomModule} from '../forms/forms-custom.module'
import { VariablesService } from '../variables.service';
import { SnackBarComponent } from '../snack-bar/snack-bar.component';
import {NotificationDialogComponent } from "./dialog/notification-dialog.component";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [
   PagesMatComponent,FormMatComponent ,FormMatFieldComponent ,FormMatCollectionComponent,MenuLeftComponent
   ,NotificationDialogComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,  
    MatlibModule,
    FormCustomModule  
      
  ],
  exports:[PagesMatComponent,FormMatComponent,FormMatFieldComponent,FormMatCollectionComponent,MenuLeftComponent,NotificationDialogComponent],
  providers: [ ApiService,VariablesService,SnackBarComponent],
  bootstrap: []
})
export class PagesModule { }