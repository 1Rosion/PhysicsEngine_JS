import { Rectangle, Circle } from "./shape.js"
import { Vector } from "./vector.js"

// function mixin(target, source) {
//   Object.getOwnPropertyNames(source.constructor.prototype).forEach(name => {
//     if (name !== 'constructor') {
//       target[name] = source[name].bind(source)
//     }
//   })
// }

function clamp(val, min, max) {
    return Math.max(min, Math.min(max, val))
}

export class World {
    constructor(gravityX = 0, gravityY = 0) {
        this.gravityX = gravityX
        this.gravityY = gravityY

        this.colliders = [] // array cu corpuri
        this.collides = [] // sunt ciocnite acum
        this.interacts = [] // erau ciocnite in cadrul trecut

        this.time = Date.now()
        this.friction = 0.05
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

    update() {
        const now = Date.now()
        const dt = (this.time - now) / 100
        this.time = now

        this.colliders.forEach(coll => {
            coll.update(dt);
        });

        this.updateAllCollisions()
        this.updateInteractions()

        this.colliders.forEach(coll => {
            if (coll.type === "dynamic") coll.applyVelocity(dt);
        });
        

        return dt
    }

    draw({color = "black", ctx}){
        if (!ctx) throw new Error("ctx exeption : draw World")

        this.colliders.forEach(collider => {
            collider.draw({color: color, ctx : ctx})
        });
    }

    collides(coll1, coll2) {
        return coll1.collides(coll2)
    }

    updateAllCollisions() {
        this.collides.length = 0

        for(let i = 0; i < this.colliders.length - 1; i++)
            for(let j = i + 1; j < this.colliders.length; j++)
                if(this.colliders[j].collides(this.colliders[i]))
                    this.collides.push([this.colliders[i], this.colliders[j]])

        return this.collides
    }
    
    updateInteractions() {
        for(let i = 0; i < this.collides.length; i++) {
            const e = Math.sqrt(this.collides[i][0].e * this.collides[i][1].e)
            this.resolveStaticCollision(this.collides[i][0], this.collides[i][1])
            this.resolveCollision(this.collides[i][0], this.collides[i][1], e)
        }
    }

    resolveStaticCollision(A, B){
        const n = A.overlap(B)
        if (!n) return;

        const moveA = (1 / A.m) / (1 / A.m + 1 / B.m)
        const moveB = (1 / B.m) / (1 / A.m + 1 / B.m)

        if (A.velocityX - A.velocityY == 0 && A.type != "static"){
            A.x -= n.x * n.overlap * moveA
            A.y -= n.y * n.overlap * moveA
        }

        if (B.velocityX - B.velocityY == 0 && B.type != "static"){
            B.x += n.x * n.overlap * moveB
            B.y += n.y * n.overlap * moveB
        }
    }

    resolveCollision(obj1, obj2, restitution = 0.8) {
        const m1 = obj1.m
        const m2 = obj2.m

        var u1 = obj1.velocityX
        var u2 = obj2.velocityX

        var v1 = ((m1 - restitution * m2) * u1 + (1 + restitution) * m2 * u2) / (m1 + m2)
        var v2 = ((m2 - restitution * m1) * u2 + (1 + restitution) * m1 * u1) / (m1 + m2)

        obj1.setVelocity({x: v1})
        obj2.setVelocity({x: v2})

        var u1 = obj1.velocityY
        var u2 = obj2.velocityY

        var v1 = ((m1 - restitution * m2) * u1 + (1 + restitution) * m2 * u2) / (m1 + m2)
        var v2 = ((m2 - restitution * m1) * u2 + (1 + restitution) * m1 * u1) / (m1 + m2)

        obj1.setVelocity({y: v1})
        obj2.setVelocity({y: v2})
    }

    updateEvents(){
    
    }
}

export class Collider{
    constructor ({
                    type = "static", // static | kinematic | dynamic
                    x = 0, y = 0,
                    w = 1, h = 1, 
                    r = 1, 
                    a = 0, 
                    world,
                    m = 1,
                    e = 0.5,
                    tags = ["collider"]
                }){
        this.x = x
        this.y = y
        this.m = m // mass in kg
        this.e = e > 0 ? e < 1 ? e : e % 1 : 0 // elasticitate
        this.velocityX = 0 // m/s
        this.velocityY = 0 

        this.type = type
        this.world = world
        this.tags = [...tags]

        this.frictionY = 1
        this.frictionX = 1

        this.update = (dt) => {}

        switch (this.type){
            case "dynamic": 
                this.update = (dt) => {
                    if (Math.abs(this.velocityX) < 0.001) this.setVelocity({x: 0})
                    if (Math.abs(this.velocityY) < 0.001) this.setVelocity({y: 0})

                    this.velocityX += this.world.gravityX * dt
                    this.velocityY += this.world.gravityY * dt

                    this.velocityX -= this.velocityX * this.world.friction
                    this.velocityY -= this.velocityY * this.world.friction
                }

                this.setVelocity = ({x = this.velocityX, y = this.velocityY}) => {
                    this.velocityX = x
                    this.velocityY = y
                }
            break
            case "kinematic":
                this.update = (dt) => {

                }
            break
            case "static": 
                this.setVelocity = ({x = this.velocityX, y = this.velocityY}) => {}
            break 
        }
    }

