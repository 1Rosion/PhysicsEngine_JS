import * as shape from "./shape.js"
import { Rectangle } from "./shape.js"

function mixin(target, source) {
  Object.getOwnPropertyNames(source.constructor.prototype).forEach(name => {
    if (name !== 'constructor') {
      target[name] = source[name].bind(source)
    }
  })
}

export class World {
    constructor(gravityX = 1, gravityY = 0) {
        this.gravityX = gravityX
        this.gravityY = gravityY

        this.colliders = []
    }

    newRectangleCollider (props = {}) {
        props.world = this
        const newCollider = new RectangleCollider(props)
        this.colliders.push(newCollider)

        return newCollider
    }

    // newCircleCollider (props = {}) {
    //     props.world = this
    //     const newCollider = new CircleCollider(props)
    //     this.colliders.push(newCollider)

    //     return newCollider
    // }

    update(dt) {
        this.colliders.forEach(coll => {
            coll.update(dt);
        });
    }

    draw(ctx){
        if (!ctx) throw new Error("ctx exeption : draw World")

        this.colliders.forEach(collider => {
            collider.draw({ctx : ctx})
        });
    }

    // collides(coll1, coll2) {
    //     const arr = [coll1.shapeName, coll2.shapeName]
    //     arr.sort()
    // }
}

export class Collider{
    constructor ({
                  type = "static", // static | kinematic | dynamic
                  x = 0, y = 0, 
                  w = 1, h = 1, 
                  r = 1, 
                  a = 0, 
                  world
                }){ 
        this.m = 1 // mass in kg

        this.velocityX = 0 // m/s
        this.velocityY = 0 

        this.type = type

        this.update = (dt) => {}

        switch (this.type){
            case "dynamic": 
                this.update = (dt) => {
                    
                }
            break // poate fi modificat de forte din cod dar si din joc
            case "kinematic":
                this.update = (dt) => {

                }
            break // starea poate sa se modifice din cod
            case "static": break // nu poate fi modificat de forte
        }
    }

    push(x = 0, y = 0) {
        this.velocityX += x
        this.velocityY += y
    }
}

export class RectangleCollider {
    constructor (prop = {}){ 
        const body = new Collider(prop)
        const shape = new Rectangle(prop.x, prop.y, prop.w, prop.h, prop.a);

        mixin(this, body)
        mixin(this, shape)

    }

    collides(coll) {
        switch(this.constructor.name){
            case "RectangleCollider":



            break
        }
        
    }
}