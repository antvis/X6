import { PointArray } from '../../struct/point-array'
import { Size } from '../common/size'
import { Shape } from '../common/shape'
import { SVGLineAttributes } from './types'

@Line.register('Line')
export class Line extends Shape<SVGLineElement> {
  x(): number
  x(x: number | string): this
  x(x?: number | string) {
    return x == null ? this.bbox().x : this.move(x, this.bbox().y)
  }

  y(): number
  y(y: number | string): this
  y(y?: number | string) {
    return y == null ? this.bbox().y : this.move(this.bbox().x, y)
  }

  width(): number
  width(w: number | string): this
  width(w?: number | string) {
    return w == null ? this.bbox().width : this.size(w, this.bbox().height)
  }

  height(): number
  height(h: number | string): this
  height(h?: number | string) {
    return h == null ? this.bbox().height : this.size(this.bbox().width, h)
  }

  size(width: string | number, height: string | number): this
  size(width: string | number, height: string | number | null | undefined): this
  size(width: string | number | null | undefined, height: string | number): this
  size(width?: string | number | null, height?: string | number | null) {
    const p = Size.normalize(this, width, height)
    return this.plot(this.toPointArray().size(p.width, p.height))
  }

  move(x: number | string, y: number | string) {
    return this.plot(this.toPointArray().move(x, y))
  }

  plot(): Line.Array
  plot(points: Line.Array | PointArray): this
  plot(x1: number, y1: number, x2: number, y2: number): this
  plot(
    x1?: Line.Array | PointArray | number,
    y1?: number,
    x2?: number,
    y2?: number,
  ): this
  plot(
    x1?: Line.Array | PointArray | number,
    y1?: number,
    x2?: number,
    y2?: number,
  ) {
    if (x1 == null) {
      return this.toArray()
    }

    const attrs = Array.isArray(x1)
      ? {
          x1: x1[0][0],
          y1: x1[0][1],
          x2: x1[1][0],
          y2: x1[1][1],
        }
      : {
          x1,
          y1,
          x2,
          y2,
        }

    return this.attr(attrs)
  }

  toArray(): Line.Array {
    return [
      [+this.attr('x1')!, +this.attr('y1')!],
      [+this.attr('x2')!, +this.attr('y2')!],
    ]
  }

  toPointArray() {
    return new PointArray(this.toArray())
  }
}

export namespace Line {
  export type Array = [[number, number], [number, number]]

  export function create<Attributes extends SVGLineAttributes>(
    attrs?: Attributes | null,
  ): Line
  export function create<Attributes extends SVGLineAttributes>(
    points: Array,
    attrs?: Attributes | null,
  ): Line
  export function create<Attributes extends SVGLineAttributes>(
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    attrs?: Attributes | null,
  ): Line
  export function create<Attributes extends SVGLineAttributes>(
    x1?: Array | number | Attributes | null,
    y1?: number | Attributes | null,
    x2?: number,
    y2?: number,
    attrs?: Attributes | null,
  ): Line
  export function create<Attributes extends SVGLineAttributes>(
    x1?: Array | number | Attributes | null,
    y1?: number | Attributes | null,
    x2?: number,
    y2?: number,
    attrs?: Attributes | null,
  ) {
    const line = new Line()
    if (x1 == null) {
      line.plot(0, 0, 0, 0)
    } else if (Array.isArray(x1)) {
      line.plot(x1)
      if (y1 != null && typeof y1 === 'object') {
        line.attr(y1)
      }
    } else if (typeof x1 === 'object') {
      line.plot(0, 0, 0, 0).attr(x1)
    } else {
      line.plot(x1, y1 as number, x2 as number, y2 as number)
      if (attrs) {
        line.attr(attrs)
      }
    }

    return line
  }
}
