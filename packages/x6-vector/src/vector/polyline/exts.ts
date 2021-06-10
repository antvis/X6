import { Base } from '../common/base'
import { Polyline } from './polyline'
import { SVGPolylineAttributes } from './types'

export class ContainerExtension<
  TSVGElement extends SVGElement,
> extends Base<TSVGElement> {
  polyline<Attributes extends SVGPolylineAttributes>(
    attrs?: Attributes | null,
  ): Polyline
  polyline<Attributes extends SVGPolylineAttributes>(
    points: string,
    attrs?: Attributes | null,
  ): Polyline
  polyline<Attributes extends SVGPolylineAttributes>(
    points: [number, number][],
    attrs?: Attributes | null,
  ): Polyline
  polyline<Attributes extends SVGPolylineAttributes>(
    points?: string | [number, number][] | Attributes | null,
    attrs?: Attributes | null,
  ) {
    return Polyline.create(points, attrs).appendTo(this)
  }
}
