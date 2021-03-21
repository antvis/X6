import { Attrs } from '../../types'
import { Vector } from '../vector'
import { Decorator } from '../decorator'
import { Pattern } from './pattern'

type PatternMethod = {
  pattern(attrs?: Attrs | null): Pattern
  pattern(size: number | string, attrs?: Attrs | null): Pattern
  pattern(
    size: number | string,
    update: Pattern.Update,
    attrs?: Attrs | null,
  ): Pattern
  pattern(
    width: number | string,
    height: number | string,
    update: Pattern.Update,
    attrs?: Attrs | null,
  ): Pattern
  pattern(
    width: number | string,
    height: number | string,
    attrs?: Attrs | null,
  ): Pattern
  pattern(
    width?: number | string | Attrs | null,
    height?: number | string | Pattern.Update | Attrs | null,
    update?: Pattern.Update | Attrs | null,
    attrs?: Attrs | null,
  ): Pattern
}

export class ContainerExtension<TSVGElement extends SVGElement>
  extends Vector<TSVGElement>
  implements PatternMethod {
  @Decorator.checkDefs
  pattern(
    width?: number | string | Attrs | null,
    height?: number | string | Pattern.Update | Attrs | null,
    update?: Pattern.Update | Attrs | null,
    attrs?: Attrs | null,
  ) {
    return this.defs()!.pattern(width, height, update, attrs)
  }
}

export class DefsExtension<TSVGElement extends SVGElement>
  extends Vector<TSVGElement>
  implements PatternMethod {
  pattern(
    width?: number | string | Attrs | null,
    height?: number | string | Pattern.Update | Attrs | null,
    update?: Pattern.Update | Attrs | null,
    attrs?: Attrs | null,
  ) {
    return Pattern.create(width, height, update, attrs).appendTo(this)
  }
}
