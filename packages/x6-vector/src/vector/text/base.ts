import { Global } from '../../global'
import { Box } from '../../struct/box'
import { UnitNumber } from '../../struct/unit-number'
import { Shape } from '../common/shape'

export class TextBase<
  TSVGTextElement extends SVGTextElement | SVGTSpanElement | SVGTextPathElement
> extends Shape<TSVGTextElement> {
  protected building = false

  build(building = false) {
    this.building = building
    return this
  }

  plain(text: string) {
    if (this.building === false) {
      this.clear()
    }

    this.node.append(Global.document.createTextNode(text))

    return this
  }

  length() {
    return this.node.getComputedTextLength()
  }

  x(): number
  x(x: number | string, box?: Box): this
  x(x?: number | string, box = this.bbox()) {
    if (x == null) {
      return box.x
    }

    return this.attr('x', +this.attr('x') + UnitNumber.toNumber(x) - box.x)
  }

  y(): number
  y(y: number | string, box?: Box): this
  y(y?: number | string, box = this.bbox()) {
    if (y == null) {
      return box.y
    }

    return this.attr('y', +this.attr('y') + UnitNumber.toNumber(y) - box.y)
  }

  move(x: number | string, y: number | string, box = this.bbox()) {
    return this.x(x, box).y(y, box)
  }

  cx(): number
  cx(x: number | string, box?: Box): this
  cx(x?: number | string, box = this.bbox()) {
    if (x == null) {
      return box.cx
    }

    return this.attr('x', +this.attr('x') + UnitNumber.toNumber(x) - box.cx)
  }

  cy(): number
  cy(y: number | string, box?: Box): this
  cy(y?: number | string, box = this.bbox()) {
    if (y == null) {
      return box.cy
    }

    return this.attr('y', +this.attr('y') + UnitNumber.toNumber(y) - box.cy)
  }

  center(x: number | string, y: number | string, box = this.bbox()) {
    return this.cx(x, box).cy(y, box)
  }

  ax(): number
  ax(x: number | string): this
  ax(x?: number | string) {
    return this.attr('x', x)
  }

  ay(): number
  ay(y: number | string): this
  ay(y?: number | string) {
    return this.attr('y', y)
  }

  amove(x: number | string, y: number | string) {
    return this.ax(x).ay(y)
  }
}
