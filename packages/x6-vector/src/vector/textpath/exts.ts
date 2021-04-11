import { Base } from '../common/base'
import { Vector } from '../vector/vector'
import { Text } from '../text/text'
import { Path } from '../path/path'
import { TextPath } from './textpath'
import { SVGTextAttributes } from '../text/types'
import { SVGTextPathAttributes } from './types'

export class ContainerExtension<
  TSVGElement extends SVGElement
> extends Base<TSVGElement> {
  textPath<Attributes extends SVGTextPathAttributes>(
    text: string | Text,
    path: string | Path,
    attrs?: Attributes,
  ) {
    const instance = text instanceof Text ? text : Text.create(text)
    const textPath = instance.path(path)
    if (attrs) {
      textPath.attr(attrs)
    }
    return textPath
  }
}

export class TextExtension<
  TTSVGTextElement extends SVGTextElement | SVGTextPathElement
> extends Base<TTSVGTextElement> {
  path<Attributes extends SVGTextPathAttributes>(
    track: string | Path,
    importNodes = true,
    attrs?: Attributes | null,
  ) {
    const textPath = new TextPath()

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
      textPath.attr('href', `#${path.toString()}`)

      // Transplant all nodes from text to textPath
      let node
      if (importNodes) {
        while ((node = this.node.firstChild)) {
          textPath.node.append(node)
        }
      }
    }

    if (attrs) {
      textPath.attr(attrs)
    }

    return this.put(textPath)
  }

  textPath() {
    return this.findOne<TextPath>('textPath')
  }
}

export class PathExtension<
  TSVGElement extends SVGElement
> extends Base<TSVGElement> {
  text<Attributes extends SVGTextAttributes>(
    text: string | Text,
    attrs?: Attributes,
  ) {
    const instance = text instanceof Text ? text : Text.create(text)
    if (!instance.parent()) {
      this.after(instance)
    }

    if (attrs) {
      instance.attr(attrs)
    }

    return instance.path(this as any)
  }

  targets<TVector extends Vector>() {
    return Path.find<TVector>(`svg [mask*="${this.id()}"]`)
  }
}
