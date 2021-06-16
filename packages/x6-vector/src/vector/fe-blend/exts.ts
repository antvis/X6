import { Base } from '../common/base'
import { FeBlend } from './fe-blend'
import { SVGFEBlendAttributes } from './types'

export class FilterExtension extends Base<SVGFilterElement> {
  feBlend<Attributes extends SVGFEBlendAttributes>(attrs?: Attributes | null) {
    return FeBlend.create(attrs).appendTo(this)
  }
}
