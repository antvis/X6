import { Base } from '../common/base'
import { SVGFEDiffuseLightingAttributes } from './types'
import { FEDiffuseLighting } from './fe-diffuse-lighting'

export class FilterExtension extends Base<SVGFilterElement> {
  feDiffuseLighting<Attributes extends SVGFEDiffuseLightingAttributes>(
    attrs?: Attributes | null,
  ) {
    return FEDiffuseLighting.create(attrs).appendTo(this)
  }
}
