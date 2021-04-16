import { applyMixins } from '../../util'
import { Poly } from '../poly/poly'
import { LineExtension as MarkerLineExtension } from '../marker/exts'

declare module './poly' {
  interface Poly<TSVGPolyElement extends SVGPolygonElement | SVGPolylineElement>
    extends MarkerLineExtension<TSVGPolyElement> {}
}

applyMixins(Poly, MarkerLineExtension)
