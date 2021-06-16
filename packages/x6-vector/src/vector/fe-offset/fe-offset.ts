import { FeBase } from '../fe-base/fe-base'
import { SVGFEOffsetAttributes, In } from './types'

@FEOffset.register('FEOffset')
export class FEOffset extends FeBase<SVGFEOffsetElement> {
  in(): In | string
  in(type: In): this
  in(type: string): this
  in(type: null): this
  in(type?: In | string | null) {
    return this.attr('in', type)
  }

  dx(): number
  dx(dx: number | null): this
  dx(dx?: number | null) {
    return this.attr('dx', dx)
  }

  dy(): number
  dy(dy: number | null): this
  dy(dy?: number | null) {
    return this.attr('dy', dy)
  }
}

export namespace FEOffset {
  export function create<Attributes extends SVGFEOffsetAttributes>(
    attrs?: Attributes | null,
  ) {
    const elem = new FEOffset()
    if (attrs) {
      elem.attr(attrs)
    }
    return elem
  }
}
