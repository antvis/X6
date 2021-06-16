import { Base } from '../common/base'
import { SVGFEGaussianBlurAttributes } from './types'
import { FEGaussianBlur } from './fe-gaussian-blur'

export class FilterExtension extends Base<SVGFilterElement> {
  feGaussianBlur<Attributes extends SVGFEGaussianBlurAttributes>(
    attrs?: Attributes | null,
  ) {
    return FEGaussianBlur.create(attrs).appendTo(this)
  }
}
