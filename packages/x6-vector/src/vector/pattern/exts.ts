import { Base } from '../common/base'
import { Decorator } from '../common/decorator'
import { Pattern } from './pattern'
import { SVGPatternAttributes } from './types'

type PatternMethod = {
  pattern<Attributes extends SVGPatternAttributes>(
    attrs?: Attributes | null,
  ): Pattern
  pattern<Attributes extends SVGPatternAttributes>(
    size: number | string,
    attrs?: Attributes | null,
  ): Pattern
  pattern<Attributes extends SVGPatternAttributes>(
    size: number | string,
    update: Pattern.Update,
    attrs?: Attributes | null,
  ): Pattern
  pattern<Attributes extends SVGPatternAttributes>(
    width: number | string,
    height: number | string,
    update: Pattern.Update,
    attrs?: Attributes | null,
  ): Pattern
  pattern<Attributes extends SVGPatternAttributes>(
    width: number | string,
    height: number | string,
    attrs?: Attributes | null,
  ): Pattern
  pattern<Attributes extends SVGPatternAttributes>(
    width?: number | string | Attributes | null,
    height?: number | string | Pattern.Update | Attributes | null,
    update?: Pattern.Update | Attributes | null,
    attrs?: Attributes | null,
  ): Pattern
}

export class ContainerExtension<TSVGElement extends SVGElement>
  extends Base<TSVGElement>
  implements PatternMethod
{
  @Decorator.checkDefs
  pattern<Attributes extends SVGPatternAttributes>(
    width?: number | string | Attributes | null,
    height?: number | string | Pattern.Update | Attributes | null,
    update?: Pattern.Update | Attributes | null,
    attrs?: Attributes | null,
  ) {
    return this.defs()!.pattern(width, height, update, attrs)
  }
}

export class DefsExtension<TSVGElement extends SVGElement>
  extends Base<TSVGElement>
  implements PatternMethod
{
  pattern<Attributes extends SVGPatternAttributes>(
    width?: number | string | Attributes | null,
    height?: number | string | Pattern.Update | Attributes | null,
    update?: Pattern.Update | Attributes | null,
    attrs?: Attributes | null,
  ) {
    return Pattern.create(width, height, update, attrs).appendTo(this)
  }
}
