import { DropShadowFilter } from "@pixi/filter-drop-shadow"
import * as pixi from "pixi.js"
import { EntityManager } from "./EntityManager"

export class EntityAnimation {
  private container: pixi.Container
  private backgroundSprite: pixi.Sprite
  private overlay: pixi.Sprite
  private solidBackground: pixi.Graphics

  constructor(
    private app: pixi.Application,
    private backgroundImage: HTMLImageElement,
    entityManager: EntityManager,
  ) {
    this.backgroundSprite = pixi.Sprite.from(this.backgroundImage)
    this.backgroundSprite.alpha = 0.5
    this.backgroundSprite.anchor.set(0.5, 0.5)
    this.backgroundSprite.filters = [new pixi.filters.BlurFilter(3)]

    this.overlay = pixi.Sprite.from(this.backgroundImage)
    this.overlay.mask = entityManager.entityMask
    this.overlay.anchor.set(0.5, 0.5)
    this.overlay.filters = [
      new DropShadowFilter({ alpha: 0.4, blur: 4, distance: 0 }),
    ]

    this.solidBackground = new pixi.Graphics()
    this.solidBackground.beginFill(0x000000, 1)
    this.solidBackground.lineStyle(0)
    this.solidBackground.drawRect(0, 0, app.view.width, app.view.height)
    this.solidBackground.endFill()

    this.container = new pixi.Container()
    this.container.alpha = 0
    this.container.addChild<pixi.DisplayObject>(
      this.solidBackground,
      this.backgroundSprite,
      this.overlay,
    )

    app.stage.addChild(this.container)
  }

  update(dt: number) {
    this.updateBackground()

    this.container.alpha =
      this.container.alpha + (1 - this.container.alpha) * dt * 2
  }

  stop() {
    this.container.destroy()
  }

  private updateBackground() {
    const { width, height } = this.app.view
    const { width: bgWidth, height: bgHeight } = this.backgroundImage

    const center = new pixi.Point(width / 2, height / 2)
    const scale = Math.max(width / bgWidth, height / bgHeight)

    this.solidBackground.width = width
    this.solidBackground.height = height

    this.backgroundSprite.position.copy(center)
    this.backgroundSprite.scale.set(scale * 1.05) // add extra scale for minor distortion effect

    this.overlay.position.copy(center)
    this.overlay.scale.set(scale)
  }
}
