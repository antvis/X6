import { Box } from '../../struct/box'
import { Point } from '../../struct/point'
import { Matrix } from '../../struct/matrix'
import { UnitNumber } from '../../struct/unit-number'
import { Vector } from '../vector/vector'
import { Size } from '../common/size'
import { Container } from './container'

export abstract class GeometryContainer<
  TSVGElement extends SVGAElement | SVGGElement
> extends Container<TSVGElement> {
  dmove(dx: number | string = 0, dy: number | string = 0) {
    this.eachChild<Vector>((child) => {
      const bbox = child.bbox()
      const m = new Matrix(child)
      // Translate childs matrix by amount and
      // transform it back into parents space
      const matrix = m
        .translate(UnitNumber.toNumber(dx), UnitNumber.toNumber(dy))
        .transform(m.inverse())
      // Calculate new x and y from old box
      const p = new Point(bbox.x, bbox.y).transform(matrix)
      // Move child
      child.move(p.x, p.y)
    })

    return this
  }

  move(x: number | string = 0, y: number | string = 0, box = this.bbox()) {
    const dx = UnitNumber.toNumber(x) - box.x
    const dy = UnitNumber.toNumber(y) - box.y

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
    const size = Size.normalize(this, width, height, box)
    const sx = UnitNumber.toNumber(size.width) / box.width
    const sy = UnitNumber.toNumber(size.height) / box.height

    this.eachChild<Vector>((child) => {
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
    return this.size(new UnitNumber(width).value, box.height, box)
  }

  height(): number
  height(height: number | string | null, box?: Box): this
  height(height?: number | string | null, box = this.bbox()) {
    if (height == null) {
      return box.height
    }
    return this.size(box.width, new UnitNumber(height).value, box)
  }
}
