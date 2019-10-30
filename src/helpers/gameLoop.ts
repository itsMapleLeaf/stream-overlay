import { animationFrame } from "./animationFrame"

export async function* gameLoop() {
  let currentTime = await animationFrame()
  while (true) {
    const frameTime = await animationFrame()
    const delta = frameTime - currentTime
    currentTime = frameTime

    yield delta
  }
}
