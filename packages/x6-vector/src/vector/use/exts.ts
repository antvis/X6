import { Base } from '../common/base'
import { Use } from './use'
import { SVGUseAttributes } from './types'
import { Vector } from '../vector/vector'

export class ContainerExtension<
  TSVGElement extends SVGElement
> extends Base<TSVGElement> {
  use<Attributes extends SVGUseAttributes>(attrs?: Attributes | null): Use
  use<Attributes extends SVGUseAttributes>(
    element: Vector,
    attrs?: Attributes | null,
  ): Use
  use<Attributes extends SVGUseAttributes>(
    elementId: string,
    attrs?: Attributes | null,
  ): Use
  use<Attributes extends SVGUseAttributes>(
    element: Vector,
    file: string,
    attrs?: Attributes | null,
  ): Use
  use<Attributes extends SVGUseAttributes>(
    elementId: string,
    file: string,
    attrs?: Attributes | null,
  ): Use
  use<Attributes extends SVGUseAttributes>(
    elementId?: string | Vector | Attributes | null,
    file?: string | Attributes | null,
    attrs?: Attributes | null,
  ) {
    return Use.create(elementId, file, attrs).appendTo(this)
  }
}
