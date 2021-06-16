import { FeBase } from '../fe-base/fe-base'
import { SVGFEFuncGAttributes } from './types'

@FEFuncG.register('FEFuncG')
export class FEFuncG extends FeBase<SVGFEFuncGElement> {}

export namespace FEFuncG {
  export function create<Attributes extends SVGFEFuncGAttributes>(
    attrs?: Attributes | null,
  ) {
    const elem = new FEFuncG()
    if (attrs) {
      elem.attr(attrs)
    }
    return elem
  }
}
