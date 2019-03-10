import { showEntities } from "./entities"
import { querySelectorSafe } from "./helpers/querySelectorSafe"
import { images } from "./images"

const applyBackground = () => {
  const backgroundElement = querySelectorSafe<HTMLElement>("#background-image")
  backgroundElement.style.backgroundImage = `url(${images[4]})`
}

const main = () => {
  applyBackground()
  showEntities()
}

main()
