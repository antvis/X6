import { UnitNumber } from '../../struct/unit-number'
import { Size } from '../common/size'
import { Base } from '../common/base'

@Vector.register('Vector')
export class Vector<
  TSVGElement extends SVGElement = SVGElement,
> extends Base<TSVGElement> {
  width(): number
  width(width: string | number | null): this
  width(width?: string | number | null) {
    return this.attr('width', width)
  }

  height(): number
  height(height: string | number | null): this
  height(height?: string | number | null) {
    return this.attr('height', height)
  }

  size(width: string | number, height: string | number): this
  size(width: string | number, height: string | number | null | undefined): this
  size(width: string | number | null | undefined, height: string | number): this
  size(width?: string | number | null, height?: string | number | null) {
    const size = Size.normalize(this, width, height)
    return this.width(size.width).height(size.height)
  }

  x(): number
  x(x: string | number | null): this
  x(x?: string | number | null) {
    return this.attr('x', x)
  }

  y(): number
  y(y: string | number | null): this
  y(y?: string | number | null) {
    return this.attr('y', y)
  }

  move(x: string | number = 0, y: string | number = 0) {
    return this.x(x).y(y)
  }

  cx(): number
  cx(x: null): number
  cx(x: string | number): this
  cx(x?: string | number | null) {
    return x == null
      ? this.x() + this.width() / 2
      : this.x(UnitNumber.minus(x, this.width() / 2))
  }

  cy(): number
  cy(y: null): number
  cy(y: string | number | null): this
  cy(y?: string | number | null) {
    return y == null
      ? this.y() + this.height() / 2
      : this.y(UnitNumber.minus(y, this.height() / 2))
  }

  center(x: string | number, y: string | number) {
    return this.cx(x).cy(y)
  }

  dx(x: string | number) {
    return this.x(UnitNumber.plus(x, this.x()))
  }

  dy(y: string | number) {
    return this.y(UnitNumber.plus(y, this.y()))
  }

  dmove(x: string | number = 0, y: string | number = 0) {
    return this.dx(x).dy(y)
  }
}
