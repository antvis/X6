import { Base } from '../common/base'
import { SVGFEMergeAttributes } from './types'
import { FEMerge } from './fe-merge'

export class FilterExtension extends Base<SVGFilterElement> {
  feMerge<Attributes extends SVGFEMergeAttributes>(attrs?: Attributes | null) {
    return FEMerge.create(attrs).appendTo(this)
  }
}
