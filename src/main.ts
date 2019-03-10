import { Application } from "pixi.js"
import { EntityAnimation } from "./EntityAnimation.new"
import { loadImage } from "./helpers/loadImage"
import { images } from "./images"

const main = async () => {
  const app = new Application()
  app.view.className = "fullscreen"

  const image = await loadImage(images[2])
  const animation = new EntityAnimation(app, image)

  app.ticker.add((tickTime: number) => {
    const dt = tickTime / 60
    animation.update(dt)
  })

  const handleResize = () => {
    app.renderer.resize(window.innerWidth, window.innerHeight)
  }

  handleResize()
  window.addEventListener("resize", handleResize)

  document.body.append(app.view)
}

main().catch(console.error)

if (module.hot) {
  module.hot.accept(() => window.location.reload())
}
