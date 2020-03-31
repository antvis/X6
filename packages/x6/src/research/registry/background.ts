import { Background } from '../background'
import { Registry } from './util'

export const BackgroundRegistry = new Registry<
  Background.Definition<Background.Options>
>({
  onError(name) {
    throw new Error(
      `Background pattern with name '${name}' already registered.`,
    )
  },
})

// Regiter native routers
// ----
Object.keys(Background).forEach(key => {
  const name = key as Background.NativeNames
  const fn = Background[name]
  if (typeof fn === 'function') {
    BackgroundRegistry.register(name, fn, true)
  }
})
