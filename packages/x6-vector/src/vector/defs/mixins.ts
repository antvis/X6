import { applyMixins } from '../../util'
import { DefsExtension as MaskExtension } from '../mask/exts'
import { DefsExtension as MarkerExtension } from '../marker/exts'
import { DefsExtension as PatternExtension } from '../pattern/exts'
import { DefsExtension as ClipPathExtension } from '../clippath/exts'
import { DefsExtension as GradientExtension } from '../gradient/exts'
import { DefsExtension as LinearGradientExtension } from '../gradient/linear-exts'
import { DefsExtension as RadialGradientExtension } from '../gradient/radial-exts'
import { ContainerExtension as CircleExtension } from '../circle/exts'
import { ContainerExtension as EllipseExtension } from '../ellipse/ext'
import { ContainerExtension as ImageExtension } from '../image/exts'
import { ContainerExtension as LineExtension } from '../line/exts'
import { ContainerExtension as PathExtension } from '../path/exts'
import { ContainerExtension as PolygonExtension } from '../polygon/exts'
import { ContainerExtension as PolylineExtension } from '../polyline/exts'
import { ContainerExtension as RectExtension } from '../rect/exts'
import { ContainerExtension as TextExtension } from '../text/exts'

import { Defs } from './defs'

declare module './defs' {
  interface Defs
    extends ClipPathExtension<SVGDefsElement>,
      MaskExtension<SVGDefsElement>,
      MarkerExtension<SVGDefsElement>,
      PatternExtension<SVGDefsElement>,
      GradientExtension<SVGDefsElement>,
      LinearGradientExtension<SVGDefsElement>,
      RadialGradientExtension<SVGDefsElement>,
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

applyMixins(
  Defs,
  MaskExtension,
  MarkerExtension,
  PatternExtension,
  ClipPathExtension,
  GradientExtension,
  LinearGradientExtension,
  RadialGradientExtension,
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
