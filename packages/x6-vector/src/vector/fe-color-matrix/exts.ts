import { Base } from '../common/base'
import { FeColorMatrix } from './fe-color-matrix'
import { SVGFEColorMatrixAttributes } from './types'

export class FilterExtension extends Base<SVGFilterElement> {
  feColorMatrix<Attributes extends SVGFEColorMatrixAttributes>(
    attrs?: Attributes | null,
  ) {
    return FeColorMatrix.create(attrs).appendTo(this)
  }
}
