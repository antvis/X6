import { Base } from '../common/base'
import { SVGFETileAttributes } from './types'
import { FETile } from './fe-tile'

export class FilterExtension extends Base<SVGFilterElement> {
  feTile<Attributes extends SVGFETileAttributes>(attrs?: Attributes | null) {
    return FETile.create(attrs).appendTo(this)
  }
}
