import * as pixi from "pixi.js"
import { Clock } from "./Clock"
import { EntityAnimation } from "./EntityAnimation.new"
import { EntityManager } from "./EntityManager"
import { loadImage } from "./helpers/loadImage"
import { wait } from "./helpers/wait"
import { images } from "./images"

class App {
  private app = new pixi.Application()
  private entityManager = new EntityManager(this.app)
  private animations: EntityAnimation[] = []
  private newAnimationClock = new Clock(8)
  private imageIndex = 0

  constructor() {
    this.app.view.className = "fullscreen"
    this.app.ticker.add(this.handleTick)

    this.handleResize()
    window.addEventListener("resize", this.handleResize)

    this.addAnimation()

    document.body.append(this.app.view)
  }

  private async addAnimation() {
    const image = await loadImage(images[this.imageIndex])
    const animation = new EntityAnimation(this.app, image, this.entityManager)
    this.animations.push(animation)
    this.imageIndex = (this.imageIndex + 1) % images.length

    await wait(2000)

    if (this.animations.length > 1) {
      const prev = this.animations.shift()!
      prev.stop()
    }
  }

  private handleTick = (tickTime: number) => {
    const dt = tickTime / 60

    this.entityManager.update(dt)

    for (const animation of this.animations) {
      animation.update(dt)
    }

    if (this.newAnimationClock.update(dt)) {
      this.addAnimation()
    }
  }

  private handleResize = () => {
    this.app.renderer.resize(window.innerWidth, window.innerHeight)
  }
}

new App()

if (module.hot) {
  module.hot.accept(() => window.location.reload())
}
