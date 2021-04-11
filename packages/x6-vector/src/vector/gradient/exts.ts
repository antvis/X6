import { Base } from '../common/base'
import { Decorator } from '../common/decorator'
import { Gradient } from './gradient'
import { LinearGradient } from './linear'
import { RadialGradient } from './radial'
import {
  SVGLinearGradientAttributes,
  SVGRadialGradientAttributes,
} from './types'

export interface SVGGradientAttributesMap {
  linear: SVGLinearGradientAttributes
  radial: SVGRadialGradientAttributes
}

export interface SVGGradientElementMap {
  linear: SVGLinearGradientElement
  radial: SVGRadialGradientElement
}

type GradientType = keyof SVGGradientAttributesMap

type GradientMethod = {
  gradient<
    Type extends GradientType,
    Attributes extends SVGGradientAttributesMap[Type]
  >(
    type: Type,
    attrs?: Attributes | null,
  ): SVGGradientElementMap[Type]
  gradient<
    Type extends GradientType,
    Attributes extends SVGGradientAttributesMap[Type]
  >(
    type: Type,
    update: Gradient.Update<SVGGradientElementMap[Type]>,
    attrs?: Attributes | null,
  ): SVGGradientElementMap[Type]
  gradient<
    Type extends GradientType,
    Attributes extends SVGGradientAttributesMap[Type]
  >(
    type: Type,
    update?: Gradient.Update<SVGGradientElementMap[Type]> | Attributes | null,
    attrs?: Attributes | null,
  ): SVGGradientElementMap[Type]
}

export class ContainerExtension<TSVGElement extends SVGElement>
  extends Base<TSVGElement>
  implements GradientMethod {
  @Decorator.checkDefs
  gradient<
    Type extends GradientType,
    Attributes extends SVGGradientAttributesMap[Type]
  >(
    type: Type,
    update?: Gradient.Update<SVGGradientElementMap[Type]> | Attributes | null,
    attrs?: Attributes | null,
  ): SVGGradientElementMap[Type] {
    return this.defs()!.gradient(type, update, attrs)
  }
}

export class DefsExtension<TSVGElement extends SVGElement>
  extends Base<TSVGElement>
  implements GradientMethod {
  gradient<
    Type extends GradientType,
    Attributes extends SVGGradientAttributesMap[Type]
  >(
    type: Type,
    update?: Gradient.Update<SVGGradientElementMap[Type]> | Attributes | null,
    attrs?: Attributes | null,
  ): SVGGradientElementMap[Type] {
    return type === 'linear'
      ? (LinearGradient.create(
          update as Gradient.Update<SVGLinearGradientElement>,
          attrs,
        ).appendTo(this) as any)
      : (RadialGradient.create(
          update as Gradient.Update<SVGRadialGradientElement>,
          attrs,
        ).appendTo(this) as any)
  }
}
