import { Attrs } from '../../types'
import { UNumber } from '../../struct/unumber'
import { Util } from '../util'
import { Shape } from './shape'

@Ellipse.register('Ellipse')
export class Ellipse extends Shape<SVGEllipseElement> {
  rx(): number
  rx(rx: string | number | null): this
  rx(rx?: string | number | null) {
    return this.attr('rx', rx)
  }

  ry(): number
  ry(ry: string | number | null): this
  ry(ry?: string | number | null) {
    return this.attr('ry', ry)
  }

  radius(rx: string | number, ry: string | number = rx) {
    return this.rx(rx).ry(ry)
  }

  size(width: string | number, height: string | number): this
  size(width: string | number, height: string | number | null | undefined): this
  size(width: string | number | null | undefined, height: string | number): this
  size(width?: string | number | null, height?: string | number | null) {
    const size = Util.proportionalSize(this, width, height)
    const rx = UNumber.divide(size.width, 2)
    const ry = UNumber.divide(size.height, 2)
    return this.rx(rx).ry(ry)
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
  y(x: null): number
  y(x: string | number): this
  y(y?: string | number | null) {
    return y == null
      ? this.cy() - this.ry()
      : this.cy(UNumber.plus(y, this.ry()))
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

export namespace Ellipse {
  export function create(attrs?: Attrs | null): Ellipse
  export function create(size: number | string, attrs?: Attrs | null): Ellipse
  export function create(
    width: number | string,
    height: number | string,
    attrs?: Attrs | null,
  ): Ellipse
  export function create(
    width?: number | string | Attrs | null,
    height?: number | string | Attrs | null,
    attrs?: Attrs | null,
  ): Ellipse
  export function create(
    width?: number | string | Attrs | null,
    height?: number | string | Attrs | null,
    attrs?: Attrs | null,
  ) {
    const ellipse = new Ellipse()
    if (width == null) {
      ellipse.size(0, 0)
    } else if (typeof width === 'object') {
      ellipse.size(0, 0).attr(width)
    } else if (height != null && typeof height === 'object') {
      ellipse.size(width, width).attr(height)
    } else {
      if (typeof height === 'undefined') {
        ellipse.size(width, width)
      } else {
        ellipse.size(width, height)
      }

      if (attrs) {
        ellipse.attr(attrs)
      }
    }

    return ellipse
  }
}
