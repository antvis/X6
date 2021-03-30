import { Obj } from '../../util/obj'
import { PathExtension as TextpathExtension } from './textpath-ext'
import { LineExtension as MarkerLineExtension } from '../container/marker-ext'
import { Path } from './path'

declare module './path' {
  interface Path
    extends MarkerLineExtension<SVGPathElement>,
      TextpathExtension<SVGPathElement> {}
}

Obj.applyMixins(Path, TextpathExtension, MarkerLineExtension)
