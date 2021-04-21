import { Base } from '../common/base'
import { Desc } from './desc'
import { SVGDescAttributes } from './types'

export class ElementExtension<
  TSVGElement extends SVGElement
> extends Base<TSVGElement> {
  desc<Attributes extends SVGDescAttributes>(attrs?: Attributes | null): Desc
  desc<Attributes extends SVGDescAttributes>(
    desc: string,
    attrs?: Attributes | null,
  ): Desc
  desc<Attributes extends SVGDescAttributes>(
    update: Desc.Update,
    attrs?: Attributes | null,
  ): Desc
  desc<Attributes extends SVGDescAttributes>(
    desc?: string | Desc.Update | Attributes | null,
    attrs?: Attributes | null,
  ) {
    return Desc.create(desc, attrs).appendTo(this)
  }
}
