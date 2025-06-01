import { Rectangle } from './shape.js'
import { World, Collider } from './collision.js'

const canvas = document.querySelector("canvas")
const ctx = canvas.getContext("2d")

const world = new World()

const Player = {
    body : world.newRectangleCollider({type : "dynamic", x : 100, y : 100, w : 300, h : 300, a : 45})
}

const h1 = document.getElementsByTagName("H1")[0];
let coll1 = world.newCircleCollider({type : "dynamic", x : 150, y : 200, r : 100, a : 0})

function draw(){
    ctx.clearRect(0, 0, 1000, 1000)
    world.draw(ctx);

    h1.innerHTML = coll1.collides(Player.body);
}

setInterval(draw, 10)

