import { Base } from '../common/base'
import { Circle } from './circle'
import { SVGCircleAttributes } from './types'

export class ContainerExtension<
  TSVGElement extends SVGElement
> extends Base<TSVGElement> {
  circle<Attributes extends SVGCircleAttributes>(
    attrs?: Attributes | null,
  ): Circle
  circle<Attributes extends SVGCircleAttributes>(
    size: number | string,
    attrs?: Attributes | null,
  ): Circle
  circle<Attributes extends SVGCircleAttributes>(
    size?: number | string | Attributes | null,
    attrs?: Attributes | null,
  ) {
    return Circle.create(size, attrs).appendTo(this)
  }
}
