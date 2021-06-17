import { FEBase } from '../fe-base/fe-base'
import { SVGFEColorMatrixAttributes, In, Type } from './types'

@FEColorMatrix.register('FeColorMatrix')
export class FEColorMatrix extends FEBase<SVGFEColorMatrixElement> {
  in(): In | string
  in(type: In): this
  in(type: string): this
  in(type: null): this
  in(type?: In | string | null) {
    return this.attr('in', type)
  }

  feType(): Type
  feType(type: Type | null): this
  feType(type?: Type | null) {
    return this.attr('type', type)
  }

  values(): string
  values(values: string | null): this
  values(values?: string | null) {
    return this.attr('values', values)
  }
}

export namespace FEColorMatrix {
  export function create<Attributes extends SVGFEColorMatrixAttributes>(
    attrs?: Attributes | null,
  ) {
    const elem = new FEColorMatrix()
    if (attrs) {
      elem.attr(attrs)
    }
    return elem
  }
}
