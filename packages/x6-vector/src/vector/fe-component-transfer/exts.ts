import { Base } from '../common/base'
import { SVGFEComponentTransferAttributes } from './types'
import { FEComponentTransfer } from './fe-component-transfer'

export class FilterExtension extends Base<SVGFilterElement> {
  feComponentTransfer<Attributes extends SVGFEComponentTransferAttributes>(
    attrs?: Attributes | null,
  ) {
    return FEComponentTransfer.create(attrs).appendTo(this)
  }
}
