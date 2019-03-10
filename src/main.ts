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

const querySelectorSafe = <E extends Element>(selector: string) => {
  const element = document.querySelector(selector)
  if (element == null) {
    throw new Error(`Could not find element with selector "${selector}"`)
  }
  return element as E
}

const applyBackground = () => {
  const backgroundElement = querySelectorSafe<HTMLElement>("#background-image")
  backgroundElement.style.backgroundImage = `url(${images[4]})`
}

const animationFrame = () => new Promise(requestAnimationFrame)

const wait = (ms?: number) => new Promise((resolve) => setTimeout(resolve, ms))

interface Window {
  gameId?: number
}

let gameId = Date.now()
window.gameId = gameId

const showParticles = async () => {
  type ParticleState = {
    key: string
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
      newParticleTime = 0.4

      particles.push({
        key: String(Date.now()),
        x: Math.random(),
        y: 1.2,
        size: Math.random() + 0.5,
      })
    }

    for (const part of particles) {
      part.y -= part.size * dt * 0.05
    }

    particles = particles.filter((part) => part.y > -0.5)
  }

  const backgroundOverlay = querySelectorSafe<HTMLCanvasElement>(
    "#background-overlay",
  )
  backgroundOverlay.width = window.innerWidth
  backgroundOverlay.height = window.innerHeight

  const particleBuffer = document.createElement("canvas")
  particleBuffer.width = backgroundOverlay.width
  particleBuffer.height = backgroundOverlay.height

  const backgroundImage = new Image()
  backgroundImage.src = images[4]

  const drawParticles = () => {
    const context = particleBuffer.getContext("2d")!
    context.clearRect(0, 0, backgroundOverlay.width, backgroundOverlay.height)

    for (const part of particles) {
      const size = part.size * 100

      context.save()

      context.translate(
        part.x * backgroundOverlay.width + -size / 2,
        part.y * backgroundOverlay.height + -size / 2,
      )
      context.rotate(Math.PI * 0.25)

      context.fillStyle = "white"
      context.fillRect(0, 0, size, size)

      context.restore()
    }
  }

  const draw = () => {
    drawParticles()

    const context = backgroundOverlay.getContext("2d")!
    context.clearRect(0, 0, backgroundOverlay.width, backgroundOverlay.height)

    context.globalCompositeOperation = "source-over"
    context.drawImage(
      backgroundImage,
      0,
      0,
      backgroundOverlay.width,
      backgroundOverlay.height,
    )

    context.globalCompositeOperation = "destination-in"
    context.drawImage(
      particleBuffer,
      0,
      0,
      backgroundOverlay.width,
      backgroundOverlay.height,
    )
  }

  for (let i = 0; i < 500; i++) {
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
