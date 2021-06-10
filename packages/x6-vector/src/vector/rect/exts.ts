import { Base } from '../common/base'
import { Rect } from './rect'
import { SVGRectAttributes } from './types'

export class ContainerExtension<
  TSVGElement extends SVGElement,
> extends Base<TSVGElement> {
  rect<Attributes extends SVGRectAttributes>(attrs?: Attributes | null): Rect
  rect<Attributes extends SVGRectAttributes>(
    size: number | string,
    attrs?: Attributes | null,
  ): Rect
  rect<Attributes extends SVGRectAttributes>(
    width: number | string,
    height: string | number,
    attrs?: Attributes | null,
  ): Rect
  rect<Attributes extends SVGRectAttributes>(
    width?: number | string | Attributes | null,
    height?: number | string | Attributes | null,
    attrs?: Attributes | null,
  ) {
    return Rect.create(width, height, attrs).appendTo(this)
  }
}
