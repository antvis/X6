import { Shape } from '../common/shape'
import { SVGRectAttributes } from './types'

@Rect.register('Rect')
export class Rect extends Shape<SVGRectElement> {
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
}

export namespace Rect {
  export function create<Attributes extends SVGRectAttributes>(
    attrs?: Attributes | null,
  ): Rect
  export function create<Attributes extends SVGRectAttributes>(
    size: number | string,
    attrs?: Attributes | null,
  ): Rect
  export function create<Attributes extends SVGRectAttributes>(
    width: number | string,
    height: string | number,
    attrs?: Attributes | null,
  ): Rect
  export function create<Attributes extends SVGRectAttributes>(
    width?: number | string | Attributes | null,
    height?: number | string | Attributes | null,
    attrs?: Attributes | null,
  ): Rect
  export function create<Attributes extends SVGRectAttributes>(
    width?: number | string | Attributes | null,
    height?: number | string | Attributes | null,
    attrs?: Attributes | null,
  ) {
    const rect = new Rect()
    if (width == null) {
      rect.size(0, 0)
    } else if (typeof width === 'object') {
      rect.size(0, 0).attr(width)
    } else if (height != null && typeof height === 'object') {
      rect.size(width, width).attr(height)
    } else {
      if (typeof height === 'undefined') {
        rect.size(width, width)
      } else {
        rect.size(width, height)
      }

      if (attrs) {
        rect.attr(attrs)
      }
    }

    return rect
  }
}
