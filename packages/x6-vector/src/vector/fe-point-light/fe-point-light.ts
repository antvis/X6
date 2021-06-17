import { FEBase } from '../fe-base/fe-base'
import { SVGFEPointLightAttributes } from './types'

@FEPointLight.register('FePointLight')
export class FEPointLight extends FEBase<SVGFEPointLightElement> {
  x(): number
  x(x: number | null): this
  x(x?: number | null) {
    return this.attr('x', x)
  }

  y(): number
  y(y: number | null): this
  y(y?: number | null) {
    return this.attr('y', y)
  }

  z(): number
  z(z: number | null): this
  z(z?: number | null) {
    return this.attr('z', z)
  }
}

export namespace FEPointLight {
  export function create<Attributes extends SVGFEPointLightAttributes>(
    attrs?: Attributes | null,
  ) {
    const elem = new FEPointLight()
    if (attrs) {
      elem.attr(attrs)
    }
    return elem
  }
}
