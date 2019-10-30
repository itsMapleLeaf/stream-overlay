export function lerp(a: number, b: number, delta: number, modulate = linear) {
  return a + (b - a) * modulate(delta)
}

export const linear = (delta: number) => delta
export const sinOut = (delta: number) => Math.sin((delta * Math.PI) / 2)
export const sinIn = (delta: number) =>
  Math.sin(1 - ((delta * Math.PI) / 2 + 1))
