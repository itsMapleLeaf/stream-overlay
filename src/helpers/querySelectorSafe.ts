export const querySelectorSafe = <E extends Element>(selector: string) => {
  const element = document.querySelector(selector)
  if (element == null) {
    throw new Error(`Could not find element with selector "${selector}"`)
  }
  return element as E
}
