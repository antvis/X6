import { Symbol } from '../../vector/symbol/symbol'
import { SVGViewboxAnimator } from './container-viewbox'

@SVGSymbolAnimator.register('Symbol')
export class SVGSymbolAnimator extends SVGViewboxAnimator<
  SVGSymbolElement,
  Symbol // eslint-disable-line
> {}
