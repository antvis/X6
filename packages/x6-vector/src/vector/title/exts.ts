import { Base } from '../common/base'
import { Title } from './title'
import { SVGTitleAttributes } from './types'

export class ElementExtension<
  TSVGElement extends SVGElement,
> extends Base<TSVGElement> {
  title<Attributes extends SVGTitleAttributes>(attrs?: Attributes | null): Title
  title<Attributes extends SVGTitleAttributes>(
    title: string,
    attrs?: Attributes | null,
  ): Title
  title<Attributes extends SVGTitleAttributes>(
    update: Title.Update,
    attrs?: Attributes | null,
  ): Title
  title<Attributes extends SVGTitleAttributes>(
    title?: string | Title.Update | Attributes | null,
    attrs?: Attributes | null,
  ) {
    return Title.create(title, attrs).appendTo(this)
  }
}
