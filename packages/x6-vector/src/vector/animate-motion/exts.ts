import { Base } from '../common/base'
import { AnimateMotion } from './animate-motion'
import { SVGAnimateMotionAttributes } from './types'

export class ContainerExtension<
  TSVGElement extends SVGElement,
> extends Base<TSVGElement> {
  animateMotion<Attributes extends SVGAnimateMotionAttributes>(
    attrs?: Attributes | null,
  ) {
    return AnimateMotion.create(attrs).appendTo(this)
  }
}
