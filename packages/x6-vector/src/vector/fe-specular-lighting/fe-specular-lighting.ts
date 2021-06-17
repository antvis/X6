import { FEBase } from '../fe-base/fe-base'
import { SVGFESpecularLightingAttributes, In } from './types'
import { SVGFESpotLightAttributes } from '../fe-spot-light/types'
import { SVGFEPointLightAttributes } from '../fe-point-light/types'
import { SVGFEDistantLightAttributes } from '../fe-distant-light/types'
import { FESpotLight } from '../fe-spot-light/fe-spot-light'
import { FEPointLight } from '../fe-point-light/fe-point-light'
import { FEDistantLight } from '../fe-distant-light/fe-distant-light'

@FESpecularLighting.register('FeSpecularLighting')
export class FESpecularLighting extends FEBase<SVGFESpecularLightingElement> {
  feDistantLight<Attributes extends SVGFEDistantLightAttributes>(
    attrs?: Attributes | null,
  ) {
    return FEDistantLight.create(attrs).appendTo(this)
  }

  fePointLight<Attributes extends SVGFEPointLightAttributes>(
    attrs?: Attributes | null,
  ) {
    return FEPointLight.create(attrs).appendTo(this)
  }

  feSpotLight<Attributes extends SVGFESpotLightAttributes>(
    attrs?: Attributes | null,
  ) {
    return FESpotLight.create(attrs).appendTo(this)
  }

  in(): In | string
  in(type: In): this
  in(type: string): this
  in(type: null): this
  in(type?: In | string | null) {
    return this.attr('in', type)
  }

  surfaceScale(): number
  surfaceScale(s: number | null): this
  surfaceScale(s?: number | null) {
    return this.attr('surfaceScale', s)
  }

  specularConstant(): number
  specularConstant(v: number | null): this
  specularConstant(v?: number | null) {
    return this.attr('specularConstant', v)
  }

  specularExponent(): number
  specularExponent(v: number | null): this
  specularExponent(v?: number | null) {
    return this.attr('specularExponent', v)
  }

  kernelUnitLength(): number
  kernelUnitLength(v: number | null): this
  kernelUnitLength(v?: number | null) {
    return this.attr('kernelUnitLength', v)
  }
}

export namespace FESpecularLighting {
  export function create<Attributes extends SVGFESpecularLightingAttributes>(
    attrs?: Attributes | null,
  ) {
    const elem = new FESpecularLighting()
    if (attrs) {
      elem.attr(attrs)
    }
    return elem
  }
}
