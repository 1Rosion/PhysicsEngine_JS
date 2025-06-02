import { Vector } from "./vector.js"

function ToRadians(degrees) {
  return degrees * (Math.PI / 180);
}

export class Rectangle {
    constructor (w = 0, h = 0, a = 0) {
        this.w = w
        this.h = h

        this.a = a // rotation angle 
    }

    getPoints(x = 0, y = 0) {
        const hw = this.w / 2
        const hh = this.h / 2
        const angle = ToRadians(this.a)

        const corners = [
            { dx: -hw, dy: -hh },
            { dx:  hw, dy: -hh },
            { dx:  hw, dy:  hh },
            { dx: -hw, dy:  hh },
        ]

        return corners.map(({ dx, dy }) => {
            const rotatedX = dx * Math.cos(angle) - dy * Math.sin(angle)
            const rotatedY = dx * Math.sin(angle) + dy * Math.cos(angle)
            return new Vector(x + rotatedX, y + rotatedY)
        })
    }

    draw({x = 0, y = 0, color = "black", ctx}) {
        if (!ctx) throw new Error("ctx exeption : draw Rect")

        const strokeStyle = ctx.strokeStyle;
        const p = this.getPoints(x, y)

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
    constructor (r = 1, a = 0) {
        this.r = r

        this.a = a
    }

    draw({x = 0, y = 0, color = "black", ctx}) {
        if (!ctx) throw new Error("ctx exeption : draw Circle")

        const strokeStyle = ctx.strokeStyle;

        ctx.beginPath()
        ctx.arc(x, y, this.r, this.a, Math.PI * 2 + this.a)

        ctx.strokeStyle = color
        ctx.stroke()
        ctx.strokeStyle = strokeStyle
    }
}
