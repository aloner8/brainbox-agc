import { Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core'
import { tap, catchError, finalize} from 'rxjs/operators';
import {merge, Subject, throwError} from 'rxjs';

@Component({
    selector: 'progress-target',
    templateUrl: './progress-target.component.html',
    styleUrls: ['./progress-target.component.scss']
})
export class ProgressTargetComponent implements OnInit {

    @Input() Value: number = 100;
    @Input() MaxValue: number = 100;
    @Input() Value2: number = 100;
    @Input() Index: number = 0;
    @Input() Options: any = {};
    @Input() Parent:Subject<any> = new Subject();

    @Input()  ColorStart: string =  '#2684FF';
    @Input()  ColorEnd: string =  '#113595';
    captionth: string='';
    captionen: string='';
    target_amont :string = '0'    
    persentvalue = 100;
    d ='M9.9,29.6c0-8.6,7-15.6,15.6-15.6h200c8.6,0,15.6,7,15.6,15.6c0,8.6-7,15.6-15.6,15.6H25.5C16.9,45.2,9.9,38.2,9.9,29.6z'
    ColorStart_svg = 'stop-color:'+ this.ColorStart + ';'
    ColorEnd_svg = ' stop-color:'+ this.ColorEnd + ';'
    
    @ViewChild('clock', { static: true }) myClock!: ElementRef;

    canvas:any;
    ctx: any;

    constructor() {

    }
    

    ngOnInit() {
        const that=this
        this.persentvalue = (this.Value *270) /this.MaxValue;
        this.d ='M9.9,29.6c0-8.6,7-15.6,15.6-15.6h'+ this.persentvalue.toString().trim() + 'c8.6,0,15.6,7,15.6,15.6c0,8.6-7,15.6-15.6,15.6H25.5C16.9,45.2,9.9,38.2,9.9,29.6z'
       // console.log(that.Index)
        if(that.Options){
         //   that.ColorStart_svg = '  stop-color:'+ that.Options['start_color'] + ';'
        //    that.ColorEnd_svg = ' stop-color:'+ that.Options['end_color']  + ';'
        that.ColorStart_svg = 'stop-color:'+ this.ColorStart + ';'
        that.ColorEnd_svg = ' stop-color:'+ this.ColorEnd + ';'
            that.captionth = that.Options['caption_th'];
            that.captionen = that.Options['caption_en'];
        }  
        const canvasClock: HTMLCanvasElement = this.myClock.nativeElement;
        const contextClock = canvasClock.getContext('2d');

        this.Parent.subscribe(function(d){
           // console.log(d)
            switch (d.eventname) {
                case 'BinddingObjectTarget':
               //   console.log(d.ObjectTarget[that.Index])
                    that.Options = d.ObjectTarget[that.Index]['report_option']
               //   console.log(that.Index)
                //  console.log( that.Options)
                     if(that.Options){
                        that.ColorStart_svg =  that.Options['start_color'] 
                        that.ColorEnd_svg =  that.Options['end_color']  
                        that.captionth = that.Options['caption_th'];
                        that.captionen = that.Options['caption_en'];
                        that.target_amont =  d.ObjectTarget[that.Index].target_amount
                         if(contextClock){
                            that.draw(contextClock)
                         }
                    }  

                    break;
            
                default:
                    break;
            }
        })
    }
    draw(context: CanvasRenderingContext2D): void {
        // const canvas: HTMLCanvasElement = this.myCanvas.nativeElement;
         let time: number = (function (): number {
                 let midnight: Date = new Date();
                 midnight.setHours(0);
                 midnight.setMinutes(0);
                 midnight.setSeconds(0);
                 midnight.setMilliseconds(0);
                 return Date.now() - midnight.getTime();
             })(),
             hours: number = time / (60 * 60 * 1000),
             minutes: number = (hours * 60) % 60,
             seconds: number = (minutes * 60) % 60,
             c: { x: number; y: number } = { x: 300 / 2, y: 300 / 2 };
     
         context.clearRect(0, 0, 500, 75);
     
         context.lineCap = 'round';
     
        // this.secondHand(context,c,seconds);
        // this.minuteHand(context,c,minutes);
        // this.hourHand(context,c,hours);
          
         this.face(context,c);
     
         }

 face(context: CanvasRenderingContext2D,c:any): void {


         // Border
         context.lineWidth = 5;
         context.strokeStyle = this.ColorStart;
         context.beginPath();
         context.moveTo(3,3);
         context.lineTo(3,40);
         context.stroke();


         context.fillStyle = 'white';
         context.beginPath();
         context.roundRect(3, 45, 550,25, 3)
         context.fill();

        context.font = (14 ).toString() + 'px Noto Sans';        
        context.fillText(  this.captionen , 10 , 14);

        context.font = (14 ).toString() + 'px Noto Sans';        
        context.fillText(  this.captionth , 10 , 34);

        let lineLen =  (495 * this.Value ) /  parseInt(this.target_amont) 
        if (lineLen > 495) {
            lineLen = 495
        } 
        const gradient = context.createLinearGradient(0, 0, lineLen , 25);
        gradient.addColorStop(0, this.ColorStart_svg  );        
       // gradient.addColorStop(0.6, "rgba(42, 248, 27, 0.5)"); 
        gradient.addColorStop(1.0, this.ColorEnd_svg);

  
        context.fillStyle =gradient;
        context.beginPath();
        context.roundRect(5, 47, lineLen ,20, 3)
        context.fill();

        // Border
        context.lineWidth = 2;
        context.strokeStyle ="black" ;
        context.beginPath();
        context.moveTo(500,47);
        context.lineTo(500,68);
        context.stroke();

        context.font = (16).toString() + 'px Noto Sans';                
        context.fillStyle = 'black';
        context.fillText(  this.target_amont , 510 , 64);

if (lineLen> 400 ){
        context.font = (16).toString() + 'px Noto Sans';        
        context.fillStyle = 'white';    
        context.fillText(  this.Value.toString() , lineLen-30 , 64);
    
    } else {
        context.font = (16).toString() + 'px Noto Sans';        
        context.fillStyle = 'black';      
        context.fillText(  this.Value.toString() , lineLen +20 , 64);
    } 

     }

}
















