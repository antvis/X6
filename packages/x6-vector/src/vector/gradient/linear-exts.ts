import { Base } from '../common/base'
import { Decorator } from '../common/decorator'
import { Gradient } from './gradient'
import { LinearGradient } from './linear'
import { SVGLinearGradientAttributes } from './types'

type GradientMethod = {
  linearGradient<Attributes extends SVGLinearGradientAttributes>(
    attrs?: Attributes | null,
  ): LinearGradient
  linearGradient<Attributes extends SVGLinearGradientAttributes>(
    update: Gradient.Update<SVGLinearGradientElement>,
    attrs?: Attributes | null,
  ): LinearGradient
  linearGradient<Attributes extends SVGLinearGradientAttributes>(
    update?: Gradient.Update<SVGLinearGradientElement> | Attributes | null,
    attrs?: Attributes | null,
  ): LinearGradient
}

export class ContainerExtension<TSVGElement extends SVGElement>
  extends Base<TSVGElement>
  implements GradientMethod
{
  @Decorator.checkDefs
  linearGradient<Attributes extends SVGLinearGradientAttributes>(
    update?: Gradient.Update<SVGLinearGradientElement> | Attributes | null,
    attrs?: Attributes | null,
  ): LinearGradient {
    return this.defs()!.linearGradient(update, attrs)
  }
}

export class DefsExtension<TSVGElement extends SVGElement>
  extends Base<TSVGElement>
  implements GradientMethod
{
  linearGradient<Attributes extends SVGLinearGradientAttributes>(
    update?: Gradient.Update<SVGLinearGradientElement> | Attributes | null,
    attrs?: Attributes | null,
  ): LinearGradient {
    return LinearGradient.create(update, attrs).appendTo(this)
  }
}
