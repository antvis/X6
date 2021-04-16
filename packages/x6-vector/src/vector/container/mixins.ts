import { applyMixins } from '../../util'

// containers
import { ContainerExtension as AExtension } from '../a/exts'
import { ContainerExtension as GExtension } from '../g/exts'
import { ContainerExtension as SvgExtension } from '../svg/exts'
import { ContainerExtension as MaskExtension } from '../mask/exts'
import { ContainerExtension as MarkerExtension } from '../marker/exts'
import { ContainerExtension as PatternExtension } from '../pattern/exts'
import { ContainerExtension as ClipPathExtension } from '../clippath/exts'
import { ContainerExtension as GradientExtension } from '../gradient/exts'
import { ContainerExtension as LinearGradientExtension } from '../gradient/linear-exts'
import { ContainerExtension as RadialGradientExtension } from '../gradient/radial-exts'
import { ContainerExtension as SymbolExtension } from '../symbol/exts'
// shapes
import { ContainerExtension as CircleExtension } from '../circle/exts'
import { ContainerExtension as EllipseExtension } from '../ellipse/ext'
import { ContainerExtension as ForeignObjectExtension } from '../foreignobject/exts'
import { ContainerExtension as ImageExtension } from '../image/exts'
import { ContainerExtension as LineExtension } from '../line/exts'
import { ContainerExtension as PathExtension } from '../path/exts'
import { ContainerExtension as PolygonExtension } from '../polygon/exts'
import { ContainerExtension as PolylineExtension } from '../polyline/exts'
import { ContainerExtension as RectExtension } from '../rect/exts'
import { ContainerExtension as TextExtension } from '../text/exts'
import { ContainerExtension as UseExtension } from '../use/exts'
import { ContainerExtension as TextPathExtension } from '../textpath/exts'

import { Container } from './container'

declare module './container' {
  interface Container<
    TSVGElement extends SVGElement = SVGElement
  > extends AExtension<TSVGElement>,
      GExtension<TSVGElement>,
      SvgExtension<TSVGElement>,
      MaskExtension<TSVGElement>,
      MarkerExtension<TSVGElement>,
      SymbolExtension<TSVGElement>,
      PatternExtension<TSVGElement>,
      ClipPathExtension<TSVGElement>,
      GradientExtension<TSVGElement>,
      LinearGradientExtension<TSVGElement>,
      RadialGradientExtension<TSVGElement>,
      // shapes
      UseExtension<TSVGElement>,
      RectExtension<TSVGElement>,
      LineExtension<TSVGElement>,
      TextExtension<TSVGElement>,
      PathExtension<TSVGElement>,
      ImageExtension<TSVGElement>,
      CircleExtension<TSVGElement>,
      EllipseExtension<TSVGElement>,
      PolygonExtension<TSVGElement>,
      PolylineExtension<TSVGElement>,
      TextPathExtension<TSVGElement>,
      ForeignObjectExtension<TSVGElement> {}
}

applyMixins(
  Container,
  AExtension,
  GExtension,
  SvgExtension,
  MaskExtension,
  MarkerExtension,
  SymbolExtension,
  PatternExtension,
  ClipPathExtension,
  GradientExtension,
  LinearGradientExtension,
  RadialGradientExtension,
  // shapes
  UseExtension,
  RectExtension,
  LineExtension,
  TextExtension,
  PathExtension,
  ImageExtension,
  CircleExtension,
  EllipseExtension,
  PolygonExtension,
  PolylineExtension,
  TextPathExtension,
  ForeignObjectExtension,
)
