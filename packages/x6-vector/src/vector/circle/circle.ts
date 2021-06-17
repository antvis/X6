import { UnitNumber } from '../../struct/unit-number'
import { Shape } from '../common/shape'
import { SVGCircleAttributes } from './types'

@Circle.register('Circle')
export class Circle extends Shape<SVGCircleElement> {
  rx(): number
  rx(rx: string | number | null): this
  rx(rx?: string | number | null) {
    return this.attr('r', rx)
  }

  ry(): number
  ry(ry: string | number | null): this
  ry(ry?: string | number | null) {
    return this.attr('r', ry)
  }

  radius(): number
  radius(r: string | number | null): this
  radius(r?: string | number | null) {
    return this.attr('r', r)
  }

  size(size: string | number) {
    return this.radius(UnitNumber.divide(size, 2))
  }

  cx(): number
  cx(x: string | number | null): this
  cx(x?: string | number | null) {
    return this.attr('cx', x)
  }

  cy(): number
  cy(y: string | number | null): this
  cy(y?: string | number | null) {
    return this.attr('cy', y)
  }

  x(): number
  x(x?: null): number
  x(x: string | number): this
  x(x?: string | number | null) {
    return x == null
      ? this.cx() - this.rx()
      : this.cx(UnitNumber.plus(x, this.rx()))
  }

  y(): number
  y(y: null): number
  y(y: string | number): this
  y(y?: string | number | null) {
    return y == null
      ? this.cy() - this.ry()
      : this.cy(UnitNumber.plus(y, this.ry()))
  }

  width(): number
  width(w: null): number
  width(w: string | number): this
  width(w?: string | number | null) {
    return w == null ? this.rx() * 2 : this.rx(UnitNumber.divide(w, 2))
  }

  height(): number
  height(h: null): number
  height(h: string | number): this
  height(h?: string | number | null) {
    return h == null ? this.ry() * 2 : this.ry(UnitNumber.divide(h, 2))
  }
}

export namespace Circle {
  export function create<Attributes extends SVGCircleAttributes>(
    attrs?: Attributes | null,
  ): Circle
  export function create<Attributes extends SVGCircleAttributes>(
    size: number | string,
    attrs?: Attributes | null,
  ): Circle
  export function create<Attributes extends SVGCircleAttributes>(
    size?: number | string | Attributes | null,
    attrs?: Attributes | null,
  ): Circle
  export function create<Attributes extends SVGCircleAttributes>(
    size?: number | string | Attributes | null,
    attrs?: Attributes | null,
  ) {
    const circle = new Circle()
    if (size == null) {
      circle.size(0)
    } else if (typeof size === 'object') {
      circle.size(0).attr(size)
    } else {
      circle.size(size)
      if (attrs) {
        circle.attr(attrs)
      }
    }

    return circle
  }
}
