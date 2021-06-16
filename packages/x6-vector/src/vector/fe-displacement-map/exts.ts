import { Base } from '../common/base'
import { SVGFEDisplacementMapAttributes } from './types'
import { FEDisplacementMap } from './fe-displacement-map'

export class FilterExtension extends Base<SVGFilterElement> {
  feDisplacementMap<Attributes extends SVGFEDisplacementMapAttributes>(
    attrs?: Attributes | null,
  ) {
    return FEDisplacementMap.create(attrs).appendTo(this)
  }
}
