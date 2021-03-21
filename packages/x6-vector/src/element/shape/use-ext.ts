import { Attrs } from '../../types'
import { Vector } from '../vector'
import { Use } from './use'

export class ContainerExtension<
  TSVGElement extends SVGElement
> extends Vector<TSVGElement> {
  use(attrs?: Attrs | null): Use
  use(elementId: string, attrs?: Attrs | null): Use
  use(elementId: string, file: string, attrs?: Attrs | null): Use
  use(
    elementId?: string | Attrs | null,
    file?: string | Attrs | null,
    attrs?: Attrs | null,
  ) {
    return Use.create(elementId, file, attrs).appendTo(this)
  }
}
