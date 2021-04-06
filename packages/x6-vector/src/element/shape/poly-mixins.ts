import { Poly } from './poly'
import { LineExtension as MarkerLineExtension } from '../container/marker-ext'
import { Mixin } from '../../util/mixin'

declare module './poly' {
  interface Poly<TSVGPolyElement extends SVGPolygonElement | SVGPolylineElement>
    extends MarkerLineExtension<TSVGPolyElement> {}
}

Mixin.applyMixins(Poly, MarkerLineExtension)
