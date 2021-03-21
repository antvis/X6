import { Attrs } from '../../types'
import { Vector } from '../vector'
import { Circle } from './circle'

export class ContainerExtension<
  TSVGElement extends SVGElement
> extends Vector<TSVGElement> {
  circle(attrs?: Attrs | null): Circle
  circle(size: number | string, attrs?: Attrs | null): Circle
  circle(size?: number | string | Attrs | null, attrs?: Attrs | null) {
    return Circle.create(size, attrs).appendTo(this)
  }
}
