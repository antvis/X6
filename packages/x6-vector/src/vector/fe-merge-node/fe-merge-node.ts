import { FeBase } from '../fe-base/fe-base'
import { SVGFEMergeNodeAttributes, In } from './types'

@FEMergeNode.register('FEMergeNode')
export class FEMergeNode extends FeBase<SVGFEMergeNodeElement> {
  in(): In | string
  in(type: In): this
  in(type: string): this
  in(type: null): this
  in(type?: In | string | null) {
    return this.attr('in', type)
  }
}

export namespace FEMergeNode {
  export function create<Attributes extends SVGFEMergeNodeAttributes>(
    attrs?: Attributes | null,
  ) {
    const elem = new FEMergeNode()
    if (attrs) {
      elem.attr(attrs)
    }
    return elem
  }
}
