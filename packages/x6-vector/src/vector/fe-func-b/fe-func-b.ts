import { FEBase } from '../fe-base/fe-base'
import { SVGFEFuncBAttributes } from './types'

@FEFuncB.register('FeFuncB')
export class FEFuncB extends FEBase<SVGFEFuncBElement> {}

export namespace FEFuncB {
  export function create<Attributes extends SVGFEFuncBAttributes>(
    attrs?: Attributes | null,
  ) {
    const elem = new FEFuncB()
    if (attrs) {
      elem.attr(attrs)
    }
    return elem
  }
}
