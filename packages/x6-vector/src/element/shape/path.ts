import { Attrs } from '../../types'
import { Point } from '../../struct/point'
import { PathArray } from '../../struct/path-array'
import { Util } from '../util'
import { Shape } from './shape'
import * as Helper from './path-util'

@Path.register('Path')
export class Path extends Shape<SVGPathElement> {
  protected arr: PathArray | null

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

  move(x: number | string, y: number | string) {
    return this.attr('d', this.toPathArray().move(x, y).toString())
  }

  plot(): Path.Segment[]
  plot(d: string | Path.Segment[] | PathArray): this
  plot(d?: string | Path.Segment[] | PathArray) {
    if (d == null) {
      return this.toArray()
    }

    this.arr = null

    if (typeof d === 'string') {
      this.attr('d', d)
    } else {
      this.arr = new PathArray(d)
      this.attr('d', this.arr.toString())
    }

    return this
  }

  size(width: string | number, height: string | number): this
  size(width: string | number, height: string | number | null | undefined): this
  size(width: string | number | null | undefined, height: string | number): this
  size(width?: string | number | null, height?: string | number | null) {
    const p = Util.proportionalSize(this, width, height)
    return this.attr('d', this.toPathArray().size(p.width, p.height).toString())
  }

  length() {
    return this.node.getTotalLength()
  }

  pointAt(length: number) {
    return new Point(this.node.getPointAtLength(length))
  }

  toArray() {
    return this.toPathArray().toArray()
  }

  toPathArray() {
    if (this.arr == null) {
      this.arr = new PathArray(this.attr('d'))
    }
    return this.arr
  }
}

export namespace Path {
  export function create(attrs?: Attrs | null): Path
  export function create(
    d: string | Path.Segment[] | PathArray,
    attrs?: Attrs | null,
  ): Path
  export function create(
    d?: string | Path.Segment[] | PathArray | Attrs | null,
    attrs?: Attrs | null,
  ): Path
  export function create(
    d?: string | Path.Segment[] | PathArray | Attrs | null,
    attrs?: Attrs | null,
  ) {
    const path = new Path()
    if (d != null) {
      if (typeof d === 'string' || Array.isArray(d)) {
        path.plot(d)
        if (attrs) {
          path.attr(attrs)
        }
      } else {
        path.attr(d)
      }
    }
    return path
  }
}

export namespace Path {
  export type Segment = Helper.Segment

  export const parse = Helper.parse
  export const toString = Helper.toString
}
