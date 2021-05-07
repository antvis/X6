import { applyMixins } from '../../util/mixin'
import { LineExtension as MarkerLineExtension } from '../marker/exts'
import { Line } from './line'

declare module './line' {
  interface Line extends MarkerLineExtension<SVGLineElement> {}
}

applyMixins(Line, MarkerLineExtension)
