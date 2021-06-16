import { FeBase } from '../fe-base/fe-base'
import { SVGFEDistantLightAttributes } from './types'

@FEDistantLight.register('FEDistantLight')
export class FEDistantLight extends FeBase<SVGFEDistantLightElement> {
  azimuth(): number
  azimuth(v: number | null): this
  azimuth(v?: number | null) {
    return this.attr('azimuth', v)
  }

  elevation(): number
  elevation(v: number | null): this
  elevation(v?: number | null) {
    return this.attr('elevation', v)
  }
}

export namespace FEDistantLight {
  export function create<Attributes extends SVGFEDistantLightAttributes>(
    attrs?: Attributes | null,
  ) {
    const elem = new FEDistantLight()
    if (attrs) {
      elem.attr(attrs)
    }
    return elem
  }
}
