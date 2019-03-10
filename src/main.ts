import { showEntities } from "./entities"
import { loadImage } from "./helpers/loadImage"
import { wait } from "./helpers/wait"
import { images } from "./images"

const createBackgroundAnimation = (image: HTMLImageElement) => {
  const backgroundElement = document.createElement("div")
  backgroundElement.className = "fill-area cover-bg background-image"
  backgroundElement.style.backgroundImage = `url(${image.src})`

  const overlayElement = document.createElement("canvas")
  overlayElement.className = "fill-area cover-bg background-overlay"
  showEntities(image, overlayElement)

  const container = document.createElement("div")
  container.className = "fullscreen fade"
  container.style.backgroundColor = "black"
  container.append(backgroundElement, overlayElement)

  return container
}

const showAnimation = (image: HTMLImageElement) => {
  const container = createBackgroundAnimation(image)
  document.body.append(container)
  return container
}

const main = async () => {
  document.body.innerHTML = ""

  let currentImageIndex = 0

  const image = await loadImage(images[currentImageIndex])
  let currentAnimation = showAnimation(image)

  while (true) {
    currentImageIndex = (currentImageIndex + 1) % images.length

    // preload the next image during the delay
    const [image] = await Promise.all([
      loadImage(images[currentImageIndex + 1]),
      wait(5000),
    ])

    const nextAnimation = showAnimation(image)

    // let the next animation fade in fully before deleting the previous one
    await wait(2500)

    currentAnimation.remove()
    currentAnimation = nextAnimation
  }
}

main()
