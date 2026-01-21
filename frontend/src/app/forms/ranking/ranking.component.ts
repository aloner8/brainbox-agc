import {Component, Input, OnInit} from '@angular/core'; 
import {Observable, Subject} from "rxjs"; 
import {map} from "rxjs/operators";

@Component({
    selector: 'ranking',
    templateUrl: './ranking.component.html',
    styleUrls: ['./ranking.component.css']
})
export class RankingComponent implements OnInit {

    @Input() Parent:Subject<any> =  new Subject<any>()  ;
    @Input() Size:string ='Large'  ;
    @Input() userlevel:any ;
 


    oreginalWidth =523;
    oreginalHeigth =237;
    currentWidth =523;
    currentHeight =237;
    currentSize = 1
    lightimg:boolean= false;
    captionlevelfontsize = 'large'
    captionsubfontsize = 'small'
    captioninfofontsize = 'small'
    iconinfofontsize = 'small'
    firstRow = '.'
    topcaptionstart =0
    pathD = 'M51,93.5C51,54.6,82.6,23,121.5,23h372.1c11.6,0,17.4,0,21.8,2.3c3.5,1.9,6.4,4.8,8.3,8.3C526,38,526,43.8,526,55.4v38.1v38.1c0,11.6,0,17.4-2.3,21.8c-1.9,3.5-4.8,6.4-8.3,8.3c-4.4,2.3-10.2,2.3-21.8,2.3H121.5	C82.6,164,51,132.4,51,93.5z';
    constructor() {

    }

    ngOnInit() {
        const that = this
        this.Parent.subscribe(function(v){
          //  var currentScreenSize=v['currentScreenSize'].toString()
          ////  console.log(that.Size)
            that.setSize()
        })

    }

    setSize(){
        
        switch (this.Size) {
            case 'XLarge': 
                    this.currentSize=0.9;
                    this.captionlevelfontsize='larger';
                    this.captionsubfontsize='small';
                    this.captioninfofontsize='small';
                    this.iconinfofontsize='small';
                    this.firstRow='.';
                    this.topcaptionstart=10;
                     break;              
            case 'Large': 
                    this.currentSize=0.7 ;
                    this.captionlevelfontsize='large';
                    this.captionsubfontsize='small';
                    this.captioninfofontsize='smaller';
                    this.iconinfofontsize='small';
                    this.topcaptionstart=10;
                    this.firstRow='.'; 
                    break;
            case 'Medium': 
                    this.currentSize=0.6;
                    this.captionlevelfontsize='medium';
                    this.captionsubfontsize='x-small';
                    this.captioninfofontsize='x-small';
                    this.iconinfofontsize='x-small';
                    this.topcaptionstart=5;
                    this.firstRow='';  
                    break;
            case 'Small': 
                    this.currentSize=0.55; 
                    this.captionlevelfontsize='small'; 
                    this.captionsubfontsize='xx-small';
                    this.captioninfofontsize='xx-small';
                    this.iconinfofontsize='xx-small';
                    this.firstRow=''; 
                    this.topcaptionstart=5;
                    break;
            case 'XSmall': 
                    this.currentSize=0.3;
                    this.captionlevelfontsize='smaller'; 
                    this.captionsubfontsize='xx-small';
                    this.captioninfofontsize='xx-small';
                    this.iconinfofontsize='xx-small';
                    this.firstRow=''; 
                    break;
            
        
            default:
                break;
        }
        this.currentWidth =this.oreginalWidth *  this.currentSize;
        this.currentHeight =this.oreginalHeigth *  this.currentSize;
    }

 

    

}
