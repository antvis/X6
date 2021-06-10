import { Base } from '../common/base'
import { Text } from '../text/text'
import { Path } from '../path/path'
import { TextPath } from './textpath'
import { SVGTextAttributes } from '../text/types'
import { SVGTextPathAttributes } from './types'

export class ContainerExtension<
  TSVGElement extends SVGElement,
> extends Base<TSVGElement> {
  textPath<Attributes extends SVGTextPathAttributes>(
    text: string | Text,
    path: string | Path,
    attrs?: Attributes,
  ) {
    // 1. create text instance
    const instance = text instanceof Text ? text : new Text()

    // 2. append text to container
    instance.appendTo(this)

    // 3. update text content
    if (typeof text === 'string') {
      instance.text(text)
    }

    return instance.path(path, undefined, attrs)
  }
}

export class TextExtension<
  TTSVGTextElement extends SVGTextElement | SVGTextPathElement,
> extends Base<TTSVGTextElement> {
  path<Attributes extends SVGTextPathAttributes>(
    track: string | Path,
    importNodes = true,
    attrs?: Attributes | null,
  ) {
    const textPath = new TextPath(attrs)

    let path: Path | null = null
    if (track instanceof Path) {
      path = track
    } else {
      const defs = this.defs()
      if (defs) {
        path = defs.path(track)
      }
    }

    if (path) {
      textPath.attr('href', `#${path.id()}`)

      // Transplant all nodes from text to textPath
      let node
      if (importNodes) {
        while ((node = this.node.firstChild)) {
          textPath.node.append(node)
        }
      }
    }

    textPath.appendTo(this)

    return textPath
  }

  textPath() {
    return this.findOne<TextPath>('textPath')
  }
}

export class PathExtension<
  TSVGElement extends SVGElement,
> extends Base<TSVGElement> {
  text<Attributes extends SVGTextAttributes>(
    text: string | Text,
    attrs?: Attributes,
  ) {
    const instance = text instanceof Text ? text : new Text()
    if (attrs) {
      instance.attr(attrs)
    }

    if (!instance.parent()) {
      this.after(instance)
    }

    // update text after the node was appended to the document
    if (typeof text === 'string') {
      instance.text(text)
    }

    return instance.path(this as any)
  }

  targets() {
    const root = this.root()
    return root
      ? root.find<TextPath>('textPath').filter((node) => {
          const href = node.attr<string>('href')
          return href && href.includes(this.id())
        })
      : []
  }
}
