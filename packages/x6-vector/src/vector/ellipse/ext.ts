import { Base } from '../common/base'
import { Ellipse } from './ellipse'
import { SVGEllipseAttributes } from './types'

export class ContainerExtension<
  TSVGElement extends SVGElement,
> extends Base<TSVGElement> {
  ellipse<Attributes extends SVGEllipseAttributes>(
    attrs?: Attributes | null,
  ): Ellipse
  ellipse<Attributes extends SVGEllipseAttributes>(
    size: number | string,
    attrs?: Attributes | null,
  ): Ellipse
  ellipse<Attributes extends SVGEllipseAttributes>(
    width: number | string,
    height: string | number,
    attrs?: Attributes | null,
  ): Ellipse
  ellipse<Attributes extends SVGEllipseAttributes>(
    width?: number | string | Attributes | null,
    height?: number | string | Attributes | null,
    attrs?: Attributes | null,
  ) {
    return Ellipse.create(width, height, attrs).appendTo(this)
  }
}
