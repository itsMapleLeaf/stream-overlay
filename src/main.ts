import { Clock } from "./Clock"
import { gameLoop } from "./helpers/gameLoop"
import { lerp, sinIn, sinOut } from "./helpers/lerp"
import { randomRange } from "./helpers/randomRange"

const canvas = document.querySelector("canvas")!
const context = canvas.getContext("2d")!

type Sprite = {
  x: number
  yTarget: number
  translateProgress: number
  vanishProgress: number
  size: number
}

const sprites = new Set<Sprite>()
const spriteSpawnClock = new Clock(1)

function fixCanvasSize() {
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
}

function update(dt: number) {
  if (spriteSpawnClock.update(dt)) {
    sprites.add({
      x: randomRange(0.05, 0.95),
      yTarget: randomRange(0.2, 0.95),
      translateProgress: 0,
      vanishProgress: 0,
      size: randomRange(0.5, 1),
    })
  }

  for (const sprite of sprites) {
    if (sprite.translateProgress < 1) {
      sprite.translateProgress = Math.min(
        sprite.translateProgress + dt * (1 / 3),
        1,
      )
      continue
    }

    if (sprite.vanishProgress < 1) {
      sprite.vanishProgress = Math.min(sprite.vanishProgress + dt * 2, 1)
      continue
    }

    if (sprite.vanishProgress >= 1) {
      sprites.delete(sprite)
    }
  }
}

function drawDiamond(x: number, y: number, size: number) {
  context.save()

  context.translate(x, y)
  context.rotate(Math.PI * 0.25)
  context.translate(-size / 2, -size / 2)

  context.fillRect(0, 0, size, size)

  context.restore()
}

function draw() {
  context.clearRect(0, 0, canvas.width, canvas.height)
  context.fillStyle = "white"

  for (const sprite of sprites) {
    const x = sprite.x * canvas.width

    const y = lerp(
      canvas.height * (sprite.yTarget + 1),
      canvas.height * sprite.yTarget,
      sprite.translateProgress,
      sinOut,
    )

    const size = Math.max(canvas.width, canvas.height) * 0.065 * sprite.size

    drawDiamond(x, y, size)

    context.save()
    context.globalCompositeOperation = "destination-out"
    drawDiamond(x, y, lerp(0, size, sprite.vanishProgress, sinIn))
    context.restore()
  }
}

function runFrame(dt: number) {
  update(dt)
  draw()
}

async function main() {
  window.addEventListener("resize", fixCanvasSize)
  fixCanvasSize()

  for await (const delta of gameLoop()) {
    runFrame(delta / 1000)
  }
}

main().catch(console.error)
