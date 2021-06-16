import { Base } from '../common/base'
import { FEFlood } from './fe-flood'
import { SVGFEFloodAttributes } from './types'

export class FilterExtension extends Base<SVGFilterElement> {
  feFlood<Attributes extends SVGFEFloodAttributes>(attrs?: Attributes | null) {
    return FEFlood.create(attrs).appendTo(this)
  }
}
