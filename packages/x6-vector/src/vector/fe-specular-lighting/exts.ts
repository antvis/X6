import { Base } from '../common/base'
import { SVGFESpecularLightingAttributes } from './types'
import { FESpecularLighting } from './fe-specular-lighting'

export class FilterExtension extends Base<SVGFilterElement> {
  feSpecularLighting<Attributes extends SVGFESpecularLightingAttributes>(
    attrs?: Attributes | null,
  ) {
    return FESpecularLighting.create(attrs).appendTo(this)
  }
}
