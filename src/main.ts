import { App } from "./App"

new App()

if (module.hot) {
  module.hot.accept(() => window.location.reload())
}
