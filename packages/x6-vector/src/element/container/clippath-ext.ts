import { Attrs } from '../../types'
import { Adopter } from '../adopter'
import { Decorator } from '../decorator'
import { Vector } from '../vector'
import { VectorElement } from '../element'
import { Container } from './container'
import { ClipPath } from './clippath'

export class ContainerExtension<
  TSVGElement extends SVGElement
> extends Vector<TSVGElement> {
  @Decorator.checkDefs
  clip(attrs?: Attrs | null): ClipPath {
    return this.defs()!.clip(attrs)
  }
}

export class DefsExtension<
  TSVGElement extends SVGElement
> extends Vector<TSVGElement> {
  clip(attrs?: Attrs | null): ClipPath {
    return ClipPath.create(attrs).appendTo(this)
  }
}

export class ElementExtension<
  TSVGElement extends SVGElement
> extends Vector<TSVGElement> {
  clipper() {
    return this.reference<ClipPath>('clip-path')
  }

  clipWith(element: ClipPath | Adopter.Target<VectorElement>) {
    // use given clip or create a new one
    let clipper: ClipPath | undefined | null
    if (element instanceof ClipPath) {
      clipper = element
    } else {
      const parent = this.parent<Container>()
      clipper = parent && parent.clip()
      if (clipper) {
        clipper.add(element)
      }
    }

    if (clipper) {
      this.attr('clip-path', `url("#${clipper.id()}")`)
    }

    return this
  }

  unclip() {
    return this.attr('clip-path', null)
  }
}
