import { Component, ViewContainerRef, Input, Type } from '@angular/core';
import{MatlibModule} from '../matlib.module';
import {FiedInput} from './field-input.component'
import { FormControlName } from '@angular/forms';
@Component({
  selector: 'app-form-mat-field',
  templateUrl: './form-mat-field.component.html',
  styleUrl: './form-mat-field.component.scss'
})
export class FormMatFieldComponent {
  
  @Input () value:any;
  @Input()  FieldName:any;
  @Input()  id:any;
  @Input()  Type:any;
  @Input()  Properties:any;
  constructor(private viewRef: ViewContainerRef) {}

  ngOnInit() {
    
     // this.loadComponent(MatInput,{});
     this.loadComponent(this.id,{}).then(function(l){
      if(l=='complete'){

      } else {

      }
     }) 
  }

  ngOnChanges() {}

  loadComponent(ComponentTypeId:any , option:any) {
    const _field = this
    this.viewRef.clear();    
 
    
    const compRef = this.viewRef.createComponent( _field.getComponentTypeByID( ComponentTypeId));
    return   new Promise((resolve, reject) => {     
    //  console.log('compRef => ', compRef);
      if (compRef) {
      // console.log(compRef.instance);
        (<any>compRef.instance).DataField =this.FieldName;
        (<any>compRef.instance).Properties =this.Properties;
        
        resolve('complete')
      } else {
        resolve('not load')
      }
  })
  }

  getComponentTypeByID(ComponentTypeId:any ) {
        var compRef ;

        switch (ComponentTypeId) {
          case 1: return FiedInput ; break;
          case 2: return FiedInput ; break;
          case 3: return FiedInput ; break;
          case 4:return FiedInput ; break;
          case 5: return FiedInput; break;
          case 6:  return FiedInput ; break;
          case 7: return FiedInput ; break;
          case 8: return FiedInput ; break;
          case 9:  return FiedInput ; break;
        
          default:
            return FiedInput ; break;
            break;
        }
       
     
  }
}
