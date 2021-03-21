import { Attrs } from '../../types'
import { PathArray } from '../../struct/path-array'
import { Vector } from '../vector'
import { Path } from './path'

export class ContainerExtension<
  TSVGElement extends SVGElement
> extends Vector<TSVGElement> {
  path(attrs?: Attrs | null): Path
  path(d: string | Path.Segment[] | PathArray, attrs?: Attrs | null): Path
  path(
    d?: string | Path.Segment[] | PathArray | Attrs | null,
    attrs?: Attrs | null,
  ) {
    return Path.create(d, attrs).appendTo(this)
  }
}
