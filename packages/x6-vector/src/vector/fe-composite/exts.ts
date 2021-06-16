import { Base } from '../common/base'
import { SVGFECompositeAttributes } from './types'
import { FEComposite } from './fe-composite'

export class FilterExtension extends Base<SVGFilterElement> {
  feComposite<Attributes extends SVGFECompositeAttributes>(
    attrs?: Attributes | null,
  ) {
    return FEComposite.create(attrs).appendTo(this)
  }
}
