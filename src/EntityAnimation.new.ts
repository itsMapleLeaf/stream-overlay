import { DropShadowFilter } from "@pixi/filter-drop-shadow"
import * as pixi from "pixi.js"
import { randomRange } from "./helpers/randomRange"

type EntityState = {
  key: string
  x: number
  y: number
  size: number
}

export class EntityAnimation {
  private container: pixi.Container
  private background: pixi.Sprite
  private overlay: pixi.Sprite
  private entityMask: pixi.Graphics

  private newEntityTime = 0
  private readonly newEntityPeriod = 0.4

  constructor(
    private app: pixi.Application,
    private backgroundImage: HTMLImageElement,
    private entities: EntityState[] = [],
  ) {
    this.background = pixi.Sprite.from(this.backgroundImage)
    this.background.alpha = 0.5
    this.background.anchor.set(0.5, 0.5)
    this.background.filters = [new pixi.filters.BlurFilter()]

    this.entityMask = new pixi.Graphics()

    this.overlay = pixi.Sprite.from(this.backgroundImage)
    this.overlay.mask = this.entityMask
    this.overlay.anchor.set(0.5, 0.5)
    this.overlay.filters = [
      new DropShadowFilter({ alpha: 0.4, blur: 4, distance: 0 }),
    ]

    this.container = new pixi.Container()
    this.container.addChild(this.background, this.overlay)

    app.stage.addChild(this.container)

    // run a few update cycles so we have some entities to start out with
    if (this.entities.length === 0) {
      for (let i = 0; i < 200; i++) {
        this.updateEntities(0.1)
      }
    }
  }

  cloneEntities() {
    return JSON.parse(JSON.stringify(this.entities))
  }

  update(dt: number) {
    this.updateEntities(dt)
    this.updateBackground()

    this.renderEntities()
  }

  private updateEntities(dt: number) {
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

  private renderEntities() {
    const g = this.entityMask

    g.clear()
    g.lineStyle(0)

    for (const part of this.entities) {
      const size =
        part.size * Math.min(window.innerWidth, window.innerHeight) * 0.2

      const x = part.x * this.app.view.width + -size / 2
      const y = part.y * this.app.view.height + -size / 2

      g.beginFill(0xffffff)
      g.moveTo(x, y - size / 2)
      g.lineTo(x + size / 2, y)
      g.lineTo(x, y + size / 2)
      g.lineTo(x - size / 2, y)
      g.endFill()
    }
  }

  private updateBackground() {
    const { width, height } = this.app.view
    const { width: bgWidth, height: bgHeight } = this.backgroundImage

    const position = new pixi.Point(width / 2, height / 2)
    const scale = Math.max(width / bgWidth, height / bgHeight)

    this.background.position.copy(position)
    this.background.scale.set(scale * 1.05) // add extra scale for minor distortion effect

    this.overlay.position.copy(position)
    this.overlay.scale.set(scale)
  }
}
