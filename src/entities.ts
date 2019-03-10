import { animationFrame } from "./helpers/animationFrame"

let instanceId = Date.now()
window.instanceId = instanceId

export const showEntities = async (
  backgroundImagePath: string,
  backgroundOverlay: HTMLCanvasElement,
) => {
  type EntityState = {
    key: string
    x: number
    y: number
    size: number
  }

  let entities: EntityState[] = []
  let newEntityTime = 0

  const update = (dt: number) => {
    if (dt >= 0.5) return

    newEntityTime -= dt
    if (newEntityTime <= 0) {
      newEntityTime = 0.4

      entities.push({
        key: String(Date.now()),
        x: Math.random(),
        y: 1.2,
        size: Math.random() + 0.5,
      })
    }

    for (const ent of entities) {
      ent.y -= ent.size * dt * 0.05
    }

    entities = entities.filter((ent) => ent.y > -0.5)
  }

  backgroundOverlay.width = window.innerWidth
  backgroundOverlay.height = window.innerHeight

  const entityBuffer = document.createElement("canvas")
  entityBuffer.width = backgroundOverlay.width
  entityBuffer.height = backgroundOverlay.height

  const backgroundImage = new Image()
  backgroundImage.src = backgroundImagePath

  const drawEntities = () => {
    const context = entityBuffer.getContext("2d")!
    context.clearRect(0, 0, backgroundOverlay.width, backgroundOverlay.height)

    for (const part of entities) {
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
    drawEntities()

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
      entityBuffer,
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
    if (window.instanceId !== instanceId) break

    const now = await animationFrame()
    const dt = (now - time) / 1000
    time = now

    update(dt)
    draw()
  }

  console.info(`instance ${instanceId} stopped`)
}
