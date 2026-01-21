import {Component, Input} from '@angular/core';
import { Subject } from 'rxjs';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import {MatlibModule} from '../matlib.module'
@Component({
  selector: 'field-input',
  standalone:true,
  imports :[MatlibModule],
  templateUrl: './field-input.component.html'
})
export class FiedInput  {
  @Input()  Parents: Subject<any> = new Subject<any> () ;
  @Input()  Forms: Subject<any> = new Subject<any> () ;
  @Input() Name: any; 
  @Input() Properties: any;    
  
  @Input() FORM_OBJECTS : any;

  @Input()  ComponentStyle: any;
  @Input()  DataBindingMode: any;
  @Input()  ListField: any;
  @Input()  Lists: any;
  @Input()  SelectIndex: any;
 
  @Input()  DataSource: any;
  @Input()  ListSource: any;
  @Input()  ListSourceFilter: any;
  
  @Input()  DataField: any;
  @Input()  Variable: any;
  @Input()  Script: any;
   
  @Input()  FORM_DATASOURCES: any;
  @Input()  PrimaryDataSource: any;
  @Input()  Value: any;
  @Input()  Label: any;
  @Input()  Panels: any;
  @Input()  inputType: any;
  @Input()  placeholder: any; 
  @Input()  AllowAddNew: any;
  @Input()  AddNewColor: any;
  @Input()  AddNewCommand: any;
  @Input()  AddNewCaption: any;
  @Input()  AllowDelete: any;
  @Input()  DeleteCommand: any;
  @Input()  currentFieldSize: any;
  @Input()  currentParentSize: any;
  @Input()  ChildComponents: any;
  @Input()  columnsToDisplay :any;
  @Input()  Columns :any;
 
  @Input()  Enable:any ;
  @Input()  Visible:any;
  @Input()  dataType :any;
  @Input()  CanEdit: any;
  @Input()  CanHasChild: any;
  @Input()  parentKey: any;
 
  @Input() FormMode: any;
  constructor(){}

 indeterminate = false;
 labelPosition: 'before' | 'after' = 'after';

}
