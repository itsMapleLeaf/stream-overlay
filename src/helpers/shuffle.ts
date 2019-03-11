export const shuffle = <T>(items: T[]) => {
  const result = [...items]
  for (let i = 0; i < items.length; i++) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[result[i], result[j]] = [result[j], result[i]]
  }
  return result
}
