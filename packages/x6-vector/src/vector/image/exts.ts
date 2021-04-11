import { Base } from '../common/base'
import { Image } from './image'
import { SVGImageAttributes } from './types'

export class ContainerExtension<
  TSVGElement extends SVGElement
> extends Base<TSVGElement> {
  image<Attributes extends SVGImageAttributes>(attrs?: Attributes | null): Image
  image<Attributes extends SVGImageAttributes>(
    url?: string,
    attrs?: Attributes | null,
  ): Image
  image<Attributes extends SVGImageAttributes>(
    url?: string,
    callback?: Image.Callback,
    attrs?: Attributes | null,
  ): Image
  image<Attributes extends SVGImageAttributes>(
    url?: string | Attributes | null,
    callback?: Image.Callback | Attributes | null,
    attrs?: Attributes | null,
  ) {
    return Image.create(url, callback, attrs).appendTo(this)
  }
}
