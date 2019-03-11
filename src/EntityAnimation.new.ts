import { DropShadowFilter } from "@pixi/filter-drop-shadow"
import * as pixi from "pixi.js"
import { EntityManager } from "./EntityManager"

export class EntityAnimation {
  private container: pixi.Container
  private background: pixi.Sprite
  private overlay: pixi.Sprite

  constructor(
    private app: pixi.Application,
    private backgroundImage: HTMLImageElement,
    entityManager: EntityManager,
  ) {
    this.background = pixi.Sprite.from(this.backgroundImage)
    this.background.alpha = 0.5
    this.background.anchor.set(0.5, 0.5)
    this.background.filters = [new pixi.filters.BlurFilter(3)]

    this.overlay = pixi.Sprite.from(this.backgroundImage)
    this.overlay.mask = entityManager.entityMask
    this.overlay.anchor.set(0.5, 0.5)
    this.overlay.filters = [
      new DropShadowFilter({ alpha: 0.4, blur: 4, distance: 0 }),
    ]

    this.container = new pixi.Container()
    this.container.addChild(this.background, this.overlay)

    app.stage.addChild(this.container)
  }

  update(dt: number) {
    this.updateBackground()
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
