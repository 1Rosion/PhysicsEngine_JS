export class Vector {
    constructor (x = 0, y = 0) {
        this.x = x
        this.y = y
    }

    static dot(v1, v2){
        return v1.x * v2.x + v1.y * v2.y;
    }

    dot(v){
        return this.x * v.x + this.y * v.y;
    }

    static subtract(v1, v2){
        return new Vector(v1.x - v2.x, v1.y - v2.y);
    }

    subtract(v){
        return new Vector(this.x - v.x, this.y - v.y);
    }

    static normalize(v){
        const length = Math.sqrt(v.x * v.x + v.y * v.y);
        return new Vector(v.x / length, v.y / length);
    }

    normalize(){
        const length = Math.sqrt(this.x * this.x + this.y * this.y);
        return new Vector(this.x / length, this.y / length );
    }

    static perpendicular(v){
        return new Vector(-v.y, v.x);
    }

    perpendicular(){
        return new Vector(-this.y, this.x);
    }

    static length(v){
        return Math.sqrt(v.x * v.x + v.y * v.y);
    }

    length(){
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    static distance(v1, v2){
        return Math.sqrt(Math.pow(v1.x - v2.x, 2) + Math.pow(v1.y - v2.y, 2));
    }
}