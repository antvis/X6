import { Obj } from '../util/obj'
import { Registry } from './registry'

export abstract class Base {}

export namespace Base {
  export function register(name: string, asRoot?: boolean) {
    return (ctor: Registry.Definition) => {
      Registry.register(ctor, name, asRoot)
    }
  }

  export function mixin(...source: any[]) {
    return (ctor: Registry.Definition) => {
      Obj.applyMixins(ctor, ...source)
    }
  }
}
