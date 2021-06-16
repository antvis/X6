import { FeBase } from '../fe-base/fe-base'
import { SVGFEDiffuseLightingAttributes, In } from './types'
import { SVGFESpotLightAttributes } from '../fe-spot-light/types'
import { SVGFEPointLightAttributes } from '../fe-point-light/types'
import { SVGFEDistantLightAttributes } from '../fe-distant-light/types'
import { FESpotLight } from '../fe-spot-light/fe-spot-light'
import { FEPointLight } from '../fe-point-light/fe-point-light'
import { FEDistantLight } from '../fe-distant-light/fe-distant-light'

@FEDiffuseLighting.register('FEDiffuseLighting')
export class FEDiffuseLighting extends FeBase<SVGFEDiffuseLightingElement> {
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
  surfaceScale(v: number | null): this
  surfaceScale(v?: number | null) {
    return this.attr('surfaceScale', v)
  }

  diffuseConstant(): number
  diffuseConstant(v: number | null): this
  diffuseConstant(v?: number | null) {
    return this.attr('diffuseConstant', v)
  }

  kernelUnitLength(): number
  kernelUnitLength(v: number | null): this
  kernelUnitLength(v?: number | null) {
    return this.attr('kernelUnitLength', v)
  }
}

export namespace FEDiffuseLighting {
  export function create<Attributes extends SVGFEDiffuseLightingAttributes>(
    attrs?: Attributes | null,
  ) {
    const elem = new FEDiffuseLighting()
    if (attrs) {
      elem.attr(attrs)
    }
    return elem
  }
}
