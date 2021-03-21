import { Attrs } from '../../types'
import { Vector } from '../vector'
import { ForeignObject } from './foreignobject'

export class ContainerExtension<
  TSVGElement extends SVGElement
> extends Vector<TSVGElement> {
  foreignObject(attrs?: Attrs | null): ForeignObject
  foreignObject(size: number | string, attrs?: Attrs | null): ForeignObject
  foreignObject(
    width: number | string,
    height: number | string,
    attrs?: Attrs | null,
  ): ForeignObject
  foreignObject(
    width?: number | string | Attrs | null,
    height?: number | string | Attrs | null,
    attrs?: Attrs | null,
  ) {
    return ForeignObject.create(width, height, attrs).appendTo(this)
  }
}
