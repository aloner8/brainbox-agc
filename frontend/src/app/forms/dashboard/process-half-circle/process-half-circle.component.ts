import { Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core'
import { tap, catchError, finalize} from 'rxjs/operators';
import {merge, Subject, throwError} from 'rxjs';

 

export class Vector {
    private m: number= 0;
    private a: number=0;

    constructor(magnitude: number, angle: number) {
        this.setMag(magnitude);
        this.setAngle(angle);
    }

    public getX(): number {
        return this.m * Math.cos(this.a);
    }

    public setX(x: number): void {
        const y = this.m * Math.sin(this.a);
        this.m = Math.sqrt((x * x) + (y * y));
        this.a = Math.atan2(y, x);
    }

    public getY(): number {
        return this.m * Math.sin(this.a);
    }

    public setY(y: number): void {
        const x = this.m * Math.cos(this.a);
        this.m = Math.sqrt((x * x) + (y * y));
        this.a = Math.atan2(y, x);
    }

    public getMag(): number {
        return this.m;
    }

    public setMag(magnitude: number): void {
        this.m = magnitude;
    }

    public getAngle(): number {
        return this.a;
    }

    public setAngle(angle: number): void {
        this.a = angle;
    }

    public add(v: Vector): Vector {
        return Vector.add(this, v);
    }

    public subtract(v: Vector): Vector {
        return Vector.subtract(this, v);
    }

    public static rectangular(x: number, y: number): Vector {
        const m = Math.sqrt(x * x + y * y);
        const a = Math.atan2(y, x);
        return new Vector(m, a);
    }

    public static polar(m: number, a: number): Vector {
        return new Vector(m, a);
    }

    public static add(v1: Vector, v2: Vector): Vector {
        return Vector.rectangular(v1.getX() + v2.getX(), v1.getY() + v2.getY());
    }

    public static subtract(v1: Vector, v2: Vector): Vector {
        return Vector.rectangular(v1.getX() - v2.getX(), v1.getY() - v2.getY());
    }
}



@Component({
    selector: 'process-half-circle',
    templateUrl: './process-half-circle.component.html',
    styleUrls: ['./process-half-circle.component.scss']
})
export class ProgressHalfCircleComponent implements OnInit {

   /*  @Input() Value: number = 100;
    @Input() MaxValue: number = 100;
    @Input() Payout: number = 0.20;
    @Input() Implemented: number = 100; */

    @Input() TargetTotal: number = 100;
    @Input() size: number = 1;
    @Input() Index: number = 0;
    @Input() Parent:Subject<any> = new Subject();
    @Input() Name: string='';

    @ViewChild('clock', { static: true }) myClock!: ElementRef;
    //@ViewChild('canvas', { static: true }) myCanvas!: ElementRef;
  
   
    Value: number = 100;
    MaxValue: number = 100;
    Payout: number = 0.20;
    Implemented: number = 100;
    canvas:any;
    ctx: any;
    persentvalue = 100;
    fullValue =0;
    LabelPartNumber:any = []
   // Vector?:Vector;
    d ='M9.9,29.6c0-8.6,7-15.6,15.6-15.6h200c8.6,0,15.6,7,15.6,15.6c0,8.6-7,15.6-15.6,15.6H25.5C16.9,45.2,9.9,38.2,9.9,29.6z'
    constructor() {
    

        
    }


    ngOnInit() {
        // const canvas: HTMLCanvasElement = this.myCanvas.nativeElement;
        // const context = canvas.getContext('2d');

      const  that = this
    /*     if(context){
            
            this.draw(context)
        } */
    
       
        this.Parent.subscribe(function(d){
        console.log(d)
            
           if(d.target==that.Name){
switch (d.eventname) {
                case 'BinddingObjectTarget':
                  

                const canvasClock: HTMLCanvasElement = that.myClock.nativeElement;
                const contextClock = canvasClock.getContext('2d');
                that.LabelPartNumber = []
                that.Value = d.ObjectTargetTotal.completeidea
                that.MaxValue= d.ObjectTargetTotal.countidea
                that.Payout= d.ObjectTargetTotal.payout
                that.Implemented= d.ObjectTargetTotal.implemented
                let _per_part= that.MaxValue/8
        
                for (let index = 0; index < 8; index++) {
                    let _part =Math.ceil(index *_per_part)  
                    that.LabelPartNumber.push(_part)
                }
                that.LabelPartNumber.push(that.MaxValue)  
                that.persentvalue = (that.Value * 100) / that.MaxValue;
                that.persentvalue=that.persentvalue/100
        
               
                    if(contextClock){
                    //console.log(that.LabelPartNumber)
                        that.drawhaftcircle(contextClock)
                    }
               

            
                    break;
                case 'InitObjectTarget':
                  
                    break;           
                default:
                    break;
            }
           }
            
        })


    // this.persentvalue = (this.Value *270) /this.MaxValue;
    // this.d ='M9.9,29.6c0-8.6,7-15.6,15.6-15.6h'+ this.persentvalue.toString().trim() + 'c8.6,0,15.6,7,15.6,15.6c0,8.6-7,15.6-15.6,15.6H25.5C16.9,45.2,9.9,38.2,9.9,29.6z'

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

    context.clearRect(0, 0, 400, 400);

    context.lineCap = 'round';

   // this.secondHand(context,c,seconds);
   // this.minuteHand(context,c,minutes);
   // this.hourHand(context,c,hours);
     
    this.face(context,c);

    }

    drawhaftcircle(context: CanvasRenderingContext2D): void {
        const that = this
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
             c: { x: number; y: number } = { x: 300* this.size / 2, y: 300* this.size / 2 };
     
         context.clearRect(0, 0, 320* this.size, 320* this.size);
     
        
 
         if(that.persentvalue > 0  && that.MaxValue > 0 ){

         this.haftcircle(context,c);
         }
         }

    haftcircle(context: CanvasRenderingContext2D,c:any): void {
        const that = this
        // Border
        context.lineWidth = 20 * this.size ;
        context.strokeStyle = 'rgba(10, 92, 160, 0.49)';
        context.lineCap = 'butt';
        context.beginPath();
        context.arc(c.x, c.y, 100* this.size, Math.PI , (Math.PI * 2)  );
        context.stroke();

       
        // Create gradient
        const gradient = context.createLinearGradient(0, 0, this.persentvalue *(300 * this.size), 0);
        gradient.addColorStop(0, "rgba(41, 248, 27, 0.04)");        
        gradient.addColorStop(0.6, "rgba(42, 248, 27, 0.5)"); 
        gradient.addColorStop(1.0, "rgba(41, 248, 27,1)");

        context.strokeStyle = gradient;
        context.beginPath();
        
        context.arc(c.x, c.y, 100* this.size, Math.PI , (Math.PI * (1 + this.persentvalue))  );
        context.stroke();
     

        // Dashes
        context.lineCap = 'round';
        context.lineWidth = 2 ;
        for (let i = 0; i < 33; i++) {
            let r: number = 120* this.size,
                l: number = 4* this.size;
            context.strokeStyle = 'rgba(255, 255, 255, 0.43)';
            if (i % 4 === 0)
                r -= l,
                l *= 2,
                context.strokeStyle = 'rgb(255, 255, 255)';
            let v: Vector = new Vector(r, Math.PI * 1 +(i *0.098));
            context.beginPath();
            context.moveTo(v.getX() + c.x, v.getY() + c.y);
            v.setMag(r + l);
            context.lineTo(v.getX() + c.x, v.getY() + c.y);
            context.stroke();
        }

        // Numbers
        context.font = (12 * this.size).toString() + 'px Noto Sans';
        context.fillStyle = 'white';
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        for (let i = 0; i <= 8; i++) {
            let v: Vector = new Vector(140* this.size, Math.PI * 1 +(i *0.39) );
            context.fillText( this.LabelPartNumber[i].toString(), v.getX() + c.x, v.getY() + c.y);
        }
        
        context.font = (14 * this.size).toString() + 'px Noto Sans';
        let _percent =  ((this.Value * 100)/ this.MaxValue).toFixed(2) 
        context.fillText( _percent.toString() + '%' , c.x+10 ,  c.y - 60);

        context.font = (10 * this.size).toString() + 'px Noto Sans';        
        context.fillText( this.Value.toString() + ' Ideass' , c.x+10 ,  c.y - 40);

        context.fillText(  'Completed' , c.x+10 ,  c.y - 20);

    /*     // Center button
        context.beginPath();
        context.arc(c.x, c.y, 3.75, 0, Math.PI * 2);
        context.fillStyle = 'white';
        context.strokeStyle = 'black';
        context.lineWidth = 2.5;
        context.fill();
        context.stroke(); */
    }

face(context: CanvasRenderingContext2D,c:any): void {
        // Border
        context.lineWidth = 5;
        context.strokeStyle = 'black';
        context.beginPath();
        context.arc(c.x, c.y, 140, 0, Math.PI * 2);
        context.stroke();

        // Dashes
        context.lineWidth = 3;
        for (let i = 0; i < 60; i++) {
            let r: number = 135,
                l: number = 5;
            context.strokeStyle = 'rgba(0, 0, 0, 0.25)';
            if (i % 5 === 0)
                r -= l,
                l *= 2,
                context.strokeStyle = 'rgba(0, 0, 0, 0.5)';
            let v: Vector = new Vector(r, Math.PI * 2 * (i / 60) - Math.PI / 2);
            context.beginPath();
            context.moveTo(v.getX() + c.x, v.getY() + c.y);
            v.setMag(r + l);
            context.lineTo(v.getX() + c.x, v.getY() + c.y);
            context.stroke();
        }

        // Numbers
        context.font = '18px Noto Sans';
        context.fillStyle = 'black';
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        for (let i = 1; i <= 12; i++) {
            let v: Vector = new Vector(113, Math.PI * 2 * (i / 12) - Math.PI / 2);
            context.fillText(i.toString(), v.getX() + c.x, v.getY() + c.y);
        }

        // Center button
        context.beginPath();
        context.arc(c.x, c.y, 3.75, 0, Math.PI * 2);
        context.fillStyle = 'white';
        context.strokeStyle = 'black';
        context.lineWidth = 2.5;
        context.fill();
        context.stroke();
    }

secondHand(context: CanvasRenderingContext2D,c:any,seconds:any): void {
        context.lineWidth = 1.5;
        context.strokeStyle = 'black';
        context.beginPath();
        let a: number = Math.PI * 2 * (seconds / 60) - Math.PI / 2;
        let v: Vector = new Vector(95, a);
        let v2: Vector = new Vector(-20, a);
        context.moveTo(v2.getX() + c.x, v2.getY() + c.y);
        context.lineTo(v.getX() + c.x, v.getY() + c.y);
        context.stroke();
    }

minuteHand(context: CanvasRenderingContext2D,c:any,minutes:any): void {
        context.lineWidth = 4;
        context.strokeStyle = 'black';
        context.beginPath();
        let a: number = Math.PI * 2 * (minutes / 60) - Math.PI / 2;
        let v: Vector = new Vector(95, a);
        context.moveTo(c.x, c.y);
        context.lineTo(v.getX() + c.x, v.getY() + c.y);
        context.stroke();
    }

hourHand(context: CanvasRenderingContext2D,c:any,hours:any): void {
        context.lineWidth = 4;
        context.strokeStyle = 'black';
        context.beginPath();
        let a: number = Math.PI * 2 * (hours / 12) - Math.PI / 2;
        let v: Vector = new Vector(60, a);
        context.moveTo(c.x, c.y);
        context.lineTo(v.getX() + c.x, v.getY() + c.y);
        context.stroke();
    }
}





 

















