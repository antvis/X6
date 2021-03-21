import { Attrs } from '../../types'
import { Vector } from '../vector'
import { Polyline } from './polyline'

export class ContainerExtension<
  TSVGElement extends SVGElement
> extends Vector<TSVGElement> {
  polyline(attrs?: Attrs | null): Polyline
  polyline(points: string, attrs?: Attrs | null): Polyline
  polyline(points: [number, number][], attrs?: Attrs | null): Polyline
  polyline(
    points?: string | [number, number][] | Attrs | null,
    attrs?: Attrs | null,
  ) {
    return Polyline.create(points, attrs).appendTo(this)
  }
}
