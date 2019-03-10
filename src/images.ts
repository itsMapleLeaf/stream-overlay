import { isNonNil } from "./helpers/isNonNil"

type ImageModuleMap = {
  [id in string]?: {
    png?: string
    jpg?: string
  }
}

const imageModuleMap: ImageModuleMap = require("./images/*.@(png|jpg)")

export const images = Object.values(imageModuleMap)
  .filter(isNonNil)
  .map((entry) => entry.png || entry.jpg)
  .filter(isNonNil)
