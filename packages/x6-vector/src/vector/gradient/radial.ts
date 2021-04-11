import { UnitNumber } from '../../struct/unit-number'
import { AttrOverride } from './override'
import { SVGRadialGradientAttributes } from './types'
import { Gradient } from './gradient'

@RadialGradient.register('RadialGradient')
@RadialGradient.mixin(AttrOverride)
export class RadialGradient extends Gradient<SVGRadialGradientElement> {
  from(x: number | string, y: number | string) {
    return this.attr({
      fx: UnitNumber.create(x).toString(),
      fy: UnitNumber.create(y).toString(),
    })
  }

  to(cx: number | string, cy: number | string) {
    return this.attr({
      cx: UnitNumber.create(cx).toString(),
      cy: UnitNumber.create(cy).toString(),
    })
  }
}

export namespace RadialGradient {
  export function create<Attributes extends SVGRadialGradientAttributes>(
    attrs?: Attributes | null,
  ): RadialGradient
  export function create<Attributes extends SVGRadialGradientAttributes>(
    update: Gradient.Update<SVGRadialGradientElement>,
    attrs?: Attributes | null,
  ): RadialGradient
  export function create<Attributes extends SVGRadialGradientAttributes>(
    update?: Gradient.Update<SVGRadialGradientElement> | Attributes | null,
    attrs?: Attributes | null,
  ): RadialGradient
  export function create<Attributes extends SVGRadialGradientAttributes>(
    update?: Gradient.Update<SVGRadialGradientElement> | Attributes | null,
    attrs?: Attributes | null,
  ) {
    const gradient = new RadialGradient()
    if (update) {
      if (typeof update === 'function') {
        gradient.update(update)
        if (attrs) {
          gradient.attr(attrs)
        }
      } else {
        gradient.attr(update)
      }
    } else if (attrs) {
      gradient.attr(attrs)
    }
    return gradient
  }
}
