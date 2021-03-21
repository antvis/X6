import { Attrs } from '../../types'
import { Vector } from '../vector'
import { Ellipse } from './ellipse'

export class ContainerExtension<
  TSVGElement extends SVGElement
> extends Vector<TSVGElement> {
  ellipse(attrs?: Attrs | null): Ellipse
  ellipse(size: number | string, attrs?: Attrs | null): Ellipse
  ellipse(
    width: number | string,
    height: string | number,
    attrs?: Attrs | null,
  ): Ellipse
  ellipse(
    width?: number | string | Attrs | null,
    height?: number | string | Attrs | null,
    attrs?: Attrs | null,
  ) {
    return Ellipse.create(width, height, attrs).appendTo(this)
  }
}
