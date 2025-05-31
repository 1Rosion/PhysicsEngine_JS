import { Vector } from "./vector.js"

function ToRadians(degrees) {
  return degrees * (Math.PI / 180);
}

export class Rectangle {
    constructor (x = 0, y = 0, w = 0, h = 0, a = 0) {
        this.x = x // center coords
        this.y = y

        this.w = w
        this.h = h

        this.a = a // rotation angle 
    }

    getPoints() {
        const diagonal = Math.sqrt(Math.pow(this.h /2, 2) + Math.pow(this.h /2, 2))

        return [
            // 100 - dia * cos(135)
            new Vector(this.x - diagonal * Math.cos(ToRadians(135 + this.a)) , this.y - diagonal * Math.sin(ToRadians(135 + this.a))), // stanga sus
            new Vector(this.x - diagonal * Math.cos(ToRadians(45  + this.a)) , this.y - diagonal * Math.sin(ToRadians(45  + this.a))), // stanga sus
            new Vector(this.x - diagonal * Math.cos(ToRadians(-45 + this.a)) , this.y - diagonal * Math.sin(ToRadians(-45 + this.a))), // stanga sus
            new Vector(this.x - diagonal * Math.cos(ToRadians(225 + this.a)) , this.y - diagonal * Math.sin(ToRadians(225 + this.a))), // stanga sus
        ]
    }

    draw({color = "black", ctx}) {
        if (!ctx) throw new Error("ctx exeption : draw Rect")

        const strokeStyle = ctx.strokeStyle;
        const p = this.getPoints()

        ctx.beginPath()
        ctx.moveTo(p[0].x, p[0].y)
        ctx.lineTo(p[1].x, p[1].y)
        ctx.lineTo(p[2].x, p[2].y)
        ctx.lineTo(p[3].x, p[3].y)
        ctx.closePath();
        
        ctx.strokeStyle = color
        ctx.stroke()
        
        ctx.strokeStyle = strokeStyle
    }
}

export class Circle {
    constructor (x = 0, y = 0, r = 1, a = 0) {
        this.x = x
        this.y = y
        this.r = r

        this.a = a
    }

    draw({color = "black", ctx}) {
        if (!ctx) throw new Error("ctx exeption : draw Circle")

        const strokeStyle = ctx.strokeStyle;

        ctx.beginPath()
        ctx.arc(this.x, this.y, this.r, this.a, Math.PI * 2)

        ctx.strokeStyle = color
        ctx.stroke()
        ctx.strokeStyle = strokeStyle
    }
}
