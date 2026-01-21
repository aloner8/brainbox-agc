import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import { Subject } from 'rxjs';

 

/**
 * @title Dynamic grid-list
 */
@Component({
  selector: 'field-common',
  template: '<label> Field Common </label>',  
 
})
export class FieldCommon   {
 
 
  @Input()  Parents: Subject<any> = new Subject<any> () ;
  @Input()  Forms: Subject<any> = new Subject<any> () ;
  @Input() Name: any; 
  @Input() ComponentVersion: any; 
  @Input() ComponentProperty: any;   
 
  @Input() CurrentObjectProperty: any;
  @Input() EditObjectProperty: any;
  @Input() FilterObjectProperty: any;
  @Input() NewObjectProperty: any;

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
 
  @Input()  Enable:boolean ;
  @Input()  Visible:boolean;
  @Input()  dataType :any;
  @Input()  CanEdit: any;
  @Input()  CanHasChild: any;
  @Input()  parentKey: any;
 
  @Input() FormMode: any;
 
  ThisField:Subject<any> = new Subject();

  @Output() fieldCommonEvents : EventEmitter<any> = new EventEmitter();

  panelOpenState = false;
 
  ComponentInitiateFunction:any;
    ComponentInitiateScript(Script){
        var _function = eval(Script)
    }

  ngOnInit(): void {
    var _thisCom = this

  // //console.log(this.Name,"ngOnInit")
    _thisCom.ComponentInitiateFunction=function (thisCom) {
   //  //console.log('Not ComponentInitiateFunction')
    }

    var _mapFormObject=[]
    var _thisCom=this

      this.Parents.subscribe(event => {
       //console.log(event.name,'|key=',_thisCom.parentKey + '.' + _thisCom.Name,event)
    //   //console.log('FiedContainer',event)
      // //console.log(event.name,',FORM_DATASOURCES:',_thisCom.FORM_DATASOURCES[_thisCom.ListSource])
   ////console.log(event.name,event,'<>',_thisCom.Name)
   var _ThisObject = _thisCom.FORM_OBJECTS.filter(function(obj){ return obj.key == _thisCom.parentKey + '.' + _thisCom.Name})[0]
          
   
  
   if(_ThisObject){
     _thisCom.Lists = [].concat(_ThisObject.Lists)

     if(_thisCom.ComponentVersion=='date'){
      if(typeof(_ThisObject.Value)=='string' ){
        _thisCom.Value = new Date(_ThisObject.Value) 
      } else {
        _thisCom.Value = _ThisObject.Value
      }
     
     } else{
      _thisCom.Value = _ThisObject.Value
     }

    
 
     
   } else {
     _thisCom.Lists = []
   }    

   setTimeout(() => {
    //console.log(ev)
    this.ThisField.next(event)
  }, 500);



        switch (event.name) {
  
          

          case "SetStateComplete":
          //console.log('SetStateComplete:' ,event)
            break;

         case "FormDataSoureRefrash":
           if(_thisCom.ListSource){
             if(_thisCom.ListSource.split('.')[0].trim() == event.DataSourceName.trim()){
           
              //console.log('thisCom.FORM_OBJECTS:',_thisCom.FORM_OBJECTS)
              //console.log('thisCom.FORM_OBJECTS:' , _thisCom.parentKey + '.' + _thisCom.Name ,_thisCom.FORM_OBJECTS.filter(function(obj){ return obj.key == _thisCom.parentKey + '.' + _thisCom.Name}))
               if(_thisCom.FORM_OBJECTS.filter(function(obj){ return obj.key == _thisCom.parentKey + '.' + _thisCom.Name})[0]){
                 _thisCom.Lists = [].concat(_thisCom.FORM_OBJECTS.filter(function(obj){ return obj.key == _thisCom.parentKey + '.' + _thisCom.Name})[0].Lists)
               
               } else {
                 _thisCom.Lists = []
               }    
    
               //console.log( _thisCom.Lists)
             }
           } 
  
          
           
           break;

          case "GetFormObject":
            //  console.log('GetFormObject:',event)
            break;
  
          case "SetCurrentValue":
  
           //console.log('thisCom.FORM_OBJECTS:',_thisCom.FORM_OBJECTS)
         //console.log('thisCom.FORM_OBJECTS:' , _thisCom.parentKey + '.' + _thisCom.Name ,_thisCom.FORM_OBJECTS.filter(function(obj){ return obj.key == _thisCom.parentKey + '.' + _thisCom.Name}))
  
            var _ThisObject = _thisCom.FORM_OBJECTS.filter(function(obj){ return obj.key == _thisCom.parentKey + '.' + _thisCom.Name})[0]
           
  
            if(_ThisObject){
              _thisCom.Lists = [].concat(_ThisObject.Lists)

              if(_thisCom.ComponentVersion=='date'){
                if(typeof(_ThisObject.Value)=='string' ){
                  _thisCom.Value = new Date(_ThisObject.Value) 
                } else {
                  _thisCom.Value = _ThisObject.Value
                }
               
               } else{
                _thisCom.Value = _ThisObject.Value
               }
             
          
              
            } else {
              _thisCom.Lists = []
            }    
          
             //console.log( _thisCom.Lists)
           //  _thisCom.Lists = thisCom.FORM_OBJECTS.filter(function(obj){obj.key == _thisCom.parentKey + '.' + _thisCom.Name})
            //_thisCom.fieldCommonEvents.next(event)
           
           break;
  
            case "TableSetUpColumnComplete":
              //console.log(event)
               this.Value=event.value
             
             break;
              
             case "FormModeChange":
              //console.log(event)
               this.FormMode=event.value
             break;
      default:
         break; 
        }
        //_thisCom.ThisField.next(event)
      
      })
 

  //   this.Parents.subscribe(event => {
  //   //console.log(event)
  // //   //console.log(event.name,',FORM_DATASOURCES:',_thisCom.FORM_DATASOURCES[_thisCom.ListSource])
  //     switch (event.name.trim()) {
         
  //       case 'ComponentInitiateComplete':
  //        ////console.log(event.name,',FORM_DATASOURCES:',_thisCom.FORM_DATASOURCES[_thisCom.ListSource])

  //        //console.log(event.name, event ,' My Value',_thisCom.DataSource ,'.',_thisCom.DataField,' = ', _thisCom.FORM_DATASOURCES[_thisCom.DataSource][_thisCom.DataField])
  //        ////console.log(event.name,',FORM_DATASOURCES:',_thisCom.FORM_DATASOURCES[_thisCom.ListSource])
  //       // _thisCom.ComponentInitiateFunction(_thisCom)
           
  //           break;

  //       case "Form initiate complete":
  //      //  //console.log(event)
  //        // _thisCom.ComponentInitiateFunction(_thisCom)
  //         break;

  //       case 'FormRefrash':
  //     //   //console.log(event.value,',listsource:',this.ListSource)
  //         //  _thisCom.SelectedNode[0].value =event.value
  //         //  _thisCom.treeControl.expandDescendants(_thisCom.SelectedNode[0])
           
  //           break;
  //       case 'FormLoadTemplate':
  //     // //console.log(event.value,',listsource:',this.ListSource)
  //       //  _thisCom.SelectedNode[0].value =event.value
  //       //  _thisCom.treeControl.expandDescendants(_thisCom.SelectedNode[0])
         
  //         break;

        
  //       case 'EditFormInforComplete':
  //       //console.log(event.value)
  //       //  _thisCom.SelectedNode[0].value =event.value
  //       //  _thisCom.treeControl.expandDescendants(_thisCom.SelectedNode[0])
         
  //         break;
  //       case 'CopyToNewComplete':
  //       //console.log(event.value)
  //       //  _thisCom.SelectedNode[0].value =event.value
  //       //  _thisCom.treeControl.expandDescendants(_thisCom.SelectedNode[0])
          
  //         break;
  //     case 'FormDataSoureRefrash':
       
  //    //  //console.log('List Event', event.value)
   
  //       if(_thisCom.ListSource){
  //     //   //console.log('MATLIST: ' + JSON.stringify(_thisCom.ListSource)   )
  //       }
   

  //         break;
          
  //       default:
  //         break;
  //     }
       
  //   })
     
  }


