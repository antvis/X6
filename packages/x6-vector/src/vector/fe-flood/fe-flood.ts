import { FEBase } from '../fe-base/fe-base'
import { SVGFEFloodAttributes } from './types'

@FEFlood.register('FeFlood')
export class FEFlood extends FEBase<SVGFEFloodElement> {
  color(): string
  color(color: string | null): this
  color(color?: string | null) {
    return this.attr('floodColor', color)
  }

  opacity(): number
  opacity(opacity: number | null): this
  opacity(opacity?: number | null) {
    return this.attr('floodOpacity', opacity)
  }
}

export namespace FEFlood {
  export function create<Attributes extends SVGFEFloodAttributes>(
    attrs?: Attributes | null,
  ) {
    const elem = new FEFlood()
    if (attrs) {
      elem.attr(attrs)
    }
    return elem
  }
}
