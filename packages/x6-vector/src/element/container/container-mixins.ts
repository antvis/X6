import { Mixin } from '../../util/mixin'
// containers
import { ContainerExtension as AExtension } from './a-ext'
import { ContainerExtension as GExtension } from './g-ext'
import { ContainerExtension as SvgExtension } from './svg-ext'
import { ContainerExtension as MaskExtension } from './mask-ext'
import { ContainerExtension as MarkerExtension } from './marker-ext'
import { ContainerExtension as PatternExtension } from './pattern-ext'
import { ContainerExtension as ClipPathExtension } from './clippath-ext'
import { ContainerExtension as GradientExtension } from './gradient-ext'
import { ContainerExtension as SymbolExtension } from './symbol-ext'
// shapes
import { ContainerExtension as CircleExtension } from '../shape/circle-ext'
import { ContainerExtension as EllipseExtension } from '../shape/ellipse-ext'
import { ContainerExtension as ForeignObjectExtension } from '../shape/foreignobject-ext'
import { ContainerExtension as ImageExtension } from '../shape/image-ext'
import { ContainerExtension as LineExtension } from '../shape/line-ext'
import { ContainerExtension as PathExtension } from '../shape/path-ext'
import { ContainerExtension as PolygonExtension } from '../shape/polygon-ext'
import { ContainerExtension as PolylineExtension } from '../shape/polyline-ext'
import { ContainerExtension as RectExtension } from '../shape/rect-ext'
import { ContainerExtension as TextExtension } from '../shape/text-ext'
import { ContainerExtension as UseExtension } from '../shape/use-ext'
import { ContainerExtension as TextPathExtension } from '../shape/textpath-ext'

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

Mixin.applyMixins(
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