  ChildComEvents(ev: any){
    //this.formDetail = JSON.stringify(ev)
  //  var _sendEV = {name : "ListSelectionChange" , ComponentName: this.Name , value:ev.options[0].value }
  
  setTimeout(() => {
    //console.log(ev)
    this.fieldCommonEvents.emit(ev)
  }, 500);

  }
 
  
  OnClick(ev: any){
    
    //console.log(ev)
     var _sendEV = {name : "OnClick" , ComponentName: this.Name , value:ev}
     setTimeout(() => {
      this.fieldCommonEvents.emit(_sendEV)
    }, 500);
     //alert( JSON.stringify(ev))
     //this.formDetail = JSON.stringify(ev)
   }

  selectionChange(ev: any){
    
    //console.log(ev)
     var _sendEV = {name : "selectionChange" , ComponentName: this.Name , value:ev.value }
     setTimeout(() => {
      this.fieldCommonEvents.emit(_sendEV)
    }, 500);
     //alert( JSON.stringify(ev))
     //this.formDetail = JSON.stringify(ev)
   }

   GetCurrentValue(){
    
    ////console.log(ev.options[0].value)
  //  var _sendEV = {name : "ListSelectionChange" , ComponentName: this.Name , value:ev.options[0].value }
//this.fieldCommonEvents.emit(_sendEV)
    //alert( JSON.stringify(ev))
     //this.formDetail = JSON.stringify(ev)
   }
   SendEvent(name: string,value:any){
    
    ////console.log(ev.options[0].value)
     var _sendEV = {name : name , ComponentName: this.Name , value:value }
     setTimeout(() => {
      this.fieldCommonEvents.emit(_sendEV)
    }, 500);
     //alert( JSON.stringify(ev))
     //this.formDetail = JSON.stringify(ev)
   }
   OnChange(sender:any ){
     
  //console.log('OnChange',sender)
      //var _sendEV = {name : "OnChangeValue" , ComponentName: this.Name ,value : { datasource: this.DataSource, fieldname: this.DataField, newvalue: sender.target.value}  }
      var _sendEV = {name : "selectionChange" , ComponentName: this.Name , value:sender.target.value }
      setTimeout(() => {
       this.fieldCommonEvents.emit(_sendEV)
     }, 500);
      //  this.fieldCommonEvents.emit(_sendEV)
      //alert( JSON.stringify(ev))
      //this.formDetail = JSON.stringify(ev)
    }

    GetRowDetail(sender:any){
     
    //console.log('OnChange',sender)
        //var _sendEV = {name : "OnChangeValue" , ComponentName: this.Name ,value : { datasource: this.DataSource, fieldname: this.DataField, newvalue: sender.target.value}  }
        var _sendEV = {name : "GetRowDetail" , ComponentName: this.Name , value:sender }
        setTimeout(() => {
         this.fieldCommonEvents.emit(_sendEV)
       }, 500);
        //  this.fieldCommonEvents.emit(_sendEV)
        //alert( JSON.stringify(ev))
        //this.formDetail = JSON.stringify(ev)
      }
   

}