import { FeBase } from '../fe-base/fe-base'
import { SVGFEColorMatrixAttributes, In, Type } from './types'

@FeColorMatrix.register('FeColorMatrix')
export class FeColorMatrix extends FeBase<SVGFEColorMatrixElement> {
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

export namespace FeColorMatrix {
  export function create<Attributes extends SVGFEColorMatrixAttributes>(
    attrs?: Attributes | null,
  ) {
    const elem = new FeColorMatrix()
    if (attrs) {
      elem.attr(attrs)
    }
    return elem
  }
}
