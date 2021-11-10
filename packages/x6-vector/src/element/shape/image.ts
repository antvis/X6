import { Attrs } from '../../types'
import { Global } from '../../global'
import { DomUtil } from '../../util/dom'
import { Attr } from '../../util/attr'
import { Pattern } from '../container/pattern'
import { Shape } from './shape'

@Image.register('Image')
export class Image extends Shape<SVGImageElement> {
  load(url?: string, callback?: Image.Callback | null) {
    if (!url) {
      return this
    }

    const img = new Global.window.Image()

    img.addEventListener('load', (e) => {
      // ensure image size
      if (this.width() === 0 && this.height() === 0) {
        this.size(img.width, img.height)
      }

      const p = this.parent(Pattern)
      if (
        p instanceof Pattern && // ensure pattern size if not set
        p.width() === 0 &&
        p.height() === 0
      ) {
        p.size(this.width(), this.height())
      }

      if (typeof callback === 'function') {
        callback.call(this, e)
      }
    })

    img.src = url

    return this.attr('href', url, DomUtil.namespaces.xlink)
  }
}

export namespace Image {
  export function create(attrs?: Attrs | null): Image
  export function create(url?: string, attrs?: Attrs | null): Image
  export function create(
    url?: string,
    callback?: Image.Callback,
    attrs?: Attrs | null,
  ): Image
  export function create(
    url?: string | Attrs | null,
    callback?: Image.Callback | Attrs | null,
    attrs?: Attrs | null,
  ): Image
  export function create(
    url?: string | Attrs | null,
    callback?: Image.Callback | Attrs | null,
    attrs?: Attrs | null,
  ) {
    const image = new Image().size(0, 0)
    if (url) {
      if (typeof url === 'string') {
        if (typeof callback === 'function' || callback == null) {
          image.load(url, callback)
          if (attrs) {
            image.attr(attrs)
          }
        } else {
          image.load(url).attr(callback)
        }
      } else {
        image.attr(url)
      }
    }
    return image
  }
}

export namespace Image {
  export type Callback = (this: Image, e: Event) => void

  Attr.registerHook<Image>((attr, url: Image | string, elem) => {
    // convert image fill and stroke to patterns
    if (attr === 'fill' || attr === 'stroke') {
      const root = elem.root()
      const defs = root && root.defs()
      if (defs) {
        let image: Image | null = null

        if (typeof url === 'string') {
          const isImage = /\.(jpg|jpeg|png|gif|svg)(\?[^=]+.*)?/i
          if (isImage.test(url)) {
            image = defs.image(url)
          }
        } else {
          image = url
        }

        if (image != null) {
          return defs.pattern(0, 0, (pattern) => pattern.add(image!)).url()
        }
      }
    }

    return url
  })
}
