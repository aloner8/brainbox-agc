import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, NG_VALUE_ACCESSOR, DefaultValueAccessor, ControlValueAccessor } from '@angular/forms';
import{MatlibModule} from '../matlib.module';
import { MatInput } from '@angular/material/input';
import { Observable, Subject, catchError, of, tap } from 'rxjs';
import { ApiService } from '../api.service';


var FormLayouts= [
  { Name :'Tlie free size',
    GridList: true,
    Arrangement:'free' ,
    maxCol:6,
    rowWidth:2,
  },
  { Name :'Non Tlie ',
  GridList: false,
  Arrangement:'one' ,
  maxCol:6,
  rowWidth:2,
  },
  { Name :'Tlie gallery',
  GridList: true,
  Arrangement:'same' ,
  maxCol:6,
  rowWidth:2,
},
]
export interface Tile {
  color: string;
  colspan: number;
  rowspan: number;
  text: string;
  controlField: string;
}
@Component({
  selector: 'app-forms',
  templateUrl: './form-mat.component.html',
  styleUrl: './form-mat.component.scss'
})
export class FormMatComponent {

@Input() id: any; 

@Input() Pages: Subject<any> =   new Subject<any>();

@Input()  currentScreenSize:string = 'Small';

@Output() FormEvents : EventEmitter<any> = new EventEmitter();


constructor(){
  
}

  

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
     //console.log(error);
      return of(result as T);
    };
  }
  
  currentState:string = 'init';
  tiles:any;
  Controls:any;
  ngOnInit(): void {
    const _form = this
 /*    this.getJSON('../../assets/forms.json').subscribe(function(forminfo:any){ 
      
    //  console.log(forminfo)
      _form.FormEvents.emit({eventname:"FormLoadComplete",eventvalue:{Caption:""}})

   })   */
  
   this.Pages.subscribe(event => {
    
    switch (event.eventname) {
        case "SetFormInfo":
          if(event.eventvalue.forminfo.id == this.id){
            
           // this.tiles = event.eventvalue.forminfo.tiles
          //  console.log(event,':',this.tiles)
            this.tiles=[]
            event.eventvalue.forminfo.tiles.forEach( function(t:any,index:any) {
              var  tile:any = {colspan:parseInt(t.colspan),rowspan:parseInt(t.rowspan)  }
              var _controls = event.eventvalue.forminfo.Controls.filter(function(c:any){ return c.index == index })
              tile['controls']= _controls
              _form.tiles.push(tile)
            });
            //this.Controls =event.eventvalue.forminfo.Controls
          }
          
        
          /* setTimeout(() => {
            _form.Me.next(event)
          }, 500);
 */
          break;
      default:
        break;
    }
  })

  _form.FormEvents.emit({eventname:"FormLoading",eventvalue:{Caption:"",id: this.id}})
  }



}
