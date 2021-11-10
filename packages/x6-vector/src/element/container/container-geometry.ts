import { Box } from '../../struct/box'
import { Point } from '../../struct/point'
import { Matrix } from '../../struct/matrix'
import { SVGNumber } from '../../struct/svg-number'
import { VectorElement } from '../element'
import { Util } from '../util'
import { Container } from './container'

export abstract class GeometryContainer<
  TSVGGElement extends SVGAElement | SVGGElement
> extends Container<TSVGGElement> {
  dmove(dx: number | string = 0, dy: number | string = 0) {
    this.eachChild<VectorElement>((child) => {
      const bbox = child.bbox()
      const m = new Matrix(child)
      // Translate childs matrix by amount and
      // transform it back into parents space
      const matrix = m
        .translate(SVGNumber.toNumber(dx), SVGNumber.toNumber(dy))
        .transform(m.inverse())
      // Calculate new x and y from old box
      const p = new Point(bbox.x, bbox.y).transform(matrix)
      // Move child
      child.move(p.x, p.y)
    })

    return this
  }

  move(x: number | string = 0, y: number | string = 0, box = this.bbox()) {
    const dx = SVGNumber.toNumber(x) - box.x
    const dy = SVGNumber.toNumber(y) - box.y

    return this.dmove(dx, dy)
  }

  dx(dx: number | string) {
    return this.dmove(dx, 0)
  }

  dy(dy: number | string) {
    return this.dmove(0, dy)
  }

  x(): number
  x(x: number | string | null, box?: Box): this
  x(x?: number | string | null, box = this.bbox()) {
    if (x == null) {
      return box.x
    }
    return this.move(x, box.y, box)
  }

  y(): number
  y(y: number | string | null, box?: Box): this
  y(y?: number | string | null, box = this.bbox()) {
    if (y == null) {
      return box.y
    }
    return this.move(box.x, y, box)
  }

  size(
    width?: number | string | null,
    height?: number | string | null,
    box = this.bbox(),
  ) {
    const size = Util.proportionalSize(this, width, height, box)
    const sx = SVGNumber.toNumber(size.width) / box.width
    const sy = SVGNumber.toNumber(size.height) / box.height

    this.eachChild<VectorElement>((child) => {
      const o = new Point(box).transform(new Matrix(child).inverse())
      child.scale(sx, sy, o.x, o.y)
    })

    return this
  }

  width(): number
  width(width: number | string | null, box?: Box): this
  width(width?: number | string | null, box = this.bbox()) {
    if (width == null) {
      return box.width
    }
    return this.size(new SVGNumber(width).value, box.height, box)
  }

  height(): number
  height(height: number | string | null, box?: Box): this
  height(height?: number | string | null, box = this.bbox()) {
    if (height == null) {
      return box.height
    }
    return this.size(box.width, new SVGNumber(height).value, box)
  }
}
