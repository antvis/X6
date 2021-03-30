import { Poly } from './poly'
import { LineExtension as MarkerLineExtension } from '../container/marker-ext'
import { Obj } from '../../util/obj'

declare module './poly' {
  interface Poly<TSVGPolyElement extends SVGPolygonElement | SVGPolylineElement>
    extends MarkerLineExtension<TSVGPolyElement> {}
}

Obj.applyMixins(Poly, MarkerLineExtension)
