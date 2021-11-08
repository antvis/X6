import { Base } from '../common/base'
import { AnimateTransform } from './animate-transform'
import { SVGAnimateTransformAttributes } from './types'

export class ContainerExtension<
  TSVGElement extends SVGElement,
> extends Base<TSVGElement> {
  animateTransform<Attributes extends SVGAnimateTransformAttributes>(
    attrs?: Attributes | null,
  ) {
    return AnimateTransform.create(attrs).appendTo(this)
  }
}
