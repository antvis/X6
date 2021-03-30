import { Obj } from '../util/obj'
import { Registry } from './registry'

export abstract class Base {}

export namespace Base {
  type Class = { new (...arguments_: any[]): Base }

  export function register(name: string, asRoot?: boolean) {
    return <TClass extends Class>(ctor: TClass) => {
      Registry.register(ctor, name, asRoot)
    }
  }

  export function mixin(...source: any[]) {
    return <TClass extends Class>(ctor: TClass) => {
      Obj.applyMixins(ctor, ...source)
    }
  }
}
