import { Base } from '../common/base'
import { SVGFEImageAttributes } from './types'
import { FEImage } from './fe-image'

export class FilterExtension extends Base<SVGFilterElement> {
  feImage<Attributes extends SVGFEImageAttributes>(attrs?: Attributes | null) {
    return FEImage.create(attrs).appendTo(this)
  }
}
