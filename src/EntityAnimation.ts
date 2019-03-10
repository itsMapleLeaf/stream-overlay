import { animationFrame } from "./helpers/animationFrame"

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

  private entities: EntityState[] = []

  private newEntityTime = 0
  private readonly newEntityPeriod = 0.4

  private isRunning = false

  constructor(private backgroundImage: HTMLImageElement) {
    this.backgroundElement = document.createElement("div")
    this.backgroundElement.className = "fill-area cover-bg background-image"
    this.backgroundElement.style.backgroundImage = `url(${backgroundImage.src})`

    this.overlayElement = document.createElement("canvas")
    this.overlayElement.className = "fill-area cover-bg background-overlay"
    this.overlayElement.width = window.innerWidth
    this.overlayElement.height = window.innerHeight

    this.entityBuffer = document.createElement("canvas")
    this.entityBuffer.width = this.overlayElement.width
    this.entityBuffer.height = this.overlayElement.height

    this.container = document.createElement("div")
    this.container.className = "fullscreen fade"
    this.container.style.backgroundColor = "black"
    this.container.append(this.backgroundElement, this.overlayElement)
  }

  async start() {
    document.body.append(this.container)
    this.isRunning = true

    for (let i = 0; i < 200; i++) {
      this.update(0.1)
    }

    let time = await animationFrame()
    while (this.isRunning) {
      const now = await animationFrame()
      const dt = (now - time) / 1000
      time = now

      this.update(dt)
      this.draw()
    }

    this.container.remove()
  }

  stop() {
    this.isRunning = false
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
        size: Math.random() * 1.5 + 0.5,
      })
    }

    for (const ent of this.entities) {
      ent.y -= ent.size * dt * 0.05
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
      const size = part.size * 100
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
