import { Class } from '../types'

export function applyMixins(target: Class, ...sources: Class[]) {
  sources.forEach((source) => {
    Object.getOwnPropertyNames(source.prototype).forEach((name) => {
      Object.defineProperty(
        target.prototype,
        name,
        Object.getOwnPropertyDescriptor(source.prototype, name)!,
      )
    })
  })
}
