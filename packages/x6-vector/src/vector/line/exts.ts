import { Base } from '../common/base'
import { Line } from './line'
import { SVGLineAttributes } from './types'

export class ContainerExtension<
  TSVGElement extends SVGElement,
> extends Base<TSVGElement> {
  line<Attributes extends SVGLineAttributes>(attrs?: Attributes | null): Line
  line<Attributes extends SVGLineAttributes>(
    points: [[number, number], [number, number]],
    attrs?: Attributes | null,
  ): Line
  line<Attributes extends SVGLineAttributes>(
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    attrs?: Attributes | null,
  ): Line
  line<Attributes extends SVGLineAttributes>(
    x1?: [[number, number], [number, number]] | number | Attributes | null,
    y1?: number | Attributes | null,
    x2?: number,
    y2?: number,
    attrs?: Attributes | null,
  ) {
    return Line.create(x1, y1, x2, y2, attrs).appendTo(this)
  }
}
