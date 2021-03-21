import { Attrs } from '../../types'
import { Container } from './container'
import { VectorElement } from '../element'

@Mask.register('Mask')
export class Mask extends Container<SVGMaskElement> {
  remove() {
    this.targets().forEach((target) => target.unmask())
    return super.remove()
  }

  targets<TVector extends VectorElement>() {
    return Mask.find<TVector>(`svg [mask*="${this.id()}"]`)
  }
}

export namespace Mask {
  export function create(attrs?: Attrs | null) {
    const mask = new Mask()
    if (attrs) {
      mask.attr(attrs)
    }
    return mask
  }
}
