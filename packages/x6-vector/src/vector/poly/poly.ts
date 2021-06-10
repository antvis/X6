import { PointArray } from '../../struct/point-array'
import { Size } from '../common/size'
import { Shape } from '../common/shape'

export class Poly<
  TSVGPolyElement extends SVGPolygonElement | SVGPolylineElement,
> extends Shape<TSVGPolyElement> {
  protected arr: PointArray | null

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
    return this.attr('points', this.toPointArray().move(x, y).toString())
  }

  plot(): [number, number][]
  plot(d: string): this
  plot(points: number[]): this
  plot(points: [number, number][]): this
  plot(points: string | number[] | [number, number][]): this
  plot(d?: string | number[] | [number, number][]) {
    if (d == null) {
      return this.toArray()
    }

    this.arr = null

    if (typeof d === 'string') {
      this.attr('points', d)
    } else {
      this.arr = new PointArray(d)
      this.attr('points', this.arr.toString())
    }

    return this
  }

  size(width: string | number, height: string | number): this
  size(width: string | number, height: string | number | null | undefined): this
  size(width: string | number | null | undefined, height: string | number): this
  size(width?: string | number | null, height?: string | number | null) {
    const s = Size.normalize(this, width, height)
    return this.attr(
      'points',
      this.toPointArray().size(s.width, s.height).toString(),
    )
  }

  toArray() {
    return this.toPointArray().toArray()
  }

  toPointArray() {
    if (this.arr == null) {
      this.arr = new PointArray(this.attr('points'))
    }
    return this.arr
  }
}
