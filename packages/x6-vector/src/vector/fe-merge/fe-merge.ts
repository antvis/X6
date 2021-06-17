import { FEBase } from '../fe-base/fe-base'
import { SVGFEMergeAttributes } from './types'
import { FEMergeNode } from '../fe-merge-node/fe-merge-node'
import { SVGFEMergeNodeAttributes } from '../fe-merge-node/types'

@FEMerge.register('FeMerge')
export class FEMerge extends FEBase<SVGFEMergeElement> {
  feMergeNode<Attributes extends SVGFEMergeNodeAttributes>(
    attrs?: Attributes | null,
  ) {
    return FEMergeNode.create(attrs).appendTo(this)
  }
}

export namespace FEMerge {
  export function create<Attributes extends SVGFEMergeAttributes>(
    attrs?: Attributes | null,
  ) {
    const elem = new FEMerge()
    if (attrs) {
      elem.attr(attrs)
    }
    return elem
  }
}
