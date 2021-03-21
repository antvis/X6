import { Attrs } from '../../types'
import { Vector } from '../vector'
import { Rect } from './rect'

export class ContainerExtension<
  TSVGElement extends SVGElement
> extends Vector<TSVGElement> {
  rect(attrs?: Attrs | null): Rect
  rect(size: number | string, attrs?: Attrs | null): Rect
  rect(
    width: number | string,
    height: string | number,
    attrs?: Attrs | null,
  ): Rect
  rect(
    width?: number | string | Attrs | null,
    height?: number | string | Attrs | null,
    attrs?: Attrs | null,
  ) {
    return Rect.create(width, height, attrs).appendTo(this)
  }
}
