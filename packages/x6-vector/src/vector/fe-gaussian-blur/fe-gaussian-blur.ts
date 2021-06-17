import { FEBase } from '../fe-base/fe-base'
import { SVGFEGaussianBlurAttributes, In, EdgeMode } from './types'

@FEGaussianBlur.register('FeGaussianBlur')
export class FEGaussianBlur extends FEBase<SVGFEGaussianBlurElement> {
  in(): In | string
  in(type: In): this
  in(type: string): this
  in(type: null): this
  in(type?: In | string | null) {
    return this.attr('in', type)
  }

  stdDeviation(): number
  stdDeviation(v: number | null): this
  stdDeviation(v?: number | null) {
    return this.attr('stdDeviation', v)
  }

  edgeMode(): EdgeMode
  edgeMode(mode: EdgeMode | null): this
  edgeMode(mode?: EdgeMode | null) {
    return this.attr('edgeMode', mode)
  }
}

export namespace FEGaussianBlur {
  export function create<Attributes extends SVGFEGaussianBlurAttributes>(
    attrs?: Attributes | null,
  ) {
    const elem = new FEGaussianBlur()
    if (attrs) {
      elem.attr(attrs)
    }
    return elem
  }
}
