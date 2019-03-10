import { Container, filters, Sprite } from "pixi.js"

type EntityState = {
  key: string
  x: number
  y: number
  size: number
}

export class EntityAnimation {
  public container = new Container()
  private background = Sprite.from(this.backgroundImage as any)

  constructor(
    private backgroundImage: HTMLImageElement,
    private entities: EntityState[] = [],
  ) {
    this.background.alpha = 0.5
    this.background.anchor.set(0.5, 0.5)
    this.background.filters = [new filters.BlurFilter()]

    this.container.addChild(this.background)
  }

  async start() {
    // document.body.append(this.app.view)
    // this.app.ticker.add(this.handleTick)
    // this.app.start()
  }

  stop() {
    // this.app.ticker.remove(this.handleTick)
    // this.app.ticker.stop()
    // this.app.ticker.destroy()
    // this.app.stop()
    // this.app.destroy(true)
  }

  cloneEntities() {
    return JSON.parse(JSON.stringify(this.entities))
  }

  private handleTick = (frameTime: number) => {
    console.log("tick")

    // convert the weird frameTime unit to seconds
    const dt = 60 / frameTime
    // console.log(frameTime)
    // console.log(dt)

    this.updateBackground()
  }

  private updateBackground = () => {
    // this.background.position.set(
    //   this.app.view.width / 2,
    //   this.app.view.height / 2,
    // )
    // this.background.scale.set(
    //   Math.max(
    //     this.app.view.width / this.backgroundImage.width,
    //     this.app.view.height / this.backgroundImage.height,
    //   ),
    // )
  }
}
