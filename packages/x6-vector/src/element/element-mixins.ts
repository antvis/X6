import { ObjUtil } from '../util/obj'
import { ElementExtension as StyleExtension } from './shape/style-ext'
import { ElementExtension as MaskExtension } from './container/mask-ext'
import { ElementExtension as ClipPathExtension } from './container/clippath-ext'
import { VectorElement } from './element'

declare module './element' {
  interface VectorElement<TSVGElement extends SVGElement = SVGElement>
    extends ClipPathExtension<TSVGElement>,
      StyleExtension<TSVGElement>,
      MaskExtension<TSVGElement> {}
}

ObjUtil.applyMixins(
  VectorElement,
  MaskExtension,
  StyleExtension,
  ClipPathExtension,
)
