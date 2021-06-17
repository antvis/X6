import { FEBase } from '../fe-base/fe-base'
import { SVGFEFuncGAttributes } from './types'

@FEFuncG.register('FeFuncG')
export class FEFuncG extends FEBase<SVGFEFuncGElement> {}

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
