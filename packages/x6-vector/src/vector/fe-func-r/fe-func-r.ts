import { FEBase } from '../fe-base/fe-base'
import { SVGFEFuncRAttributes } from './types'

@FEFuncR.register('FeFuncR')
export class FEFuncR extends FEBase<SVGFEFuncRElement> {}

export namespace FEFuncR {
  export function create<Attributes extends SVGFEFuncRAttributes>(
    attrs?: Attributes | null,
  ) {
    const elem = new FEFuncR()
    if (attrs) {
      elem.attr(attrs)
    }
    return elem
  }
}
