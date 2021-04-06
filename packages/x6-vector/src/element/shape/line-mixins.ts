import { Mixin } from '../../util/mixin'
import { LineExtension as MarkerLineExtension } from '../container/marker-ext'
import { Line } from './line'

declare module './line' {
  interface Line extends MarkerLineExtension<SVGLineElement> {}
}

Mixin.applyMixins(Line, MarkerLineExtension)
