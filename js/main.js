import { Rectangle } from './shape.js'
import { World, Collider } from './collision.js'

const canvas = document.querySelector("canvas")
const ctx = canvas.getContext("2d")

const world = new World(100, 100)

const Player = {
    body : world.newRectangleCollider({type : "dynamic", x : 500, y : 100, w : 200, h : 200, a : 0, m: 1})
}

// Player.body.push(0, -300)
let coll1 = world.newCircleCollider({type : "dynamic", x : 150, y : 200, r : 100, a : 0, m : 10})
// let coll2 = world.newCircleCollider({type : "static", x : 260, y : 320, r : 100, a : 0, m : 10})
let coll4 = world.newRectangleCollider({type : "static", x : 500, y : 400, w: 1000, h: 100, a : 0, m : 10})
// let coll5 = world.newRectangleCollider({type : "static", x : 500, y : 30, w: 1000, h: 100, a : 0, m : 10})

















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


