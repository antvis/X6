import { FeBase } from '../fe-base/fe-base'
import { SVGFECompositeAttributes, In, Operator } from './types'

@FEComposite.register('FEComposite')
export class FEComposite extends FeBase<SVGFECompositeElement> {
  in(): In | string
  in(type: In): this
  in(type: string): this
  in(type: null): this
  in(type?: In | string | null) {
    return this.attr('in', type)
  }

  in2(): In | string
  in2(type: In): this
  in2(type: string): this
  in2(type: null): this
  in2(type?: In | string | null) {
    return this.attr('in2', type)
  }

  operator(): Operator
  operator(operator: Operator | null): this
  operator(operator?: Operator | null) {
    return this.attr('operator', operator)
  }

  k1(): number
  k1(v: number | null): this
  k1(v?: number | null) {
    return this.attr('k1', v)
  }

  k2(): number
  k2(v: number | null): this
  k2(v?: number | null) {
    return this.attr('k2', v)
  }

  k3(): number
  k3(v: number | null): this
  k3(v?: number | null) {
    return this.attr('k3', v)
  }

  k4(): number
  k4(v: number | null): this
  k4(v?: number | null) {
    return this.attr('k4', v)
  }
}

export namespace FEComposite {
  export function create<Attributes extends SVGFECompositeAttributes>(
    attrs?: Attributes | null,
  ) {
    const elem = new FEComposite()
    if (attrs) {
      elem.attr(attrs)
    }
    return elem
  }
}
