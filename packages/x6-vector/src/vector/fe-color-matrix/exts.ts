import { Base } from '../common/base'
import { FEColorMatrix } from './fe-color-matrix'
import { SVGFEColorMatrixAttributes } from './types'

export class FilterExtension extends Base<SVGFilterElement> {
  feColorMatrix<Attributes extends SVGFEColorMatrixAttributes>(
    attrs?: Attributes | null,
  ) {
    return FEColorMatrix.create(attrs).appendTo(this)
  }
}
