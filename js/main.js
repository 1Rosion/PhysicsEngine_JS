import { Rectangle } from './shape.js'
import { World, Collider } from './collision.js'

const canvas = document.querySelector("canvas")
const ctx = canvas.getContext("2d")

const world = new World(0, 0)

const Player = {
    body : world.newRectangleCollider({type : "dynamic", x : 100, y : 100, w : 300, h : 300, a : 45, m: 1})
}
let coll1 = world.newCircleCollider({type : "dynamic", x : 150, y : 200, r : 100, a : 0, m : 10})

















// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // //


async function update(){
    world.update()
    requestAnimationFrame(update)
}

requestAnimationFrame(update)

function draw(){
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    world.draw({color: "white", ctx: ctx})
    requestAnimationFrame(draw)
}

requestAnimationFrame(draw)


