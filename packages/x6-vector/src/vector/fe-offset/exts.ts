import { Base } from '../common/base'
import { SVGFEOffsetAttributes } from './types'
import { FEOffset } from './fe-offset'

export class FilterExtension extends Base<SVGFilterElement> {
  feOffset<Attributes extends SVGFEOffsetAttributes>(
    attrs?: Attributes | null,
  ) {
    return FEOffset.create(attrs).appendTo(this)
  }
}
