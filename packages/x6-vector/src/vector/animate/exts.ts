import { Base } from '../common/base'
import { Animate } from './animate'
import { SVGAnimateAttributes } from './types'

export class ContainerExtension<
  TSVGElement extends SVGElement,
> extends Base<TSVGElement> {
  animate<Attributes extends SVGAnimateAttributes>(attrs?: Attributes | null) {
    return Animate.create(attrs).appendTo(this)
  }
}
