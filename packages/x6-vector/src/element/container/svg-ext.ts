import { Attrs } from '../../types'
import { Vector } from '../vector'
import { Svg } from './svg'

export class ContainerExtension<
  TSVGElement extends SVGElement
> extends Vector<TSVGElement> {
  nested(attrs?: Attrs) {
    return Svg.create(attrs).appendTo(this)
  }
}
