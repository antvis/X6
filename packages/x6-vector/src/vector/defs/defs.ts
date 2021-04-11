import { Vector } from '../vector/vector'
import { Container } from '../container/container'

@Defs.register('Defs')
export class Defs
  extends Vector<SVGDefsElement>
  implements Container.IContainer {
  flatten() {
    return this
  }

  ungroup() {
    return this
  }
}
