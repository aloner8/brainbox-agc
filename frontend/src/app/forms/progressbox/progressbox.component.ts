import { Component, Input, OnInit, ViewChild} from '@angular/core'
import { tap, catchError, finalize} from 'rxjs/operators';
import {merge, throwError} from 'rxjs';

@Component({
    selector: 'progress-box',
    templateUrl: './progressbox.component.html',
    styleUrls: ['./progressbox.component.scss']
})
export class ProgressBoxComponent implements OnInit {

    @Input() Value: number = 100;
    @Input() MaxValue: number = 100;

    persentvalue = 100;
    d ='M9.9,29.6c0-8.6,7-15.6,15.6-15.6h200c8.6,0,15.6,7,15.6,15.6c0,8.6-7,15.6-15.6,15.6H25.5C16.9,45.2,9.9,38.2,9.9,29.6z'
    constructor() {

    }


    ngOnInit() {

    this.persentvalue = (this.Value *270) /this.MaxValue;
    this.d ='M9.9,29.6c0-8.6,7-15.6,15.6-15.6h'+ this.persentvalue.toString().trim() + 'c8.6,0,15.6,7,15.6,15.6c0,8.6-7,15.6-15.6,15.6H25.5C16.9,45.2,9.9,38.2,9.9,29.6z'

    }

   
}
















