import { EntityAnimation } from "./EntityAnimation"
import { loadImage } from "./helpers/loadImage"
import { wait } from "./helpers/wait"
import { images } from "./images"

const main = async () => {
  // this "instanceId" logic makes it so that this loop will stop
  // when others get hot-reloaded in during development
  const instanceId = Date.now()
  window.currentInstanceId = instanceId

  document.body.innerHTML = ""

  let currentImageIndex = 0

  const image = await loadImage(images[currentImageIndex])
  let currentAnimation = new EntityAnimation(image)
  currentAnimation.start()

  while (window.currentInstanceId === instanceId) {
    currentImageIndex = (currentImageIndex + 1) % images.length

    // preload the next image during the delay
    const [image] = await Promise.all([
      loadImage(images[currentImageIndex]),
      wait(5000),
    ])

    const nextAnimation = new EntityAnimation(image)
    nextAnimation.start()

    // let the next animation fade in fully before deleting the previous one
    await wait(2500)

    currentAnimation.stop()
    currentAnimation = nextAnimation
  }
}

main()
