import { Attrs } from '../../types'
import { Vector } from '../vector'
import { Image } from './image'

export class ContainerExtension<
  TSVGElement extends SVGElement
> extends Vector<TSVGElement> {
  image(attrs?: Attrs | null): Image
  image(url?: string, attrs?: Attrs | null): Image
  image(url?: string, callback?: Image.Callback, attrs?: Attrs | null): Image
  image(
    url?: string | Attrs | null,
    callback?: Image.Callback | Attrs | null,
    attrs?: Attrs | null,
  ) {
    return Image.create(url, callback, attrs).appendTo(this)
  }
}
