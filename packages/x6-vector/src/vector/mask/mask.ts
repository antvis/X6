import { Vector } from '../vector/vector'
import { Vessel } from '../container/vessel'
import { SVGMaskAttributes } from './types'

@Mask.register('Mask')
export class Mask extends Vessel<SVGMaskElement> {
  remove() {
    this.targets().forEach((target) => target.unmask())
    return super.remove()
  }

  targets<TVector extends Vector>() {
    return this.findTargets<TVector>('mask')
  }
}

export namespace Mask {
  export function create<Attributes extends SVGMaskAttributes>(
    attrs?: Attributes | null,
  ) {
    const mask = new Mask()
    if (attrs) {
      mask.attr(attrs)
    }
    return mask
  }
}
