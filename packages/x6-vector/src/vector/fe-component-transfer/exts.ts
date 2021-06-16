import { Base } from '../common/base'
import { SVGFEComponentTransferAttributes } from './types'
import { FeComponentTransfer } from './fe-component-transfer'

export class FilterExtension extends Base<SVGFilterElement> {
  feComponentTransfer<Attributes extends SVGFEComponentTransferAttributes>(
    attrs?: Attributes | null,
  ) {
    return FeComponentTransfer.create(attrs).appendTo(this)
  }
}
