import { Container } from '../container/container'
import { Viewbox } from '../container/viewbox'
import { SVGSymbolAttributes } from './types'

@Symbol.mixin(Viewbox)
@Symbol.register('Symbol')
export class Symbol extends Container<SVGSymbolElement> {}

export interface Symbol extends Viewbox<SVGSymbolElement> {}

export namespace Symbol {
  export function create<Attributes extends SVGSymbolAttributes>(
    attrs?: Attributes | null,
  ) {
    const symbol = new Symbol()
    if (attrs) {
      symbol.attr(attrs)
    }
    return symbol
  }
}
