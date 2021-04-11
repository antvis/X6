import { ElementExtension as StyleExtension } from '../style/exts'
import { ElementExtension as MaskExtension } from '../mask/exts'
import { ElementExtension as ClipPathExtension } from '../clippath/exts'
import { Vector } from './vector'
import { Base } from '../common/base'
import { BBox } from './bbox'
import { Transform } from './transform'
import { FillStroke } from './fillstroke'

declare module './vector' {
  interface Vector<TSVGElement extends SVGElement = SVGElement>
    extends Base<TSVGElement>,
      FillStroke<TSVGElement>,
      BBox<TSVGElement>,
      Transform<TSVGElement>,
      MaskExtension<TSVGElement>,
      StyleExtension<TSVGElement>,
      ClipPathExtension<TSVGElement> {}
}

Vector.mixin(
  Base,
  BBox,
  Transform,
  FillStroke,
  MaskExtension,
  StyleExtension,
  ClipPathExtension,
)
