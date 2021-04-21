import { applyMixins } from '../../util'
import { ElementExtension as AExtension } from '../a/exts'
import { ElementExtension as DescExtension } from '../desc/exts'
import { ElementExtension as TitleExtension } from '../title/exts'
import { ElementExtension as MaskExtension } from '../mask/exts'
import { ElementExtension as StyleExtension } from '../style/exts'
import { ElementExtension as ClipPathExtension } from '../clippath/exts'
import { Base } from '../common/base'
import { Vector } from './vector'
import { Overrides } from './overrides'
import { BBox } from './bbox'
import { FontStyle } from './font'
import { Transform } from './transform'
import { FillStroke } from './fillstroke'

declare module './vector' {
  interface Vector<TSVGElement extends SVGElement = SVGElement>
    extends Base<TSVGElement>,
      FillStroke<TSVGElement>,
      BBox<TSVGElement>,
      AExtension<TSVGElement>,
      DescExtension<TSVGElement>,
      TitleExtension<TSVGElement>,
      ClipPathExtension<TSVGElement>,
      FontStyle<TSVGElement>,
      Transform<TSVGElement>,
      MaskExtension<TSVGElement>,
      StyleExtension<TSVGElement> {}
}

applyMixins(
  Vector,
  Base,
  Overrides,
  BBox,
  AExtension,
  DescExtension,
  TitleExtension,
  ClipPathExtension,
  FontStyle,
  Transform,
  FillStroke,
  MaskExtension,
  StyleExtension,
)
