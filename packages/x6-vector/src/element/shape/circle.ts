import { Attrs } from '../../types'
import { UNumber } from '../../struct/unumber'
import { Shape } from './shape'

@Circle.register('Circle')
export class Circle extends Shape<SVGCircleElement> {
  rx(): number
  rx(rx: string | number | null): this
  rx(rx?: string | number | null) {
    return this.attr<number>('r', rx)
  }

  ry(): number
  ry(ry: string | number | null): this
  ry(ry?: string | number | null) {
    return this.attr<number>('r', ry)
  }

  radius(): number
  radius(r: string | number | null): this
  radius(r?: string | number | null) {
    return this.attr<number>('r', r)
  }

  size(size: string | number) {
    return this.radius(UNumber.divide(size, 2))
  }

  cx(): number
  cx(x: string | number | null): this
  cx(x?: string | number | null) {
    return this.attr<number>('cx', x)
  }

  cy(): number
  cy(y: string | number | null): this
  cy(y?: string | number | null) {
    return this.attr<number>('cy', y)
  }

  x(): number
  x(x?: null): number
  x(x: string | number): this
  x(x?: string | number | null) {
    return x == null
      ? this.cx() - this.rx()
      : this.cx(UNumber.plus(x, this.rx()))
  }

  y(): number
  y(y: null): number
  y(y: string | number): this
  y(y?: string | number | null) {
    return y == null
      ? this.cy() - this.ry()
      : this.cy(UNumber.plus(y, this.ry()))
  }

  width(): number
  width(w: null): number
  width(w: string | number): this
  width(w?: string | number | null) {
    return w == null ? this.rx() * 2 : this.rx(UNumber.divide(w, 2))
  }

  height(): number
  height(h: null): number
  height(h: string | number): this
  height(h?: string | number | null) {
    return h == null ? this.ry() * 2 : this.ry(UNumber.divide(h, 2))
  }
}

export namespace Circle {
  export function create(attrs?: Attrs | null): Circle
  export function create(size: number | string, attrs?: Attrs | null): Circle
  export function create(
    size?: number | string | Attrs | null,
    attrs?: Attrs | null,
  ): Circle
  export function create(
    size?: number | string | Attrs | null,
    attrs?: Attrs | null,
  ) {
    const circle = new Circle()
    if (size == null) {
      circle.size(0)
    } else if (size != null && typeof size === 'object') {
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
