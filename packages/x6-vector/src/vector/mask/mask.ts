import { Container } from '../container/container'
import { Vector } from '../vector/vector'
import { SVGMaskAttributes } from './types'

@Mask.register('Mask')
export class Mask extends Container<SVGMaskElement> {
  remove() {
    this.targets().forEach((target) => target.unmask())
    return super.remove()
  }

  targets<TVector extends Vector>() {
    return Mask.find<TVector>(`svg [mask*="${this.id()}"]`)
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
