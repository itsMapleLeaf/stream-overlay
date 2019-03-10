import { h, render } from "preact"

type ImageModuleMap = {
  [id in string]?: {
    png?: string
    jpg?: string
  }
}

const imageModuleMap: ImageModuleMap = require("./images/*.@(png|jpg)")

const isNonNil = <T extends any>(
  value: T | undefined | null | void,
): value is T => value != null

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
  const backgroundOverlay = querySelectorSafe<HTMLElement>(
    "#background-overlay",
  )
  backgroundElement.style.backgroundImage = `url(${images[0]})`
  backgroundOverlay.style.backgroundImage = `url(${images[0]})`
}

const animationFrame = () => new Promise(requestAnimationFrame)

const wait = (ms?: number) => new Promise((resolve) => setTimeout(resolve, ms))

declare global {
  interface Window {
    gameId?: number
  }
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

  const backgroundOverlayClip = querySelectorSafe("#backgroundOverlayClip")

  const draw = () => {
    const svgRects = particles.map((part) => {
      const size = part.size * 100

      const transform = `
        translate(${part.x * window.innerWidth} ${part.y * window.innerHeight})
        rotate(45)
      `

      return (
        <rect x={0} y={0} width={size} height={size} transform={transform} />
      )
    })

    backgroundOverlayClip.innerHTML = ""
    render(svgRects, backgroundOverlayClip)
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