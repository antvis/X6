import { Attrs } from '../../types'
import { Vector } from '../vector'
import { G } from './g'

export class ContainerExtension<
  TSVGElement extends SVGElement
> extends Vector<TSVGElement> {
  group(attrs?: Attrs) {
    return G.create(attrs).appendTo(this)
  }
}
