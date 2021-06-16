import { FeBase } from '../fe-base/fe-base'
import { SVGFEFuncBAttributes } from './types'

@FEFuncB.register('FEFuncB')
export class FEFuncB extends FeBase<SVGFEFuncBElement> {}

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
