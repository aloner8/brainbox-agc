import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
//import { ServiceWorkerModule } from '@angular/service-worker';
import { FormsModule } from '@angular/forms'; // <-- NgModel lives here
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import{MatlibModule} from './matlib.module';
import{PagesModule} from './pages-mat/pages-mat.module';
import{UserModule} from './user/user.module';
import { ApiService } from './api.service';
import { SnackBarComponent } from './snack-bar/snack-bar.component';
import { ActivatedRoute } from '@angular/router';
import {AppRoutingModule} from './app.routes';
import {provideMomentDateAdapter} from '@angular/material-moment-adapter';
import { OnlyNumber } from './only-number.directive';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { CanvasJSAngularChartsModule } from '@canvasjs/angular-charts';
import { CurrencyMaskConfig, CurrencyMaskModule, CURRENCY_MASK_CONFIG } from "ng2-currency-mask";
import { RewardsComponent } from './rewards.component';

export const CustomCurrencyMaskConfig: CurrencyMaskConfig = {
    align: "right",
    allowNegative: true,
    decimal: ",",
    precision: 2,
    prefix: "",
    suffix: "",
    thousands: "."
};

@NgModule({
  declarations: [
    AppComponent,
    OnlyNumber,
     RewardsComponent
     
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    MatlibModule,
    PagesModule,   
    UserModule, 
    CurrencyMaskModule,
    
    
  ],
  exports:[MatlibModule,AppRoutingModule,CurrencyMaskModule],
  providers: [ ApiService,SnackBarComponent, {provide: MAT_DATE_LOCALE, useValue: 'en-US'}, { provide: CURRENCY_MASK_CONFIG, useValue: CustomCurrencyMaskConfig  },],
  bootstrap: [AppComponent]
})
export class AppModule { }