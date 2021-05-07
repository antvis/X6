import type { Dom } from '../dom'
import type { AnimatorMap } from './types'
import { applyMixins } from '../util/mixin'
import { Animator } from '../animating/animator/animator'
import { Registry } from './registry'

export class BaseAnimator<
  TElement extends Element = Element,
  TOwner extends Dom<TElement> = Dom<TElement>,
  TAnimator = AnimatorMap<TElement>
> extends Animator<TAnimator, TOwner> {
  element(): TOwner
  element(elem: TOwner): this
  element(elem?: TOwner) {
    if (elem == null) {
      return super.master()
    }

    super.master(elem)
    return this
  }
}

export namespace BaseAnimator {
  export function register(name: string) {
    return <TDefinition extends Registry.Definition>(ctor: TDefinition) => {
      Registry.register(ctor, name)
    }
  }

  export function mixin(...source: any[]) {
    return (ctor: Registry.Definition) => {
      applyMixins(ctor, ...source)
    }
  }
}
