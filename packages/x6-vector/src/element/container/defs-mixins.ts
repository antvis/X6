import { Mixin } from '../../util/mixin'
import { DefsExtension as MaskExtension } from './mask-ext'
import { DefsExtension as MarkerExtension } from './marker-ext'
import { DefsExtension as PatternExtension } from './pattern-ext'
import { DefsExtension as ClipPathExtension } from './clippath-ext'
import { DefsExtension as GradientPathExtension } from './gradient-ext'
import { ContainerExtension as CircleExtension } from '../shape/circle-ext'
import { ContainerExtension as EllipseExtension } from '../shape/ellipse-ext'
import { ContainerExtension as ImageExtension } from '../shape/image-ext'
import { ContainerExtension as LineExtension } from '../shape/line-ext'
import { ContainerExtension as PathExtension } from '../shape/path-ext'
import { ContainerExtension as PolygonExtension } from '../shape/polygon-ext'
import { ContainerExtension as PolylineExtension } from '../shape/polyline-ext'
import { ContainerExtension as RectExtension } from '../shape/rect-ext'
import { ContainerExtension as TextExtension } from '../shape/text-ext'

import { Defs } from './defs'

declare module './defs' {
  interface Defs
    extends ClipPathExtension<SVGDefsElement>,
      GradientPathExtension<SVGDefsElement>,
      PatternExtension<SVGDefsElement>,
      MaskExtension<SVGDefsElement>,
      MarkerExtension<SVGDefsElement>,
      // shapes
      RectExtension<SVGDefsElement>,
      LineExtension<SVGDefsElement>,
      TextExtension<SVGDefsElement>,
      PathExtension<SVGDefsElement>,
      ImageExtension<SVGDefsElement>,
      CircleExtension<SVGDefsElement>,
      EllipseExtension<SVGDefsElement>,
      PolygonExtension<SVGDefsElement>,
      PolylineExtension<SVGDefsElement> {}
}

Mixin.applyMixins(
  Defs,
  MaskExtension,
  MarkerExtension,
  PatternExtension,
  ClipPathExtension,
  GradientPathExtension,
  // shapes
  RectExtension,
  LineExtension,
  TextExtension,
  PathExtension,
  ImageExtension,
  CircleExtension,
  EllipseExtension,
  PolygonExtension,
  PolylineExtension,
)
