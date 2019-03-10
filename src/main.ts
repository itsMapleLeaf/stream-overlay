type ImageModuleMap = {
  [id in string]?: {
    png?: string
    jpg?: string
  }
}

const imageModuleMap: ImageModuleMap = require("./images/*.@(png|jpg)")

const isNonNil = <T>(value: T | undefined | null | void): value is T =>
  value != null

const images = Object.values(imageModuleMap)
  .filter(isNonNil)
  .map((entry) => entry.png || entry.jpg)
  .filter(isNonNil)

const querySelectorSafe = <E extends HTMLElement>(selector: string) => {
  const element = document.querySelector(selector)
  if (element == null) {
    throw new Error(`Could not find element with selector "${selector}"`)
  }
  return element as E
}

const applyBackground = () => {
  const backgroundElement = querySelectorSafe("#background-image")
  backgroundElement.style.backgroundImage = `url(${images[0]})`
}

const animationFrame = () => new Promise(requestAnimationFrame)

const wait = (ms?: number) => new Promise((resolve) => setTimeout(resolve, ms))

interface Window {
  gameId?: number
}

let gameId = Date.now()
window.gameId = gameId

const showParticles = async () => {
  const canvas = querySelectorSafe<HTMLCanvasElement>("#particles")
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight

  const context = canvas.getContext("2d")!

  type ParticleState = {
    x: number
    y: number
    size: number
  }

  let particles: ParticleState[] = []
  let newParticleTime = 0

  const update = (dt: number) => {
    if (dt >= 0.5) return

    newParticleTime -= dt
    if (newParticleTime <= 0) {
      newParticleTime = 0.5

      particles.push({
        x: Math.random(),
        y: 1.2,
        size: Math.random() + 0.5,
      })
    }

    for (const part of particles) {
      part.y -= part.size * dt * 0.1
    }

    particles = particles.filter((part) => part.y > -0.5)
  }

  const draw = () => {
    context.clearRect(0, 0, canvas.width, canvas.height)

    for (const part of particles) {
      context.save()

      const x = canvas.width * part.x
      const y = canvas.height * part.y
      const size = part.size * 100

      context.translate(x, y)
      context.rotate(Math.PI * 0.25)

      context.fillStyle = "rgba(255, 255, 255, 0.1)"
      context.fillRect(0, 0, size, size)

      context.restore()
    }
  }

  for (let i = 0; i < 100; i++) {
    update(0.1)
  }

  let time = await animationFrame()
  while (true) {
    if (window.gameId !== gameId) break

    const now = await animationFrame()
    const dt = (now - time) / 1000
    time = now

    update(dt)
    draw()
  }

  console.info(`instance ${gameId} stopped`)
}

const main = () => {
  applyBackground()
  showParticles()
}

main()
