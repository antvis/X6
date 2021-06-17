import { FEBase } from '../fe-base/fe-base'
import { SVGFEFuncAAttributes } from './types'

@FEFuncA.register('FeFuncA')
export class FEFuncA extends FEBase<SVGFEFuncAElement> {}

export namespace FEFuncA {
  export function create<Attributes extends SVGFEFuncAAttributes>(
    attrs?: Attributes | null,
  ) {
    const elem = new FEFuncA()
    if (attrs) {
      elem.attr(attrs)
    }
    return elem
  }
}
