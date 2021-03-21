import { Attrs } from '../../types'
import { Vector } from '../vector'
import { Polygon } from './polygon'

export class ContainerExtension<
  TSVGElement extends SVGElement
> extends Vector<TSVGElement> {
  polygon(attrs?: Attrs | null): Polygon
  polygon(points: string, attrs?: Attrs | null): Polygon
  polygon(points: [number, number][], attrs?: Attrs | null): Polygon
  polygon(
    points?: string | [number, number][] | Attrs | null,
    attrs?: Attrs | null,
  ) {
    return Polygon.create(points, attrs).appendTo(this)
  }
}
