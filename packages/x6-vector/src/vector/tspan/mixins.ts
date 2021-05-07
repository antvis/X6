import { applyMixins } from '../../util/mixin'
import { TextExtension as TspanExtension } from '../tspan/exts'
import { TSpan } from './tspan'

declare module './tspan' {
  interface TSpan extends TspanExtension<SVGTSpanElement> {}
}

applyMixins(TSpan, TspanExtension)
