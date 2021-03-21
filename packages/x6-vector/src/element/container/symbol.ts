import { Attrs } from '../../types'
import { Container } from './container'
import { Viewbox } from './container-viewbox'

@Symbol.mixin(Viewbox)
@Symbol.register('Symbol')
export class Symbol extends Container<SVGSymbolElement> {}

export interface Symbol extends Viewbox<SVGSymbolElement> {}

export namespace Symbol {
  export function create(attrs?: Attrs | null) {
    const symbol = new Symbol()
    if (attrs) {
      symbol.attr(attrs)
    }
    return symbol
  }
}
