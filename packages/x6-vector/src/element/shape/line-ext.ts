import { Attrs } from '../../types'
import { Vector } from '../vector'
import { Line } from './line'

export class ContainerExtension<
  TSVGElement extends SVGElement
> extends Vector<TSVGElement> {
  line(attrs?: Attrs | null): Line
  line(points: [[number, number], [number, number]], attrs?: Attrs | null): Line
  line(
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    attrs?: Attrs | null,
  ): Line
  line(
    x1?: [[number, number], [number, number]] | number | Attrs | null,
    y1?: number | Attrs | null,
    x2?: number,
    y2?: number,
    attrs?: Attrs | null,
  ) {
    return Line.create(x1, y1, x2, y2, attrs).appendTo(this)
  }
}
