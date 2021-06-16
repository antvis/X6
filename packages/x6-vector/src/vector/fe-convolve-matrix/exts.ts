import { Base } from '../common/base'
import { SVGFEConvolveMatrixAttributes } from './types'
import { FEConvolveMatrix } from './fe-convolve-matrix'

export class FilterExtension extends Base<SVGFilterElement> {
  feConvolveMatrix<Attributes extends SVGFEConvolveMatrixAttributes>(
    attrs?: Attributes | null,
  ) {
    return FEConvolveMatrix.create(attrs).appendTo(this)
  }
}
