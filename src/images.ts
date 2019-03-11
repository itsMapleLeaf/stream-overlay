import { isNonNil } from "./helpers/isNonNil"
import { shuffle } from "./helpers/shuffle"

type ImageModuleMap = {
  [id in string]?: {
    png?: string
    jpg?: string
  }
}

const imageModuleMap: ImageModuleMap = require("./images/*.@(png|jpg)")

export const images = shuffle(
  Object.values(imageModuleMap)
    .filter(isNonNil)
    .map((entry) => entry.png || entry.jpg)
    .filter(isNonNil),
)
