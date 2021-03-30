import { Class } from '../types'

export namespace Obj {
  export function applyMixin<TClass extends Class, Key extends keyof TClass>(
    target: any,
    source: TClass,
    pick?: Key[],
  ) {
    Object.getOwnPropertyNames(source.prototype).forEach((name) => {
      if (pick == null || !pick.includes(name as Key)) {
        return
      }

      Object.defineProperty(
        target.prototype,
        name,
        Object.getOwnPropertyDescriptor(source.prototype, name)!,
      )
    })
  }

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

  export function extend<TObject extends Record<string, unknown>>(
    target: Class,
    ...sources: TObject[]
  ) {
    sources.forEach((source) => {
      Object.getOwnPropertyNames(source).forEach((name) => {
        Object.defineProperty(
          target.prototype,
          name,
          Object.getOwnPropertyDescriptor(source, name)!,
        )
      })
    })
  }
}
