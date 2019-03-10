import { animationFrame } from "./helpers/animationFrame"
import { randomRange } from "./helpers/randomRange"

type EntityState = {
  key: string
  x: number
  y: number
  size: number
}

export class EntityAnimation {
  private backgroundElement: HTMLElement
  private overlayElement: HTMLCanvasElement
  private entityBuffer: HTMLCanvasElement
  private container: HTMLElement

  private newEntityTime = 0
  private readonly newEntityPeriod = 0.4

  private isRunning = false

  constructor(
    private backgroundImage: HTMLImageElement,
    private entities: EntityState[] = [],
  ) {
    this.backgroundElement = document.createElement("div")
    this.backgroundElement.className = "fill-area cover-bg background-image"
    this.backgroundElement.style.backgroundImage = `url(${backgroundImage.src})`

    this.overlayElement = document.createElement("canvas")
    this.overlayElement.className = "fill-area cover-bg background-overlay"

    this.entityBuffer = document.createElement("canvas")

    this.container = document.createElement("div")
    this.container.className = "fullscreen fade"
    this.container.style.backgroundColor = "black"
    this.container.append(this.backgroundElement, this.overlayElement)

    this.updateCanvasResolution()
  }

  async start() {
    // run a few update cycles so we have some entities to start out with
    if (this.entities.length === 0) {
      for (let i = 0; i < 200; i++) {
        this.update(0.1)
      }
    }

    document.body.append(this.container)

    window.addEventListener("resize", this.updateCanvasResolution)

    let time = await animationFrame()
    this.isRunning = true

    while (this.isRunning) {
      const now = await animationFrame()
      const dt = (now - time) / 1000
      time = now

      this.update(dt)
      this.draw()
    }

    this.container.remove()
    window.removeEventListener("resize", this.updateCanvasResolution)
  }

  stop() {
    this.isRunning = false
  }

  cloneEntities(): EntityState[] {
    return JSON.parse(JSON.stringify(this.entities))
  }

  private updateCanvasResolution = () => {
    this.overlayElement.width = window.innerWidth
    this.overlayElement.height = window.innerHeight

    this.entityBuffer.width = this.overlayElement.width
    this.entityBuffer.height = this.overlayElement.height
  }

  private update(dt: number) {
    if (dt >= 0.5) return

    this.newEntityTime -= dt
    if (this.newEntityTime <= 0) {
      this.newEntityTime = this.newEntityPeriod

      this.entities.push({
        key: String(Date.now()),
        x: Math.random(),
        y: 1.2,
        size: randomRange(0.2, 1.5),
      })
    }

    for (const ent of this.entities) {
      ent.y -= ent.size * dt * 0.08
    }

    this.entities = this.entities.filter((ent) => ent.y > -0.5)
  }

  private drawEntities() {
    const context = this.entityBuffer.getContext("2d")!

    context.clearRect(
      0,
      0,
      this.overlayElement.width,
      this.overlayElement.height,
    )

    for (const part of this.entities) {
      const size =
        part.size * Math.min(window.innerWidth, window.innerHeight) * 0.15

      const x = part.x * this.overlayElement.width + -size / 2
      const y = part.y * this.overlayElement.height + -size / 2

      context.save()

      context.translate(x, y)
      context.rotate(Math.PI * 0.25)

      context.fillStyle = "white"
      context.fillRect(0, 0, size, size)

      context.restore()
    }
  }

  private draw() {
    this.drawEntities()

    const context = this.overlayElement.getContext("2d")!

    const destinationArea: [number, number, number, number] = [
      0,
      0,
      this.overlayElement.width,
      this.overlayElement.height,
    ]

    context.clearRect(...destinationArea)

    context.globalCompositeOperation = "source-over"
    context.drawImage(this.backgroundImage, ...destinationArea)

    context.globalCompositeOperation = "destination-in"
    context.drawImage(this.entityBuffer, ...destinationArea)
  }
}
