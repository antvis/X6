import { Attrs } from '../../types'
import { Vector } from '../vector'
import { Decorator } from '../decorator'
import { Gradient } from './gradient'

type GradientMethod = {
  gradient(type: Gradient.Type, attrs?: Attrs | null): Gradient
  gradient(
    type: Gradient.Type,
    block: Gradient.Update,
    attrs?: Attrs | null,
  ): Gradient
  gradient(
    type: Gradient.Type,
    update?: Gradient.Update | Attrs | null,
    attrs?: Attrs | null,
  ): Gradient
}

export class ContainerExtension<TSVGElement extends SVGElement>
  extends Vector<TSVGElement>
  implements GradientMethod {
  @Decorator.checkDefs
  gradient(
    type: Gradient.Type,
    update?: Gradient.Update | Attrs | null,
    attrs?: Attrs | null,
  ) {
    return this.defs()!.gradient(type, update, attrs)
  }
}

export class DefsExtension<TSVGElement extends SVGElement>
  extends Vector<TSVGElement>
  implements GradientMethod {
  gradient(
    type: Gradient.Type,
    update?: Gradient.Update | Attrs | null,
    attrs?: Attrs | null,
  ) {
    return Gradient.create(type, update, attrs).appendTo(this)
  }
}
