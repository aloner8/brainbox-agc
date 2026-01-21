import { Component , EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormMatComponent} from '../form-mat/form-mat.component'
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Subject, takeUntil } from 'rxjs';
import {MatlibModule} from '../matlib.module'
import { FormControl } from '@angular/forms';
import { ApiService } from '../api.service';
import { VariablesService } from '../variables.service';
//import { ApiService } from '../api.service';


@Component({
  selector: 'app-forms-custom',  
  templateUrl: './forms-custom.component.html',
  styleUrl: './forms-custom.component.css'
})
export class FormCustomComponent {
    @Input () formname:string='';
  formid:number = 0
  constructor(private breakpointObserver: BreakpointObserver
              ,private api:ApiService
              ,private VeriableService:VariablesService
              ) {
    breakpointObserver
    .observe([
      Breakpoints.XSmall,
      Breakpoints.Small,
      Breakpoints.Medium,
      Breakpoints.Large,
      Breakpoints.XLarge,
    ])
    .pipe(takeUntil(this.destroyed))
    .subscribe(result => {
      for (const query of Object.keys(result.breakpoints)) {
        if (result.breakpoints[query]) {
          this.currentScreenSize = this.displayNameMap.get(query) ?? 'Unknown';
          //console.log(' this.currentScreenSize ', this.currentScreenSize )
          this.VeriableService.setVariable("currentScreenSize",this.currentScreenSize);
        }
      }
    });
  }

  displayNameMap = new Map([
    [Breakpoints.XSmall, 'XSmall'],
    [Breakpoints.Small, 'Small'],
    [Breakpoints.Medium, 'Medium'],
    [Breakpoints.Large, 'Large'],
    [Breakpoints.XLarge, 'XLarge'],
  ]);
  
  ListPage = [
    {id:1,
      Caption:"1"
    },{id:2,
      Caption:"2"
    },
    {id:3,
      Caption:"3"
    }
  ]
  destroyed = new Subject<void>();
  currentScreenSize: string = 'Small';
  Me:Subject<any> = new Subject();
  selected = new FormControl(0);
  drawer_opened=true
  forms : any;
  typesOfPage: any;
  typesOfControl: any;

  ngOnInit(): void {
    var _page = this

    //var forms = this.getForm()
/*     this.getForm().then(function (f) {
      _page.forms = f
    //  console.log(_page.forms)
    })
     */

    this.VeriableService.AppVars.subscribe(function(vars){
    //  console.log(vars)
      if(vars['eventname'])
      switch (vars['eventname']) {
        case 'VariablesChanging':
          switch (vars['variablename']) {
            case 'LeftMenuSelected':
              _page.formname =vars['value']
                            
              break;
          
            default:
              break;
          }
          break;
      
        default:
          break;
      }
    })

    
   
    //this.PageEvents.emit({eventname:"GetLeftMenu",eventvalue:{ListPages:this.ListPage}})
  }



  FormEvents(ev:any){
  //  console.log(ev)
      switch (ev['eventname']) {

       case 'FormLoading':
 
       break;
 
       case 'FormRefrash':
         //alert('FormDataSoureRefrash')
 
         break;
        case 'FormDataSoureRefrash':
          //alert('FormDataSoureRefrash')
   
          break;
  
        case 'SetFormCaption':
    
          break;
      
      case 'CurrentRowSelectting':
        
   
             
        break;
 
        case "Form Closing":
   
         break;
        default:
          break;
      }
    }

    closeForm(PageIndex:number){
      var _before : any
      var _AllPage = []
      _before=[]
    /*   _AllPage = [].concat(this.ListPage)
      this.ListPage =[]
      for (let index = 0; index < _AllPage.length; index++) {
         const element = _AllPage[index];
         if(index ==PageIndex ){
  
         } else 
         {
           _before.push(element)
         }
         if(index==_AllPage.length-1){
          this.ListPage = [].concat(_before)
         }
         
       } */
    }
}
