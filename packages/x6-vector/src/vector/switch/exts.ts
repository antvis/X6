import { Base } from '../common/base'
import { Switch } from './switch'
import { SVGSwitchAttributes } from './types'

export class ContainerExtension<
  TSVGElement extends SVGElement,
> extends Base<TSVGElement> {
  switch<Attributes extends SVGSwitchAttributes>(attrs?: Attributes | null) {
    return Switch.create(attrs).appendTo(this)
  }
}
