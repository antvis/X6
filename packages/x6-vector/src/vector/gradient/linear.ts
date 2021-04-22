import { UnitNumber } from '../../struct/unit-number'
import { AttrOverride } from './override'
import { SVGLinearGradientAttributes } from './types'
import { Gradient } from './gradient'

@LinearGradient.register('LinearGradient')
@LinearGradient.mixin(AttrOverride)
export class LinearGradient extends Gradient<SVGLinearGradientElement> {
  from(x: number | string, y: number | string) {
    return this.attr({
      x1: UnitNumber.create(x).toString(),
      y1: UnitNumber.create(y).toString(),
    })
  }

  to(x: number | string, y: number | string) {
    return this.attr({
      x2: UnitNumber.create(x).toString(),
      y2: UnitNumber.create(y).toString(),
    })
  }
}

export namespace LinearGradient {
  export function create<Attributes extends SVGLinearGradientAttributes>(
    attrs?: Attributes | null,
  ): LinearGradient
  export function create<Attributes extends SVGLinearGradientAttributes>(
    update: Gradient.Update<SVGLinearGradientElement>,
    attrs?: Attributes | null,
  ): LinearGradient
  export function create<Attributes extends SVGLinearGradientAttributes>(
    update?: Gradient.Update<SVGLinearGradientElement> | Attributes | null,
    attrs?: Attributes | null,
  ): LinearGradient
  export function create<Attributes extends SVGLinearGradientAttributes>(
    update?: Gradient.Update<SVGLinearGradientElement> | Attributes | null,
    attrs?: Attributes | null,
  ) {
    const gradient = new LinearGradient()
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
