import { Base } from '../common/base'
import { Decorator } from '../common/decorator'
import { Gradient } from './gradient'
import { RadialGradient } from './radial'
import { SVGRadialGradientAttributes } from './types'

type GradientMethod = {
  radialGradient<Attributes extends SVGRadialGradientAttributes>(
    attrs?: Attributes | null,
  ): RadialGradient
  radialGradient<Attributes extends SVGRadialGradientAttributes>(
    block: Gradient.Update<SVGRadialGradientElement>,
    attrs?: Attributes | null,
  ): RadialGradient
  radialGradient<Attributes extends SVGRadialGradientAttributes>(
    update?: Gradient.Update<SVGRadialGradientElement> | Attributes | null,
    attrs?: Attributes | null,
  ): RadialGradient
}

export class ContainerExtension<TSVGElement extends SVGElement>
  extends Base<TSVGElement>
  implements GradientMethod
{
  @Decorator.checkDefs
  radialGradient<Attributes extends SVGRadialGradientAttributes>(
    update?: Gradient.Update<SVGRadialGradientElement> | Attributes | null,
    attrs?: Attributes | null,
  ): RadialGradient {
    return this.defs()!.radialGradient(update, attrs)
  }
}

export class DefsExtension<TSVGElement extends SVGElement>
  extends Base<TSVGElement>
  implements GradientMethod
{
  radialGradient<Attributes extends SVGRadialGradientAttributes>(
    update?: Gradient.Update<SVGRadialGradientElement> | Attributes | null,
    attrs?: Attributes | null,
  ): RadialGradient {
    return RadialGradient.create(update, attrs).appendTo(this)
  }
}