    push(x = 0, y = 0) {
        this.velocityX += x
        this.velocityY += y
    }

    applyVelocity(dt) {
        const newX = this.x + this.velocityX * dt;
        const newY = this.y + this.velocityY * dt;

        // temporar mutăm obiectul și verificăm coliziuni
        const oldX = this.x, oldY = this.y;

        this.x = newX;
        if (this.world.colliders.some(c => c !== this && this.collides(c))) {
            this.x = oldX;
            this.velocityX = 0;
        }

        this.y = newY;
        if (this.world.colliders.some(c => c !== this && this.collides(c))) {
            this.y = oldY;
            this.velocityY = 0;
        }
    }
}

export class RectangleCollider extends Collider {
    constructor (prop = {}){ 
        super(prop)
        this.shape = new Rectangle(prop.w, prop.h, prop.a);
    }

    collides(coll) {
        switch(coll.constructor.name){
            case "RectangleCollider":
                return checkCollisionSAT(this.shape.getPoints(this.x, this.y), coll.shape.getPoints(coll.x, coll.y))
            break
            case "CircleCollider":
                return coll.collides(this)
            break
        }
    }

    overlap(coll){
        switch(coll.constructor.name){
            case "RectangleCollider":
                const [center1, center2] = [{x: this.x, y: this.y}, {x: coll.x, y: coll.y}]
                const d = Vector.subtract(center1, center2)
        
                const overlapX = this.shape.w/2 + coll.shape.w/2 - Math.abs(d.x)
                const overlapY = this.shape.h/2 + coll.shape.h/2 - Math.abs(d.y)
        
                if (overlapX > 0 && overlapY > 0) {
                    if (overlapX < overlapY) {
                        const direction = d.x < 0 ? -1 : 1;
                        return { x: direction * overlapX, y: 0, overlap: overlapX };
                    } else {
                        const direction = d.y < 0 ? -1 : 1;
                        return { x: 0, y: direction * overlapY, overlap: overlapY };
                    }
                }

                return null
            break
            case "CircleCollider":
                coll.overlap(this)
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
                
                return checkCircleSquareCollision({ center: {x: this.x, y: this.y}, radius: this.shape.r }, coll.shape.getPoints(coll.x, coll.y))
            break
            case "CircleCollider":
                return this.shape.r + coll.shape.r > Vector.distance({ x: this.x, y: this.y }, { x: coll.x, y: coll.y })
            break
        }
    }

    overlap(coll) {
        switch (coll.constructor.name){
            case "CircleCollider":
                const d = Vector.subtract({x: this.x, y: this.y}, {x: coll.x, y: coll.y})
                const dist = sqrt(d.x * d.x + d.y * d.y)

                const normalX = d.x / dist
                const normalY = d.y / dist

                const overlap = this.shape.r + coll.shape.r - dist

                if (overlap > 0) {
                    return {
                        x: normalX * overlap,
                        y: normalY * overlap,
                        overlap: overlap
                    }
                }

                return null
            break
            case "RectangleCollider": 
                const cx = this.x
                const cy = this.y
                const r = this.shape.r

                const rx = coll.x
                const ry = coll.y
                const w = coll.shape.w
                const h = coll.shape.h

                const closestX = clamp(cx, rx, rx + w)
                const closestY = clamp(cy, ry, ry + h)

                const dx = cx - closestX
                const dy = cy - closestY
                const distSq = dx * dx + dy * dy

                if (distSq < r * r) {
                    const dist = Math.sqrt(distSq)
                    const overlap = r - dist
                    const nx = dx / dist
                    const ny = dy / dist

                    return {
                        x: nx * overlap,
                        y: ny * overlap,
                        overlap: overlap
                    }
                }

                return null
            break;
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