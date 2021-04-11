import { Base } from '../common/base'
import { ForeignObject } from './foreignobject'
import { SVGForeignObjectAttributes } from './types'

export class ContainerExtension<
  TSVGElement extends SVGElement
> extends Base<TSVGElement> {
  foreignObject<Attributes extends SVGForeignObjectAttributes>(
    attrs?: Attributes | null,
  ): ForeignObject
  foreignObject<Attributes extends SVGForeignObjectAttributes>(
    size: number | string,
    attrs?: Attributes | null,
  ): ForeignObject
  foreignObject<Attributes extends SVGForeignObjectAttributes>(
    width: number | string,
    height: number | string,
    attrs?: Attributes | null,
  ): ForeignObject
  foreignObject<Attributes extends SVGForeignObjectAttributes>(
    width?: number | string | Attributes | null,
    height?: number | string | Attributes | null,
    attrs?: Attributes | null,
  ) {
    return ForeignObject.create(width, height, attrs).appendTo(this)
  }
}
