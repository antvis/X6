import { FeBase } from '../fe-base/fe-base'
import { SVGFEMorphologyAttributes, In, Operator } from './types'

@FEMorphology.register('FEMorphology')
export class FEMorphology extends FeBase<SVGFEMorphologyElement> {
  in(): In | string
  in(type: In): this
  in(type: string): this
  in(type: null): this
  in(type?: In | string | null) {
    return this.attr('in', type)
  }

  radius(): number
  radius(r: number | null): this
  radius(r?: number | null) {
    return this.attr('radius', r)
  }

  operator(): Operator
  operator(o: Operator | null): this
  operator(o?: Operator | null) {
    return this.attr('operator', o)
  }
}

export namespace FEMorphology {
  export function create<Attributes extends SVGFEMorphologyAttributes>(
    attrs?: Attributes | null,
  ) {
    const elem = new FEMorphology()
    if (attrs) {
      elem.attr(attrs)
    }
    return elem
  }
}
