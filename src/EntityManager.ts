import * as pixi from "pixi.js"
import { Clock } from "./Clock"
import { randomRange } from "./helpers/randomRange"

type EntityState = {
  key: string
  x: number
  y: number
  size: number
}

export class EntityManager {
  private entities: EntityState[] = []
  entityMask = new pixi.Graphics()

  private newEntityClock = new Clock(0.4)

  constructor(private app: pixi.Application) {
    // run a few update cycles so we have some entities to start out with
    if (this.entities.length === 0) {
      for (let i = 0; i < 200; i++) {
        this.update(0.1)
      }
    }
  }

  update(dt: number) {
    this.updateEntities(dt)
    this.renderMask()
  }

  private updateEntities(dt: number) {
    if (dt >= 0.5) return

    if (this.newEntityClock.update(dt)) {
      this.entities.push({
        key: String(Date.now()),
        x: Math.random(),
        y: 1.4,
        size: randomRange(0.2, 1.5),
      })
    }

    for (const ent of this.entities) {
      ent.y -= ent.size * dt * 0.08
    }

    this.entities = this.entities.filter((ent) => ent.y > -0.5)
  }

  private renderMask() {
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
}
