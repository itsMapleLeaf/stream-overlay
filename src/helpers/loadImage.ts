export const loadImage = (source: string) =>
  new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image()

    const handleLoad = () => {
      resolve(image)
      image.removeEventListener("load", handleLoad)
      image.removeEventListener("error", handleError)
    }

    const handleError = () => {
      reject(`Failed to load image from url "${source}"`)
      image.removeEventListener("load", handleLoad)
      image.removeEventListener("error", handleError)
    }

    image.addEventListener("load", handleLoad)
    image.addEventListener("error", handleError)
    image.src = source
  })
