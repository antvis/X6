import { Poly } from './poly'
import { LineExtension as MarkerLineExtension } from '../container/marker-ext'
import { ObjUtil } from '../../util/obj'

declare module './poly' {
  interface Poly<TSVGPolyElement extends SVGPolygonElement | SVGPolylineElement>
    extends MarkerLineExtension<TSVGPolyElement> {}
}

ObjUtil.applyMixins(Poly, MarkerLineExtension)
