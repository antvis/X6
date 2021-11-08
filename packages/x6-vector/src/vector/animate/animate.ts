import { Animation } from './animation'
import { SVGAnimateAttributes } from './types'

@Animate.register('Animate')
export class Animate extends Animation<SVGAnimateElement> {}

export namespace Animate {
  export function create<Attributes extends SVGAnimateAttributes>(
    attrs?: Attributes | null,
  ) {
    return new Animate(attrs)
  }
}
