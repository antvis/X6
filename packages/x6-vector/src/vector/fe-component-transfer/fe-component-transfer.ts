import { FEBase } from '../fe-base/fe-base'
import { SVGFEFuncAAttributes } from '../fe-func-a/types'
import { SVGFEFuncBAttributes } from '../fe-func-b/types'
import { SVGFEFuncGAttributes } from '../fe-func-g/types'
import { SVGFEFuncRAttributes } from '../fe-func-r/types'
import { FEFuncA } from '../fe-func-a/fe-func-a'
import { FEFuncB } from '../fe-func-b/fe-func-b'
import { FEFuncG } from '../fe-func-g/fe-func-g'
import { FEFuncR } from '../fe-func-r/fe-func-r'
import { SVGFEComponentTransferAttributes, In } from './types'

@FEComponentTransfer.register('FeComponentTransfer')
export class FEComponentTransfer extends FEBase<SVGFEComponentTransferElement> {
  in(): In | string
  in(type: In): this
  in(type: string): this
  in(type: null): this
  in(type?: In | string | null) {
    return this.attr('in', type)
  }

  feFuncA<Attributes extends SVGFEFuncAAttributes>(attrs?: Attributes | null) {
    return FEFuncA.create(attrs).appendTo(this)
  }

  feFuncB<Attributes extends SVGFEFuncBAttributes>(attrs?: Attributes | null) {
    return FEFuncB.create(attrs).appendTo(this)
  }

  feFuncG<Attributes extends SVGFEFuncGAttributes>(attrs?: Attributes | null) {
    return FEFuncG.create(attrs).appendTo(this)
  }

  feFuncR<Attributes extends SVGFEFuncRAttributes>(attrs?: Attributes | null) {
    return FEFuncR.create(attrs).appendTo(this)
  }
}

export namespace FEComponentTransfer {
  export function create<Attributes extends SVGFEComponentTransferAttributes>(
    attrs?: Attributes | null,
  ) {
    const elem = new FEComponentTransfer()
    if (attrs) {
      elem.attr(attrs)
    }
    return elem
  }
}
