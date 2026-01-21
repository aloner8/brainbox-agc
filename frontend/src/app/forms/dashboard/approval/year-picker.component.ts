import {Component, EventEmitter, Input, Output, ViewEncapsulation} from '@angular/core';
import {FormControl, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {provideMomentDateAdapter} from '@angular/material-moment-adapter';
import {MatDatepicker, MatDatepickerModule} from '@angular/material/datepicker';

// Depending on whether rollup is used, moment needs to be imported differently.
// Since Moment.js doesn't have a default export, we normally need to import using the `* as`
// syntax. However, rollup creates a synthetic default module and we thus need to import it using
// the `default as` syntax.
import * as _moment from 'moment';
// tslint:disable-next-line:no-duplicate-imports
import {default as _rollupMoment, Moment} from 'moment';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { Subject } from 'rxjs';

const moment = _rollupMoment || _moment;

// See the Moment.js docs for the meaning of these formats:
// https://momentjs.com/docs/#/displaying/format/
export const MY_FORMATS = {
  parse: {
    dateInput: 'YYYY',
  },
  display: {
    dateInput: 'YYYY',
    monthYearLabel: 'YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'YYYY',
  },
};

/** @title Datepicker emulating a Year and month picker */
@Component({
  selector: 'year-picker',
  templateUrl: 'year-picker.component.html',
  styleUrl: 'year-picker.component.css',
  providers: [
    // Moment can be provided globally to your app by adding `provideMomentDateAdapter`
    // to your app config. We provide it at the component level here, due to limitations
    // of our example generation script.
    provideMomentDateAdapter(MY_FORMATS),
  ],
 
  
})
export class YearPickerComponent {
  date = new FormControl(moment());
    @Input() Parent:Subject<any> = new Subject();
    @Input() Name:string='';
    @Input() Label:string='';
    @Output() SendEvents : EventEmitter<any> = new EventEmitter();
    
  setMonthAndYear(normalizedMonthAndYear: Moment, datepicker: MatDatepicker<Moment>) {
    const ctrlValue = this.date.value ?? moment();   
    ctrlValue.year(normalizedMonthAndYear.year());
    this.date.setValue(ctrlValue);
    setTimeout(() => {
      this.SendEvents.emit({eventname:'YearPickerSelected' ,sender:this.Name,Value: this.date.value })
     }, 200);
    datepicker.close();
  }

  ngOnInit(){
    const control = this
 
    this.Parent.subscribe(function(d){
  //console.log('year-picker',d)
     if(d.target==control.Name){
      switch (d.eventname) {
        case 'setYearPicker':
          control.date.setValue(moment(d.value,"YYYY"))
      //console.log('year-picker',control.date.value)
        break;

        default :
        break;
    }
     }

    })
  }
 
}
