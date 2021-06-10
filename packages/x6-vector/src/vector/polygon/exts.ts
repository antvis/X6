import { Base } from '../common/base'
import { Polygon } from './polygon'
import { SVGPolygonAttributes } from './types'

export class ContainerExtension<
  TSVGElement extends SVGElement,
> extends Base<TSVGElement> {
  polygon<Attributes extends SVGPolygonAttributes>(
    attrs?: Attributes | null,
  ): Polygon
  polygon<Attributes extends SVGPolygonAttributes>(
    points: string,
    attrs?: Attributes | null,
  ): Polygon
  polygon<Attributes extends SVGPolygonAttributes>(
    points: [number, number][],
    attrs?: Attributes | null,
  ): Polygon
  polygon<Attributes extends SVGPolygonAttributes>(
    points?: string | [number, number][] | Attributes | null,
    attrs?: Attributes | null,
  ) {
    return Polygon.create(points, attrs).appendTo(this)
  }
}
