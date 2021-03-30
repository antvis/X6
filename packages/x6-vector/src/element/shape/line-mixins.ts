import { Obj } from '../../util/obj'
import { LineExtension as MarkerLineExtension } from '../container/marker-ext'
import { Line } from './line'

declare module './line' {
  interface Line extends MarkerLineExtension<SVGLineElement> {}
}

Obj.applyMixins(Line, MarkerLineExtension)
