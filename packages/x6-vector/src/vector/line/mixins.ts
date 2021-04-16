import { applyMixins } from '../../util'
import { LineExtension as MarkerLineExtension } from '../marker/exts'
import { Line } from './line'

declare module './line' {
  interface Line extends MarkerLineExtension<SVGLineElement> {}
}

applyMixins(Line, MarkerLineExtension)
