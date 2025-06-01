import { Rectangle, Circle } from "./shape.js"
import { Vector } from "./vector.js"

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

    newCircleCollider (props = {}) {
        props.world = this
        const newCollider = new CircleCollider(props)
        this.colliders.push(newCollider)

        return newCollider
    }

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
        this.x = x
        this.y = y
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

export class RectangleCollider extends Collider {
    constructor (prop = {}){ 
        super(prop)
        this.shape = new Rectangle(prop.w, prop.h, prop.a);
    }

    collides(coll) {
        switch(coll.name){
            case "RectangleCollider":
                return checkCollisionSAT(this.shape.getPoints(), coll.shape.getPoints())
            break
            case "CircleCollider":
                return coll.collides(this)
            break
        }
    }

    draw(prop = {}) {
        this.shape.draw({...prop, x: this.x, y: this.y})
    }
}

export class CircleCollider extends Collider {
    constructor (prop = {}){ 
        super(prop)
        this.shape = new Circle(prop.r, prop.a);
    }

    collides(coll) {
        switch(coll.constructor.name){
            case "RectangleCollider":
                const points = coll.shape.getPoints(coll.x, coll.y)

                for (let i = 0; i < points.length; i++)
                    if (this.shape.r > Vector.distance({ x: this.x, y: this.y }, points[i])) return true
                


                return checkCircleSquareCollision({ center: {x: this.x, y: this.y}, radius: this.shape.r }, coll.shape.getPoints(coll.x, coll.y))
            break
            case "CircleCollider":
                return this.shape.r + coll.shape.r > Vector.distance({ x: this.x, y: this.y }, { x: coll.x, y: coll.y })
            break
        }
    }

    draw(prop = {}) {
        this.shape.draw({...prop, x: this.x, y: this.y})
    }
}

function projectPolygon(axis, points) {
    let min = Vector.dot(points[0], axis);
    let max = min;
    for (let i = 1; i < points.length; i++) {
        const p = Vector.dot(points[i], axis);
        if (p < min) min = p;
        if (p > max) max = p;
    }
    return { min, max };
}

function overlaps(proj1, proj2) {
    return proj1.max >= proj2.min && proj2.max >= proj1.min;
}

function getAxes(points) {
    const axes = [];
    for (let i = 0; i < points.length; i++) {
        const next = (i + 1) % points.length;
        const edge = Vector.subtract(points[next], points[i]);
        const normal = Vector.normalize(Vector.perpendicular(edge));
        axes.push(normal);
    }
    return axes;
}

function checkCollisionSAT(polygon1, polygon2) {
    const axes = [...getAxes(polygon1), ...getAxes(polygon2)];
    for (const axis of axes) {
        const proj1 = projectPolygon(axis, polygon1);
        const proj2 = projectPolygon(axis, polygon2);
        if (!overlaps(proj1, proj2)) {
            return false;
        }
    }

  return true;
}

function lengthSquared(v) {
  return v.x * v.x + v.y * v.y;
}

function pointInPolygon(p, polygon) {
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const pi = polygon[i], pj = polygon[j];
    if ((pi.y > p.y) !== (pj.y > p.y) &&
        p.x < (pj.x - pi.x) * (p.y - pi.y) / (pj.y - pi.y) + pi.x)
      inside = !inside;
  }
  return inside;
}

function checkCircleSquareCollision(circle, square) {
  for (let i = 0; i < square.length; i++) {
    const a = square[i];
    const b = square[(i + 1) % square.length];
    const closest = closestPointOnSegment(circle.center, a, b);
    const dist2 = lengthSquared(Vector.subtract(circle.center, closest));
    if (dist2 <= circle.radius * circle.radius) return true;
  }

  if (pointInPolygon(circle.center, square)) return true;

  return false;
}

function closestPointOnSegment(p, a, b) {
  const ab = Vector.subtract(b, a);
  const ap = Vector.subtract(p, a);
  const t = Math.max(0, Math.min(1, Vector.dot(ap, ab) / Vector.dot(ab, ab)));
  return { x: a.x + t * ab.x, y: a.y + t * ab.y };
}