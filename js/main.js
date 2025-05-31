import { Rectangle } from './shape.js'
import { World, Collider } from './collision.js'

const canvas = document.querySelector("canvas")
const ctx = canvas.getContext("2d")

const world = new World()

const Player = {
    body : world.newRectangleCollider({shapeName : "rect", type : "dynamic", x : 100, y : 100, w : 100, h : 100, a : 0})
}

function draw(){
    ctx.clearRect(0, 0, 1000, 1000)
    world.draw(ctx);
}

setInterval(draw, 10)

