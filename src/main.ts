import { showEntities } from "./entities"
import { wait } from "./helpers/wait"
import { images } from "./images"

const createBackgroundAnimation = (image: string) => {
  const backgroundElement = document.createElement("div")
  backgroundElement.className = "fill-area cover-bg background-image"
  backgroundElement.style.backgroundImage = `url(${image})`

  const overlayElement = document.createElement("canvas")
  overlayElement.className = "fill-area cover-bg background-overlay"
  showEntities(image, overlayElement)

  const container = document.createElement("div")
  container.className = "fullscreen fade"
  container.style.backgroundColor = "black"
  container.append(backgroundElement, overlayElement)

  return container
}

const main = async () => {
  document.body.innerHTML = ""

  let currentAnimation = createBackgroundAnimation(images[0])
  document.body.append(currentAnimation)

  let currentImageIndex = 0

  while (true) {
    await wait(5000)

    currentImageIndex = (currentImageIndex + 1) % images.length

    const nextAnimationContainer = createBackgroundAnimation(
      images[currentImageIndex],
    )
    document.body.append(nextAnimationContainer)

    await wait(2000)

    currentAnimation.remove()
    currentAnimation = nextAnimationContainer
  }
}

main()
