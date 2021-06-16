import { Base } from '../common/base'
import { SVGFEMorphologyAttributes } from './types'
import { FEMorphology } from './fe-morphology'

export class FilterExtension extends Base<SVGFilterElement> {
  feMorphology<Attributes extends SVGFEMorphologyAttributes>(
    attrs?: Attributes | null,
  ) {
    return FEMorphology.create(attrs).appendTo(this)
  }
}
