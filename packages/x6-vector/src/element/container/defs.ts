import { VectorElement } from '../element'
import { Container } from './container'

@Defs.register('Defs')
export class Defs
  extends VectorElement<SVGDefsElement>
  implements Container.IContainer {
  flatten() {
    return this
  }

  ungroup() {
    return this
  }
}
