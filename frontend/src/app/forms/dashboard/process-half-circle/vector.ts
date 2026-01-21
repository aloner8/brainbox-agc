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

