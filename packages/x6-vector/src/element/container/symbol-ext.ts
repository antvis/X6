import { Attrs } from '../../types'
import { Vector } from '../vector'
import { Symbol } from './symbol'

export class ContainerExtension<
  TSVGElement extends SVGElement
> extends Vector<TSVGElement> {
  symbol(attrs?: Attrs) {
    return Symbol.create(attrs).appendTo(this)
  }
}
