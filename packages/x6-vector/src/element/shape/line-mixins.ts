import { ObjUtil } from '../../util/obj'
import { LineExtension as MarkerLineExtension } from '../container/marker-ext'
import { Line } from './line'

declare module './line' {
  interface Line extends MarkerLineExtension<SVGLineElement> {}
}

ObjUtil.applyMixins(Line, MarkerLineExtension)
