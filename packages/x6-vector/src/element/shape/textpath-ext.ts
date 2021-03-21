import { DomUtil } from '../../util/dom'
import { Attrs } from '../../types'
import { Vector } from '../vector'
import { VectorElement } from '../element'
import { Text } from './text'
import { Path } from './path'
import { TextPath } from './textpath'

export class ContainerExtension<
  TSVGElement extends SVGElement
> extends Vector<TSVGElement> {
  textPath(text: string | Text, path: string | Path, attrs?: Attrs) {
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
> extends Vector<TTSVGTextElement> {
  path(track: string | Path, importNodes = true, attrs?: Attrs | null) {
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
      textPath.attr('href', `#${path.toString()}`, DomUtil.namespaces.xlink)

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
> extends Vector<TSVGElement> {
  text(text: string | Text, attrs?: Attrs) {
    const instance = text instanceof Text ? text : Text.create(text)
    if (!instance.parent()) {
      this.after(instance)
    }

    if (attrs) {
      instance.attr(attrs)
    }

    return instance.path(this as any)
  }

  targets<TVector extends VectorElement>() {
    return Path.find<TVector>(`svg [mask*="${this.id()}"]`)
  }
}
