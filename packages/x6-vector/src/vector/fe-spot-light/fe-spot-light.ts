import { FeBase } from '../fe-base/fe-base'
import { SVGFESpotLightAttributes } from './types'

@FESpotLight.register('FESpotLight')
export class FESpotLight extends FeBase<SVGFESpotLightElement> {
  x(): number | string
  x(x: number | string | null): this
  x(x?: number | string | null) {
    return this.attr('x', x)
  }

  y(): number | string
  y(y: number | string | null): this
  y(y?: number | string | null) {
    return this.attr('y', y)
  }

  z(): number | string
  z(z: number | string | null): this
  z(z?: number | string | null) {
    return this.attr('z', z)
  }

  pointsAtX(): number
  pointsAtX(x: number | null): this
  pointsAtX(x?: number | null) {
    return this.attr('pointsAtX', x)
  }

  pointsAtY(): number
  pointsAtY(y: number | null): this
  pointsAtY(y?: number | null) {
    return this.attr('pointsAtY', y)
  }

  pointsAtZ(): number
  pointsAtZ(z: number | null): this
  pointsAtZ(z?: number | null) {
    return this.attr('pointsAtZ', z)
  }

  specularExponent(): number
  specularExponent(v: number | null): this
  specularExponent(v?: number | null) {
    return this.attr('specularExponent', v)
  }

  limitingConeAngle(): number
  limitingConeAngle(v: number | null): this
  limitingConeAngle(v?: number | null) {
    return this.attr('limitingConeAngle', v)
  }
}

export namespace FESpotLight {
  export function create<Attributes extends SVGFESpotLightAttributes>(
    attrs?: Attributes | null,
  ) {
    const elem = new FESpotLight()
    if (attrs) {
      elem.attr(attrs)
    }
    return elem
  }
}
