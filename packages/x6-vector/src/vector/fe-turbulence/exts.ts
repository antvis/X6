import { Base } from '../common/base'
import { SVGFETurbulenceAttributes } from './types'
import { FETurbulence } from './fe-turbulence'

export class FilterExtension extends Base<SVGFilterElement> {
  feTurbulence<Attributes extends SVGFETurbulenceAttributes>(
    attrs?: Attributes | null,
  ) {
    return FETurbulence.create(attrs).appendTo(this)
  }
}
