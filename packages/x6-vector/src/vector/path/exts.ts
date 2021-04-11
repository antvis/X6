import { PathArray } from '../../struct/path-array'
import { Base } from '../common/base'
import { Path } from './path'
import { SVGPathAttributes } from './types'

export class ContainerExtension<
  TSVGElement extends SVGElement
> extends Base<TSVGElement> {
  path<Attributes extends SVGPathAttributes>(attrs?: Attributes | null): Path
  path<Attributes extends SVGPathAttributes>(
    d: string | Path.Segment[] | PathArray,
    attrs?: Attributes | null,
  ): Path
  path<Attributes extends SVGPathAttributes>(
    d?: string | Path.Segment[] | PathArray | Attributes | null,
    attrs?: Attributes | null,
  ) {
    return Path.create(d, attrs).appendTo(this)
  }
}
