import { applyMixins } from '../../util/mixin'

import { ContainerExtension as LineExtension } from '../line/exts'
import { ContainerExtension as RectExtension } from '../rect/exts'
import { ContainerExtension as CircleExtension } from '../circle/exts'
import { ContainerExtension as EllipseExtension } from '../ellipse/ext'
import { ContainerExtension as PolygonExtension } from '../polygon/exts'
import { ContainerExtension as PolylineExtension } from '../polyline/exts'
import { ContainerExtension as PathExtension } from '../path/exts'
import { ContainerExtension as ImageExtension } from '../image/exts'
import { ContainerExtension as TextExtension } from '../text/exts'
import { ContainerExtension as TextPathExtension } from '../textpath/exts'
import { ContainerExtension as UseExtension } from '../use/exts'

import { Vessel } from './vessel'

declare module './vessel' {
  interface Vessel<TSVGElement extends SVGElement = SVGElement>
    extends UseExtension<TSVGElement>,
      LineExtension<TSVGElement>,
      RectExtension<TSVGElement>,
      CircleExtension<TSVGElement>,
      EllipseExtension<TSVGElement>,
      PathExtension<TSVGElement>,
      TextExtension<TSVGElement>,
      ImageExtension<TSVGElement>,
      PolygonExtension<TSVGElement>,
      PolylineExtension<TSVGElement>,
      TextPathExtension<TSVGElement> {}
}

applyMixins(
  Vessel,
  // shapes
  UseExtension,
  LineExtension,
  RectExtension,
  CircleExtension,
  EllipseExtension,
  PathExtension,
  ImageExtension,
  PolygonExtension,
  PolylineExtension,
  TextExtension,
  TextPathExtension,
)
