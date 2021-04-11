import { Base } from '../common/base'
import { G } from './g'
import { SVGGAttributes } from './types'

export class ContainerExtension<
  TSVGElement extends SVGElement
> extends Base<TSVGElement> {
  group<Attributes extends SVGGAttributes>(attrs?: Attributes) {
    return G.create(attrs).appendTo(this)
  }
}
