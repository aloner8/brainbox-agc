import { Component, Input, OnInit, ViewChild} from '@angular/core'
import { tap, catchError, finalize} from 'rxjs/operators';
import {merge, Subject, throwError} from 'rxjs';

@Component({
    selector: 'status-img',
    templateUrl: './statusimg.component.html',
    styleUrls: ['./statusimg.component.scss']
})
export class StatusImgComponent implements OnInit {

    @Input() Value: number = 100;
    @Input() Caption: string = 'Draft';
    @Input() Parent:Subject<any> =  new Subject<any>()  ;
    @Input() Size:string ='Large'  ;
    
    oreginalWidth =120;
    oreginalHeigth =30;
    currentWidth =120;
    currentHeight =30;
    currentSize = 1
    lightimg:boolean= false;
    captionlevelfontsize = 'large'
    captionsubfontsize = 'small'
    captioninfofontsize = 'small'
    iconinfofontsize = 'small'
    firstRow = '.'
    topcaptionstart =20
    persentvalue = 100;
    viewBox = '0 0 130 35' 
    d ='M9.9,29.6c0-8.6,7-15.6,15.6-15.6h200c8.6,0,15.6,7,15.6,15.6c0,8.6-7,15.6-15.6,15.6H25.5C16.9,45.2,9.9,38.2,9.9,29.6z'
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
                    this.topcaptionstart=20;
                     break;              
            case 'Large': 
                    this.currentSize=0.7 ;
                    this.captionlevelfontsize='large';
                    this.captionsubfontsize='small';
                    this.captioninfofontsize='small';
                    this.iconinfofontsize='small';
                    this.topcaptionstart=20;
                    this.firstRow='.'; 
                    break;
            case 'Medium': 
                    this.currentSize=0.6;
                    this.captionlevelfontsize='medium';
                    this.captionsubfontsize='x-small';
                    this.captioninfofontsize='x-small';
                    this.iconinfofontsize='x-small';
                    this.topcaptionstart=10;
                    this.firstRow='';  
                    break;
            case 'Small': 
                    this.currentSize=0.55; 
                    this.captionlevelfontsize='small'; 
                    this.captionsubfontsize='xx-small';
                    this.captioninfofontsize='xx-small';
                    this.iconinfofontsize='xx-small';
                    this.firstRow=''; 
                    this.topcaptionstart=10;
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
















