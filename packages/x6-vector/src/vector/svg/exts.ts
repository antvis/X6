import { Base } from '../common/base'
import { Svg } from './svg'
import { SVGSVGAttributes } from './types'

export class ContainerExtension<
  TSVGElement extends SVGElement,
> extends Base<TSVGElement> {
  nested<Attributes extends SVGSVGAttributes>(attrs?: Attributes) {
    return Svg.create(attrs).appendTo(this)
  }
}
