import { FEBase } from '../fe-base/fe-base'
import { SVGFETurbulenceAttributes, Type, StitchTiles } from './types'

@FETurbulence.register('FeTurbulence')
export class FETurbulence extends FEBase<SVGFETurbulenceElement> {
  baseFrequency(): number
  baseFrequency(v: number | null): this
  baseFrequency(v?: number | null) {
    return this.attr('baseFrequency', v)
  }

  numOctaves(): number
  numOctaves(v: number | null): this
  numOctaves(v?: number | null) {
    return this.attr('numOctaves', v)
  }

  seed(): number
  seed(v: number | null): this
  seed(v?: number | null) {
    return this.attr('seed', v)
  }

  feType(): Type
  feType(type: Type | null): this
  feType(type?: Type | null) {
    return this.attr('type', type)
  }

  stitchTiles(): StitchTiles
  stitchTiles(v: StitchTiles | null): this
  stitchTiles(v?: StitchTiles | null) {
    return this.attr('stitchTiles', v)
  }
}

export namespace FETurbulence {
  export function create<Attributes extends SVGFETurbulenceAttributes>(
    attrs?: Attributes | null,
  ) {
    const elem = new FETurbulence()
    if (attrs) {
      elem.attr(attrs)
    }
    return elem
  }
}
