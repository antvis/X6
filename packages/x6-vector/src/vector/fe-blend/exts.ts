import { Base } from '../common/base'
import { FEBlend } from './fe-blend'
import { SVGFEBlendAttributes } from './types'

export class FilterExtension extends Base<SVGFilterElement> {
  feBlend<Attributes extends SVGFEBlendAttributes>(attrs?: Attributes | null) {
    return FEBlend.create(attrs).appendTo(this)
  }
}
