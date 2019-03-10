import { Application } from "pixi.js"
import { EntityAnimation } from "./EntityAnimation.new"
import { loadImage } from "./helpers/loadImage"
import { images } from "./images"

const main = async () => {
  const app = new Application()

  const image = await loadImage(images[0])
  const animation = new EntityAnimation(image)

  app.stage.addChild(animation.container)

  // this "instanceId" logic makes it so that this loop will stop
  // when others get hot-reloaded in during development
  // const instanceId = Date.now()
  // window.currentInstanceId = instanceId

  // document.body.innerHTML = ""

  // let currentImageIndex = 0

  // const image = await loadImage(images[currentImageIndex])
  // let currentAnimation = new EntityAnimation(image)
  // currentAnimation.start()

  // while (window.currentInstanceId === instanceId) {
  //   await wait(500)
  // }

  // currentAnimation.stop()
}

main()
