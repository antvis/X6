import { FEBase } from '../fe-base/fe-base'
import { SVGFEDisplacementMapAttributes, In, Channel } from './types'

@FEDisplacementMap.register('FeDisplacementMap')
export class FEDisplacementMap extends FEBase<SVGFEDisplacementMapElement> {
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

  feScale(): number
  feScale(v: number | null): this
  feScale(v?: number | null) {
    return this.attr('scale', v)
  }

  xChannelSelector(): Channel
  xChannelSelector(v: Channel | null): this
  xChannelSelector(v?: Channel | null) {
    return this.attr('xChannelSelector', v)
  }

  yChannelSelector(): Channel
  yChannelSelector(v: Channel | null): this
  yChannelSelector(v?: Channel | null) {
    return this.attr('yChannelSelector', v)
  }
}

export namespace FEDisplacementMap {
  export function create<Attributes extends SVGFEDisplacementMapAttributes>(
    attrs?: Attributes | null,
  ) {
    const elem = new FEDisplacementMap()
    if (attrs) {
      elem.attr(attrs)
    }
    return elem
  }
}
