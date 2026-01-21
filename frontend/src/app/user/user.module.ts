import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserDetailComponent } from './user-detail/user-detail.component';
import { LoginComponent } from './login/login.component';
import { PermissionComponent } from './permission/permission.component';
import { UserService } from './user.service';
import { MatlibModule } from '../matlib.module';
 import { EnterAsTabDirective } from '../enter-as-tab.directive';

@NgModule({
  declarations: [
    UserDetailComponent,
    LoginComponent,
    PermissionComponent,
     EnterAsTabDirective,
    
  ],
  imports: [
    CommonModule,
    MatlibModule
  ],
  exports: [
    UserDetailComponent,
    LoginComponent,
    PermissionComponent,

      
  ],
  providers:[UserService]
})
export class UserModule { }
