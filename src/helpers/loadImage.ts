export const loadImage = (source: string) =>
  new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image()
    image.src = source
    image.onload = () => resolve(image)
    image.onerror = reject
  })
