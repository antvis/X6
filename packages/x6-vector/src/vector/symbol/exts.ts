import { Base } from '../common/base'
import { Symbol } from './symbol'
import { SVGSymbolAttributes } from './types'

export class ContainerExtension<
  TSVGElement extends SVGElement
> extends Base<TSVGElement> {
  symbol<Attributes extends SVGSymbolAttributes>(attrs?: Attributes) {
    return Symbol.create(attrs).appendTo(this)
  }
}
