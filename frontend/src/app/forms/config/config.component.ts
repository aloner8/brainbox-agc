import {Component, OnInit} from '@angular/core';
import {Observable, Subject} from "rxjs";
import {map} from "rxjs/operators";
import {VariablesService} from '../../variables.service'
import { ApiService } from '../../api.service';
import { UserService } from '../../user/user.service';

@Component({
    selector: 'cus-config',
    templateUrl: './config.component.html',
    styleUrls: ['./config.component.scss']
})
export class ConfigComponent implements OnInit {

    selectedIndex:number=0
    cols = 5;
    currentmenulabel='';
    BaseHref=''
    UserInfo:any;
        Me:Subject<any> = new Subject();

    constructor(private AppService:VariablesService , private API:ApiService,private user:UserService) {
        
    }

    ngAfterViewInit(): void {
        //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
        //Add 'implements AfterViewInit' to the class.
      //  console.log('ngAfterViewInit')
      }

    ngOnInit() {
      const  that = this
    //  console.log('ngOnInit')

    this.UserInfo = this.AppService.getVariable('UserHome')
//console.log('this.UserInfo :',this.UserInfo )
    this.BaseHref = this.API.getBaseHref();

           
        this.AppService.AppVars.subscribe(function(vars){
        //console.log( vars )
     
            if(vars['eventname'])
            switch (vars['eventname']) {
              case 'VariablesChanging':
                switch (vars['variablename']) {
                  case 'currentScreenSize':

                     switch (vars['value']) {
                        case 'XSmall':
                            that.cols = 1
                            break;
                            case 'Small':
                                that.cols = 2
                                break;
                                case 'Medium':
                                    that.cols = 3
                                    break;
                                    case 'Large':
                                        that.cols = 5
                                        break;
                                        case 'XLarge':
                                            that.cols = 5
                                            break;

                        default:
                            that.cols = 5
                            break;
                     }
                //console.log( vars )
                    break;
                
                  default:
                    break;
                }
                break;
            
               case 'ExportExcel':  

      if(vars.target=='config'){
         
                        
              setTimeout(() => {
                that.Me.next(vars)  
              }, 500);
           
      

            
          }
                 break;
              default:
                break;
            }
          })
       
    }

    selectedIndexChange(event:any){

    }

    SelectMenu(namemenu:string){
        this.currentmenulabel =namemenu
        this.selectedIndex=2
    }

    setScreenSize(){
       const that=this 
       /*  switch (that.currentScreenSize) {
            case 'XLarge': 
                    that.cols=3;              
                    break;
            case 'Large': 
                    that.cols=3 ;
                    that.captionlevelfontsize='large';
                    that.RankingSize= 'Large'; 
                    that.totalNumber = 'large'
                    that.totallabel = 'x-small'
                    that.WelcomelabelfontSize ='32px'
                    that.UserNamelabelfontSize ='25px'
                    break;
            case 'Medium': 
                    that.cols=3;that.captionlevelfontsize='medium';
                    that.RankingSize= 'Medium';  
                    that.totalNumber = 'small'
                    that.totallabel = 'xx-small'
                    that.WelcomelabelfontSize ='25px'
                    that.UserNamelabelfontSize ='20px'
                    break;
            case 'Small': 
                    that.cols=3; that.captionlevelfontsize='medium'; 
                    that.RankingSize= 'Small'; 
                    that.totalNumber = 'x-small'
                    that.totallabel = 'xx-small'
                    that.WelcomelabelfontSize ='25px'
                    that.UserNamelabelfontSize ='20px'
                    break;
            case 'XSmall': 
                    that.cols=1;that.captionlevelfontsize='Smaller'; 
                    that.RankingSize= 'Large';                             
                    that.WelcomelabelfontSize ='32px'
                    that.UserNamelabelfontSize ='25px'
                    break;
            
        
            default:
                break;
        }
        setTimeout(() => {
            
            that.HomePage.next({eventname:'ChangeScreenSize',value:{RankingSize:that.RankingSize} })
        }, 200); */
    }
   

   

}
